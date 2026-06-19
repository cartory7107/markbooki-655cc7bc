-- Admin panel migration for MarkBook AI
-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor)

-- Admin tool edits table (tracks all admin changes to the catalog)
CREATE TABLE IF NOT EXISTS public.admin_tool_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_name TEXT,                    -- name of tool in JSON catalog (null for new tools)
  tool_data JSONB NOT NULL DEFAULT '{}', -- full tool object {n, d, c, g, p, u, fl}
  action TEXT NOT NULL CHECK (action IN ('add', 'edit', 'delete')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tool submissions table (from the submit page)
CREATE TABLE IF NOT EXISTS public.tool_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  tool_url TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  full_description TEXT,
  category TEXT NOT NULL DEFAULT 'Other',
  pricing TEXT NOT NULL DEFAULT 'Free',
  submitter_name TEXT,
  submitter_email TEXT,
  logo_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.admin_tool_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can insert submissions (with pending status)
CREATE POLICY "Anyone can submit tools" ON public.tool_submissions 
  FOR INSERT WITH CHECK (status = 'pending');

-- Everyone can view approved submissions
CREATE POLICY "Public view approved submissions" ON public.tool_submissions 
  FOR SELECT USING (status = 'approved');

-- Admin full access to both tables
CREATE POLICY "Admins manage tool edits" ON public.admin_tool_edits 
  FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) 
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage submissions" ON public.tool_submissions 
  FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) 
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- Submitters can view their own submissions
CREATE POLICY "Users view own submissions" ON public.tool_submissions 
  FOR SELECT TO authenticated USING (submitter_email = current_email());

-- Updated_at trigger
CREATE TRIGGER update_admin_tool_edits_updated_at 
  BEFORE UPDATE ON public.admin_tool_edits 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tool_submissions_updated_at 
  BEFORE UPDATE ON public.tool_submissions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
