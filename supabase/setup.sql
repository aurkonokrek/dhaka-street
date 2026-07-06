-- =====================================================================
-- Dhaka Street — full backend setup for a fresh Supabase project
-- Run this once in the Supabase SQL Editor after connecting your project.
-- Idempotent: safe to re-run.
-- =====================================================================

-- ---------- Roles ----------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- ---------- updated_at helper ----------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ---------- Announcements --------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Announcements are viewable by everyone" ON public.announcements;
CREATE POLICY "Announcements are viewable by everyone" ON public.announcements
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage announcements" ON public.announcements;
CREATE POLICY "Admins manage announcements" ON public.announcements
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---------- Hours ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_label text NOT NULL,
  hours_text text NOT NULL,
  is_open boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hours TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hours TO authenticated;
GRANT ALL ON public.hours TO service_role;
ALTER TABLE public.hours ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Hours are viewable by everyone" ON public.hours;
CREATE POLICY "Hours are viewable by everyone" ON public.hours
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage hours" ON public.hours;
CREATE POLICY "Admins manage hours" ON public.hours
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS hours_set_updated_at ON public.hours;
CREATE TRIGGER hours_set_updated_at BEFORE UPDATE ON public.hours
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- Video settings -------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_url text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.video_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.video_settings TO authenticated;
GRANT ALL ON public.video_settings TO service_role;
ALTER TABLE public.video_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Video settings are viewable by everyone" ON public.video_settings;
CREATE POLICY "Video settings are viewable by everyone" ON public.video_settings
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage video settings" ON public.video_settings;
CREATE POLICY "Admins manage video settings" ON public.video_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS video_settings_set_updated_at ON public.video_settings;
CREATE TRIGGER video_settings_set_updated_at BEFORE UPDATE ON public.video_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- Menu items -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  price text NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Menu items are viewable by everyone" ON public.menu_items;
CREATE POLICY "Menu items are viewable by everyone" ON public.menu_items
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage menu items" ON public.menu_items;
CREATE POLICY "Admins manage menu items" ON public.menu_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS menu_items_set_updated_at ON public.menu_items;
CREATE TRIGGER menu_items_set_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- Moments (gallery) ----------------------------------------
CREATE TABLE IF NOT EXISTS public.moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.moments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.moments TO authenticated;
GRANT ALL ON public.moments TO service_role;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Moments are viewable by everyone" ON public.moments;
CREATE POLICY "Moments are viewable by everyone" ON public.moments
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage moments" ON public.moments;
CREATE POLICY "Admins manage moments" ON public.moments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---------- Storage bucket: moments ----------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('moments', 'moments', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Public can view moments" ON storage.objects;
CREATE POLICY "Public can view moments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'moments');

DROP POLICY IF EXISTS "Admins can upload moments" ON storage.objects;
CREATE POLICY "Admins can upload moments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'moments' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update moments" ON storage.objects;
CREATE POLICY "Admins can update moments"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'moments' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete moments" ON storage.objects;
CREATE POLICY "Admins can delete moments"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'moments' AND public.has_role(auth.uid(), 'admin'));

-- ---------- Grant yourself admin -------------------------------------
-- After creating your account via /admin, run:
--   INSERT INTO public.user_roles (user_id, role)
--   SELECT id, 'admin' FROM auth.users WHERE email = 'you@example.com';
