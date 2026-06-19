
DROP POLICY "Authenticated can submit" ON public.tool_submissions;
CREATE POLICY "Authenticated can submit"
  ON public.tool_submissions FOR INSERT TO authenticated
  WITH CHECK (submitter_user_id = auth.uid());

REVOKE EXECUTE ON FUNCTION public.grant_admin_to_owner() FROM PUBLIC, anon, authenticated;
