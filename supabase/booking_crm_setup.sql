-- =====================================================================
-- Dhaka Street — Booking & CRM Setup Migration
-- Run this once in the Supabase SQL Editor to set up tables, RPCs, 
-- and RLS policies for the Booking + CRM features.
-- =====================================================================

-- ---------- 1. Configurations & Meta ---------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        text PRIMARY KEY,
  value      text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.site_settings (key, value) VALUES
  ('timezone', 'Asia/Dhaka'), -- Dhaka local timezone
  ('notify_staff_phone', '+8801789977034')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.kit_meta (
  id               boolean PRIMARY KEY DEFAULT true CHECK (id),
  contract_version integer NOT NULL,
  updated_at       timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.kit_meta (id, contract_version) VALUES (true, 1)
ON CONFLICT (id) DO UPDATE
  SET contract_version = EXCLUDED.contract_version, updated_at = now();

-- ---------- 2. Profiles & Roles --------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        text,
  display_name text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Ensure public.user_roles exists (created in initial migration)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid not null REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql security definer SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  -- Automatically grant admin role to the target admin email
  IF new.email IN ('aurkonokrek@gmail.com', 'auronokrek@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Manually insert role for existing user if already signed up
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email IN ('aurkonokrek@gmail.com', 'auronokrek@gmail.com')
ON CONFLICT DO NOTHING;

-- ---------- 3. Core Booking & CRM Tables -----------------------------
CREATE TABLE IF NOT EXISTS public.contacts (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text not null,
  phone                text,
  email                text,
  branch               text,
  details              jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes                text,
  source_submission_id uuid,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_contacts_updated ON public.contacts;
CREATE TRIGGER trg_contacts_updated BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.availability (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday      integer NOT NULL CHECK (weekday BETWEEN 0 AND 6),  -- 0 = Sunday
  start_time   time NOT NULL,
  end_time     time NOT NULL,
  slot_minutes integer NOT NULL DEFAULT 60 CHECK (slot_minutes > 0),
  active       boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  date       date NOT NULL,
  time       time NOT NULL,
  status     text NOT NULL DEFAULT 'pending',   -- pending | confirmed | cancelled
  source     text NOT NULL DEFAULT 'public',
  notes      text,
  details    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS bookings_active_slot_uniq
  ON public.bookings (date, time)
  WHERE status IN ('pending', 'confirmed');

DROP TRIGGER IF EXISTS trg_bookings_updated ON public.bookings;
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.inquiries (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type       text NOT NULL DEFAULT 'contact',   -- contact | consultation
  name       text NOT NULL,
  email      text,
  phone      text,
  message    text,
  language   text NOT NULL DEFAULT 'en',
  status     text NOT NULL DEFAULT 'new',       -- new | contacted | closed
  details    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_outbox (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  event      text NOT NULL,                      -- requested|confirmed|cancelled|rescheduled
  recipient  text NOT NULL DEFAULT 'lead',       -- lead | staff
  to_phone   text,
  payload    jsonb NOT NULL DEFAULT '{}'::jsonb,
  status     text NOT NULL DEFAULT 'queued',     -- queued | sent | failed
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at    timestamptz
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  occurred_at   timestamptz NOT NULL DEFAULT now(),
  event_type    text NOT NULL DEFAULT 'pageview',
  path          text NOT NULL,
  referrer_host text,
  visitor_hash  text NOT NULL,
  country       text,
  device        text
);

CREATE INDEX IF NOT EXISTS analytics_events_occurred_idx
  ON public.analytics_events (occurred_at);

-- ---------- 4. Booking & Analytics RPCs -----------------------------
CREATE OR REPLACE FUNCTION public.kit_timezone()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT value FROM public.site_settings WHERE key = 'timezone'), 'UTC');
$$;

CREATE OR REPLACE FUNCTION public.get_available_slots(p_from date, p_to date)
RETURNS TABLE(slot_date date, slot_time time)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamp := (now() at time zone public.kit_timezone());
BEGIN
  -- guardrails: bad or oversized range returns nothing
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR (p_to - p_from) > 60 THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH dates AS (
    SELECT g::date AS the_date
    FROM generate_series(p_from, p_to, interval '1 day') AS g
  ),
  candidate AS (
    SELECT
      dt.the_date,
      (a.start_time + (n.i * make_interval(mins => a.slot_minutes)))::time AS the_time
    from dates dt
    join public.availability a
      on a.active
     and a.weekday = extract(dow from dt.the_date)::int
    join lateral generate_series(
      0,
      greatest(0, (floor(extract(epoch from (a.end_time - a.start_time))
                         / (a.slot_minutes * 60)) - 1)::int)
    ) as n(i) on true
  )
  SELECT c.the_date, c.the_time
  FROM candidate c
  WHERE (c.the_date > v_now::date
         OR (c.the_date = v_now::date AND c.the_time > v_now::time))
    AND NOT EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.date = c.the_date
        AND b.time = c.the_time
        AND b.status IN ('pending','confirmed')
    )
  ORDER BY c.the_date, c.the_time;
END;
$$;

CREATE OR REPLACE FUNCTION public.request_booking(
  p_name text,
  p_phone text,
  p_child_age int,
  p_branch text,
  p_concern text,
  p_slot_date date,
  p_slot_time time,
  p_language text default 'en'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now        timestamp := (now() at time zone public.kit_timezone());
  v_contact_id uuid;
  v_booking_id uuid;
  v_ok         boolean;
BEGIN
  -- 1. input validation
  IF p_name IS NULL OR length(trim(p_name)) = 0 OR length(p_name) > 120
     OR p_phone IS NULL OR length(trim(p_phone)) < 6
     OR p_branch IS NULL OR length(trim(p_branch)) = 0 THEN
    RETURN jsonb_build_object('status','invalid_input');
  END IF;

  -- 2. slot must be in the future
  IF p_slot_date < v_now::date
     OR (p_slot_date = v_now::date AND p_slot_time <= v_now::time) THEN
    RETURN jsonb_build_object('status','invalid_slot');
  END IF;

  -- 3. slot must fall within active availability
  SELECT exists (
    SELECT 1 FROM public.availability a
    WHERE a.active
      AND a.weekday = extract(dow from p_slot_date)::int
      AND p_slot_time >= a.start_time
      AND p_slot_time <  a.end_time
  ) INTO v_ok;
  IF NOT v_ok THEN
    RETURN jsonb_build_object('status','invalid_slot');
  END IF;

  -- 4. find-or-create contact
  SELECT id INTO v_contact_id
  FROM public.contacts
  WHERE phone = p_phone
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_contact_id IS NULL THEN
    INSERT INTO public.contacts (name, phone, branch, source_submission_id, details)
    VALUES (
      trim(p_name), p_phone, p_branch, null,
      jsonb_strip_nulls(jsonb_build_object(
        'child_age', p_child_age,
        'concern',   nullif(trim(coalesce(p_concern,'')), '')
      ))
    )
    RETURNING id INTO v_contact_id;
  END IF;

  -- 5. insert booking
  BEGIN
    INSERT INTO public.bookings (contact_id, date, time, status, source, details)
    VALUES (
      v_contact_id, p_slot_date, p_slot_time, 'pending', 'public',
      jsonb_strip_nulls(jsonb_build_object('language', nullif(p_language,'')))
    )
    RETURNING id INTO v_booking_id;
  EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('status','slot_taken');
  END;

  RETURN jsonb_build_object('status','ok','booking_id', v_booking_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.reschedule_booking(
  p_booking_id uuid,
  p_slot_date  date,
  p_slot_time  time
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now        timestamp := (now() at time zone public.kit_timezone());
  v_contact_id uuid;
  v_status     text;
  v_phone      text;
  v_name       text;
  v_staff      text;
  v_ok         boolean;
BEGIN
  -- 1. auth: admins only
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('status','forbidden');
  END IF;

  -- 2. load booking
  SELECT b.contact_id, b.status INTO v_contact_id, v_status
  FROM public.bookings b
  WHERE b.id = p_booking_id;

  IF v_contact_id IS NULL OR v_status NOT IN ('pending','confirmed') THEN
    RETURN jsonb_build_object('status','not_found');
  END IF;

  -- 3. new slot must be in the future
  IF p_slot_date < v_now::date
     OR (p_slot_date = v_now::date AND p_slot_time <= v_now::time) THEN
    RETURN jsonb_build_object('status','invalid_slot');
  END IF;

  -- 4. new slot must fall within active availability
  SELECT exists (
    SELECT 1 FROM public.availability a
    WHERE a.active
      AND a.weekday = extract(dow from p_slot_date)::int
      AND p_slot_time >= a.start_time
      AND p_slot_time <  a.end_time
  ) INTO v_ok;
  IF NOT v_ok THEN
    RETURN jsonb_build_object('status','invalid_slot');
  END IF;

  -- 5. new slot must be free
  IF exists (
    SELECT 1 FROM public.bookings b
    WHERE b.date = p_slot_date
      AND b.time = p_slot_time
      AND b.status IN ('pending','confirmed')
      AND b.id <> p_booking_id
  ) THEN
    RETURN jsonb_build_object('status','slot_taken');
  END IF;

  -- 6. move the booking
  BEGIN
    UPDATE public.bookings
    SET date = p_slot_date, time = p_slot_time
    WHERE id = p_booking_id;
  EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('status','slot_taken');
  END;

  -- 7. notify both parties
  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.contacts c WHERE c.id = v_contact_id;

  SELECT value INTO v_staff
  FROM public.site_settings WHERE key = 'notify_staff_phone';

  -- staff
  IF coalesce(v_staff, '') <> '' THEN
    INSERT INTO public.notification_outbox (booking_id, event, recipient, to_phone, payload)
    VALUES (p_booking_id, 'rescheduled', 'staff', v_staff,
            jsonb_build_object('name', v_name, 'date', p_slot_date,
                               'time', p_slot_time, 'status', v_status));
  END IF;

  -- lead
  IF coalesce(v_phone, '') <> '' THEN
    INSERT INTO public.notification_outbox (booking_id, event, recipient, to_phone, payload)
    VALUES (p_booking_id, 'rescheduled', 'lead', v_phone,
            jsonb_build_object('name', v_name, 'date', p_slot_date,
                               'time', p_slot_time, 'status', v_status));
  END IF;

  RETURN jsonb_build_object('status','ok');
END;
$$;

-- ---------- 5. Analytics RPCs ----------------------------------------
CREATE OR REPLACE FUNCTION public.analytics_traffic(p_from date, p_to date)
RETURNS TABLE(day date, pageviews bigint, unique_visitors bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (e.occurred_at at time zone public.kit_timezone())::date as day,
    count(*)::bigint as pageviews,
    count(distinct e.visitor_hash)::bigint as unique_visitors
  FROM public.analytics_events e
  WHERE has_role(auth.uid(), 'admin')
    AND e.event_type = 'pageview'
    AND (e.occurred_at at time zone public.kit_timezone())::date between p_from and p_to
  GROUP BY 1
  ORDER BY 1;
$$;

CREATE OR REPLACE FUNCTION public.analytics_top_pages(p_from date, p_to date, p_limit int default 20)
RETURNS TABLE(path text, pageviews bigint, unique_visitors bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    e.path,
    count(*)::bigint as pageviews,
    count(distinct e.visitor_hash)::bigint as unique_visitors
  FROM public.analytics_events e
  WHERE has_role(auth.uid(), 'admin')
    AND e.event_type = 'pageview'
    AND (e.occurred_at at time zone public.kit_timezone())::date between p_from and p_to
  GROUP BY e.path
  ORDER BY pageviews desc
  LIMIT greatest(1, least(coalesce(p_limit, 20), 100));
$$;

CREATE OR REPLACE FUNCTION public.analytics_sources(p_from date, p_to date)
RETURNS TABLE(source text, referrer_host text, pageviews bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE
      WHEN e.referrer_host is null or e.referrer_host = '' THEN 'direct'
      WHEN e.referrer_host ~* '(^|\.)(google|bing|yahoo|duckduckgo|ecosia)\.' THEN 'search'
      WHEN e.referrer_host ~* '(^|\.)(facebook|instagram|twitter|linkedin|youtube|whatsapp|tiktok)\.'
        OR e.referrer_host ~* '(^|\.)(t\.co|x\.com)(\.|$)' THEN 'social'
      ELSE 'referral'
    END AS source,
    e.referrer_host,
    count(*)::bigint as pageviews
  FROM public.analytics_events e
  WHERE has_role(auth.uid(), 'admin')
    AND e.event_type = 'pageview'
    AND (e.occurred_at at time zone public.kit_timezone())::date between p_from and p_to
  GROUP BY 1, 2
  ORDER BY pageviews desc;
$$;

CREATE OR REPLACE FUNCTION public.analytics_by_country(p_from date, p_to date)
RETURNS TABLE(country text, pageviews bigint, unique_visitors bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    coalesce(nullif(e.country, ''), 'Unknown') as country,
    count(*)::bigint as pageviews,
    count(distinct e.visitor_hash)::bigint as unique_visitors
  FROM public.analytics_events e
  WHERE has_role(auth.uid(), 'admin')
    AND e.event_type = 'pageview'
    AND (e.occurred_at at time zone public.kit_timezone())::date between p_from and p_to
  GROUP BY 1
  ORDER BY pageviews desc;
$$;

CREATE OR REPLACE FUNCTION public.analytics_conversions(p_from date, p_to date)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT case when not has_role(auth.uid(), 'admin') then '{}'::jsonb else
    jsonb_build_object(
      'bookings_by_status', coalesce((
        select jsonb_object_agg(status, n)
        from (
          select b.status, count(*)::int as n
          from public.bookings b
          where b.date between p_from and p_to
          group by b.status
        ) s
      ), '{}'::jsonb),
      'consultation_submissions', (
        select count(*)::int from public.inquiries q
        where q.type = 'consultation'
          and (q.created_at at time zone public.kit_timezone())::date between p_from and p_to
      ),
      'contact_submissions', (
        select count(*)::int from public.inquiries q
        where q.type = 'contact'
          and (q.created_at at time zone public.kit_timezone())::date between p_from and p_to
      ),
      'book_consultation_views', (
        select count(*)::int from public.analytics_events e
        where e.event_type = 'pageview' and e.path = '/book-consultation'
          and (e.occurred_at at time zone public.kit_timezone())::date between p_from and p_to
      ),
      'contact_views', (
        select count(*)::int from public.analytics_events e
        where e.event_type = 'pageview' and e.path = '/contact'
          and (e.occurred_at at time zone public.kit_timezone())::date between p_from and p_to
      )
    )
  end;
$$;

-- ---------- 6. Notifications Enqueue trigger -------------------------
CREATE OR REPLACE FUNCTION public.enqueue_booking_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event text;
  v_phone text;
  v_name  text;
  v_staff text;
BEGIN
  IF (tg_op = 'INSERT') THEN
    v_event := 'requested';
  ELSIF (tg_op = 'UPDATE' and new.status is distinct from old.status) THEN
    IF new.status = 'confirmed' THEN v_event := 'confirmed';
    ELSIF new.status = 'cancelled' THEN v_event := 'cancelled';
    ELSE RETURN new; END IF;
  ELSE
    RETURN new;
  END IF;

  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.contacts c WHERE c.id = new.contact_id;

  SELECT value INTO v_staff
  FROM public.site_settings WHERE key = 'notify_staff_phone';

  -- Staff alert
  IF v_event in ('requested', 'confirmed') and coalesce(v_staff, '') <> '' THEN
    INSERT INTO public.notification_outbox (booking_id, event, recipient, to_phone, payload)
    VALUES (new.id, v_event, 'staff', v_staff,
            jsonb_build_object('name', v_name, 'date', new.date,
                               'time', new.time, 'status', new.status));
  END IF;

  -- Lead message
  IF v_event in ('confirmed', 'cancelled') and coalesce(v_phone, '') <> '' THEN
    INSERT INTO public.notification_outbox (booking_id, event, recipient, to_phone, payload)
    VALUES (new.id, v_event, 'lead', v_phone,
            jsonb_build_object('name', v_name, 'date', new.date,
                               'time', new.time, 'status', new.status));
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_booking_notification ON public.bookings;
CREATE TRIGGER trg_booking_notification
  AFTER INSERT OR UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.enqueue_booking_notification();

-- ---------- 7. Row Level Security & Permissions ----------------------
ALTER TABLE public.kit_meta ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.kit_meta TO anon, authenticated;
DROP POLICY IF EXISTS kit_meta_read ON public.kit_meta;
CREATE POLICY kit_meta_read ON public.kit_meta FOR SELECT USING (true);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
DROP POLICY IF EXISTS site_settings_admin ON public.site_settings;
CREATE POLICY site_settings_admin ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
DROP POLICY IF EXISTS profiles_self_or_admin_read ON public.profiles;
CREATE POLICY profiles_self_or_admin_read ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- Ensure user_roles policies are set up correctly
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
DROP POLICY IF EXISTS user_roles_self_read ON public.user_roles;
CREATE POLICY user_roles_self_read ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS user_roles_admin_manage ON public.user_roles;
CREATE POLICY user_roles_admin_manage ON public.user_roles
  FOR all TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.availability TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.availability TO authenticated;
GRANT ALL ON public.availability TO service_role;
DROP POLICY IF EXISTS availability_public_read ON public.availability;
CREATE POLICY availability_public_read ON public.availability
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS availability_admin_write ON public.availability;
CREATE POLICY availability_admin_write ON public.availability
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.contacts FROM anon;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
DROP POLICY IF EXISTS contacts_admin_all ON public.contacts;
CREATE POLICY contacts_admin_all ON public.contacts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.bookings FROM anon;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
DROP POLICY IF EXISTS bookings_admin_all ON public.bookings;
CREATE POLICY bookings_admin_all ON public.bookings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
DROP POLICY IF EXISTS inquiries_anon_insert ON public.inquiries;
CREATE POLICY inquiries_anon_insert ON public.inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS inquiries_admin_read ON public.inquiries;
CREATE POLICY inquiries_admin_read ON public.inquiries
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS inquiries_admin_manage ON public.inquiries;
CREATE POLICY inquiries_admin_manage ON public.inquiries
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.notification_outbox FROM anon;
ALTER TABLE public.notification_outbox ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.notification_outbox TO authenticated;
GRANT ALL ON public.notification_outbox TO service_role;
DROP POLICY IF EXISTS outbox_admin_read ON public.notification_outbox;
CREATE POLICY outbox_admin_read ON public.notification_outbox
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.analytics_events FROM anon, authenticated;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.analytics_events TO service_role;
GRANT ALL ON public.analytics_events TO service_role;

GRANT EXECUTE ON FUNCTION
  public.get_available_slots(date, date),
  public.request_booking(text, text, int, text, text, date, time, text)
TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.reschedule_booking(uuid, date, time) TO authenticated;

GRANT EXECUTE ON FUNCTION
  public.analytics_traffic(date, date),
  public.analytics_top_pages(date, date, int),
  public.analytics_sources(date, date),
  public.analytics_by_country(date, date),
  public.analytics_conversions(date, date)
TO authenticated;

-- ---------- 8. Default Availability Data Seed ------------------------
-- Sane default bookable windows (Mon–Fri, 09:00–12:00, 14:00–17:00).
INSERT INTO public.availability (weekday, start_time, end_time, slot_minutes, active)
SELECT w, t.start_time, t.end_time, 60, true
FROM (values (1),(2),(3),(4),(5)) as d(w)                       -- Mon..Fri
CROSS JOIN (values (time '09:00', time '12:00'),
                   (time '14:00', time '17:00')) as t(start_time, end_time)
WHERE NOT EXISTS (SELECT 1 FROM public.availability);
