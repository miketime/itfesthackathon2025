-- ========================================
-- ROW LEVEL SECURITY POLICIES
-- Run this in your Supabase SQL Editor
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subgroups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interest_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_group_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subgroup_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- INTERESTS - Everyone can read
-- ========================================
CREATE POLICY "Anyone can view interests"
  ON public.interests
  FOR SELECT
  USING (true);

-- ========================================
-- GROUPS - Everyone can read approved groups
-- ========================================
CREATE POLICY "Anyone can view approved groups"
  ON public.groups
  FOR SELECT
  USING (is_approved = true);

-- ========================================
-- SUBGROUPS - Everyone can read
-- ========================================
CREATE POLICY "Anyone can view subgroups"
  ON public.subgroups
  FOR SELECT
  USING (true);

-- ========================================
-- USER SUBSCRIPTIONS - Users can manage their own
-- ========================================

-- Interest subscriptions
CREATE POLICY "Users can view their own interest subscriptions"
  ON public.user_interest_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interest subscriptions"
  ON public.user_interest_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interest subscriptions"
  ON public.user_interest_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Group subscriptions
CREATE POLICY "Users can view their own group subscriptions"
  ON public.user_group_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own group subscriptions"
  ON public.user_group_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own group subscriptions"
  ON public.user_group_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Subgroup subscriptions
CREATE POLICY "Users can view their own subgroup subscriptions"
  ON public.user_subgroup_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subgroup subscriptions"
  ON public.user_subgroup_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subgroup subscriptions"
  ON public.user_subgroup_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- PROFILES - Users can view all, edit their own
-- ========================================
CREATE POLICY "Anyone can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- POSTS - Users can view all, create their own
-- ========================================
CREATE POLICY "Anyone can view posts"
  ON public.posts
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- POST LIKES
-- ========================================
CREATE POLICY "Anyone can view post likes"
  ON public.post_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- COMMENTS
-- ========================================
CREATE POLICY "Anyone can view comments"
  ON public.comments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- MESSAGES - Users can only see their own conversations
-- ========================================
CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can send messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
