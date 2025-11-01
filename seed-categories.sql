-- ========================================
-- SEED DATA FOR INTERESTS AND GROUPS
-- Run this in your Supabase SQL Editor
-- ========================================

-- 1. INSERT INTERESTS
INSERT INTO public.interests (name) VALUES
  ('Technology & IT'),
  ('Fun & Hobbies'),
  ('Company & Clients'),
  ('Outings & Events'),
  ('Personal Growth')
ON CONFLICT (name) DO NOTHING;

-- 2. INSERT GROUPS

-- Technology & IT groups
INSERT INTO public.groups (name, interest_id, is_approved)
SELECT 'Software Development', id, true FROM public.interests WHERE name = 'Technology & IT'
UNION ALL
SELECT 'IT Support', id, true FROM public.interests WHERE name = 'Technology & IT';

-- Fun & Hobbies groups
INSERT INTO public.groups (name, interest_id, is_approved)
SELECT 'Gaming', id, true FROM public.interests WHERE name = 'Fun & Hobbies'
UNION ALL
SELECT 'Creative Arts', id, true FROM public.interests WHERE name = 'Fun & Hobbies';

-- Company & Clients groups
INSERT INTO public.groups (name, interest_id, is_approved)
SELECT 'Client Projects', id, true FROM public.interests WHERE name = 'Company & Clients'
UNION ALL
SELECT 'Internal Departments', id, true FROM public.interests WHERE name = 'Company & Clients';

-- Outings & Events groups
INSERT INTO public.groups (name, interest_id, is_approved)
SELECT 'Sports', id, true FROM public.interests WHERE name = 'Outings & Events'
UNION ALL
SELECT 'Food & Drink', id, true FROM public.interests WHERE name = 'Outings & Events';

-- Personal Growth groups
INSERT INTO public.groups (name, interest_id, is_approved)
SELECT 'Learning & Development', id, true FROM public.interests WHERE name = 'Personal Growth'
UNION ALL
SELECT 'Fitness & Wellness', id, true FROM public.interests WHERE name = 'Personal Growth';
