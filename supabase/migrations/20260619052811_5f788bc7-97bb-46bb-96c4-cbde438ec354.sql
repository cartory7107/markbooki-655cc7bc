
-- Tool submissions table (used by /submit and admin Submissions tab)
CREATE TABLE public.tool_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  tool_url text NOT NULL,
  description text NOT NULL,
  full_description text,
  category text NOT NULL DEFAULT 'Other',
  pricing text NOT NULL DEFAULT 'Free',
  submitter_name text,
  submitter_email text,
  submitter_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  logo_url text,
  tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tool_submissions TO authenticated;
GRANT ALL ON public.tool_submissions TO service_role;
ALTER TABLE public.tool_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can submit"
  ON public.tool_submissions FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Submitter can view own submissions"
  ON public.tool_submissions FOR SELECT TO authenticated
  USING (submitter_user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can update submissions"
  ON public.tool_submissions FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can delete submissions"
  ON public.tool_submissions FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_tool_submissions_updated_at
  BEFORE UPDATE ON public.tool_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin tool edits table (overlay of catalog: add/edit/delete actions)
CREATE TABLE public.admin_tool_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_name text,
  tool_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  action text NOT NULL CHECK (action IN ('add', 'edit', 'delete')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_tool_edits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_tool_edits TO authenticated;
GRANT ALL ON public.admin_tool_edits TO service_role;
ALTER TABLE public.admin_tool_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view admin edits"
  ON public.admin_tool_edits FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage admin edits"
  ON public.admin_tool_edits FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_admin_tool_edits_updated_at
  BEFORE UPDATE ON public.admin_tool_edits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant admin role to cartory7107@gmail.com if account exists, and auto-grant on future signups
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'cartory7107@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

CREATE OR REPLACE FUNCTION public.grant_admin_to_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'cartory7107@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grant_admin_to_owner_trigger ON auth.users;
CREATE TRIGGER grant_admin_to_owner_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_admin_to_owner();
