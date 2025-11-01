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

-- 3. INSERT SUBGROUPS

-- Software Development subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'Frontend Development', id FROM public.groups WHERE name = 'Software Development'
UNION ALL
SELECT 'Backend Development', id FROM public.groups WHERE name = 'Software Development'
UNION ALL
SELECT 'Mobile Development', id FROM public.groups WHERE name = 'Software Development'
UNION ALL
SELECT 'DevOps', id FROM public.groups WHERE name = 'Software Development'
UNION ALL
SELECT 'QA & Testing', id FROM public.groups WHERE name = 'Software Development';

-- IT Support subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'Help Desk', id FROM public.groups WHERE name = 'IT Support'
UNION ALL
SELECT 'Network Administration', id FROM public.groups WHERE name = 'IT Support'
UNION ALL
SELECT 'Security', id FROM public.groups WHERE name = 'IT Support'
UNION ALL
SELECT 'Hardware Support', id FROM public.groups WHERE name = 'IT Support';

-- Gaming subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'PC Gaming', id FROM public.groups WHERE name = 'Gaming'
UNION ALL
SELECT 'Console Gaming', id FROM public.groups WHERE name = 'Gaming'
UNION ALL
SELECT 'Mobile Gaming', id FROM public.groups WHERE name = 'Gaming'
UNION ALL
SELECT 'Board Games', id FROM public.groups WHERE name = 'Gaming'
UNION ALL
SELECT 'E-sports', id FROM public.groups WHERE name = 'Gaming';

-- Creative Arts subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'Photography', id FROM public.groups WHERE name = 'Creative Arts'
UNION ALL
SELECT 'Music', id FROM public.groups WHERE name = 'Creative Arts'
UNION ALL
SELECT 'Drawing & Painting', id FROM public.groups WHERE name = 'Creative Arts'
UNION ALL
SELECT 'Writing', id FROM public.groups WHERE name = 'Creative Arts'
UNION ALL
SELECT 'Video Production', id FROM public.groups WHERE name = 'Creative Arts';

-- Client Projects subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'Project Alpha', id FROM public.groups WHERE name = 'Client Projects'
UNION ALL
SELECT 'Project Beta', id FROM public.groups WHERE name = 'Client Projects'
UNION ALL
SELECT 'Project Gamma', id FROM public.groups WHERE name = 'Client Projects'
UNION ALL
SELECT 'Client A', id FROM public.groups WHERE name = 'Client Projects'
UNION ALL
SELECT 'Client B', id FROM public.groups WHERE name = 'Client Projects';

-- Internal Departments subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'HR', id FROM public.groups WHERE name = 'Internal Departments'
UNION ALL
SELECT 'Finance', id FROM public.groups WHERE name = 'Internal Departments'
UNION ALL
SELECT 'Marketing', id FROM public.groups WHERE name = 'Internal Departments'
UNION ALL
SELECT 'Sales', id FROM public.groups WHERE name = 'Internal Departments'
UNION ALL
SELECT 'Operations', id FROM public.groups WHERE name = 'Internal Departments';

-- Sports subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'Football/Soccer', id FROM public.groups WHERE name = 'Sports'
UNION ALL
SELECT 'Basketball', id FROM public.groups WHERE name = 'Sports'
UNION ALL
SELECT 'Tennis', id FROM public.groups WHERE name = 'Sports'
UNION ALL
SELECT 'Running', id FROM public.groups WHERE name = 'Sports'
UNION ALL
SELECT 'Cycling', id FROM public.groups WHERE name = 'Sports';

-- Food & Drink subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'Restaurants', id FROM public.groups WHERE name = 'Food & Drink'
UNION ALL
SELECT 'Coffee Spots', id FROM public.groups WHERE name = 'Food & Drink'
UNION ALL
SELECT 'Cooking', id FROM public.groups WHERE name = 'Food & Drink'
UNION ALL
SELECT 'Wine & Beer', id FROM public.groups WHERE name = 'Food & Drink'
UNION ALL
SELECT 'Lunch Groups', id FROM public.groups WHERE name = 'Food & Drink';

-- Learning & Development subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'Technical Skills', id FROM public.groups WHERE name = 'Learning & Development'
UNION ALL
SELECT 'Leadership Training', id FROM public.groups WHERE name = 'Learning & Development'
UNION ALL
SELECT 'Certifications', id FROM public.groups WHERE name = 'Learning & Development'
UNION ALL
SELECT 'Workshops', id FROM public.groups WHERE name = 'Learning & Development'
UNION ALL
SELECT 'Mentorship', id FROM public.groups WHERE name = 'Learning & Development';

-- Fitness & Wellness subgroups
INSERT INTO public.subgroups (name, group_id)
SELECT 'Gym Workouts', id FROM public.groups WHERE name = 'Fitness & Wellness'
UNION ALL
SELECT 'Yoga', id FROM public.groups WHERE name = 'Fitness & Wellness'
UNION ALL
SELECT 'Mental Health', id FROM public.groups WHERE name = 'Fitness & Wellness'
UNION ALL
SELECT 'Nutrition', id FROM public.groups WHERE name = 'Fitness & Wellness'
UNION ALL
SELECT 'Running Club', id FROM public.groups WHERE name = 'Fitness & Wellness';
