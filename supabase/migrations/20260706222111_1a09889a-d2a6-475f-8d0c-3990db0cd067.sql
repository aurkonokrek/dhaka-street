
CREATE POLICY "Public can view moments"
ON storage.objects FOR SELECT
USING (bucket_id = 'moments');

CREATE POLICY "Admins can upload moments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'moments' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update moments"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'moments' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete moments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'moments' AND public.has_role(auth.uid(), 'admin'));

-- The has_role EXECUTE grant is scoped to the policy evaluator role; re-grant for storage RLS use.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
