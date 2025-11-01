# Company Social Network - Setup Guide

## Prerequisites
- Node.js 18+ installed
- Git installed
- Vercel account (already connected)
- Supabase account (free tier works)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Project Name**: company-social-network (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
5. Click "Create new project" (takes ~2 minutes)

### Get Your Supabase Credentials
1. Once created, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` `public` key)

### Create Environment Variables
1. Create a file named `.env.local` in your project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace the values with your actual Supabase credentials

### Create Database Tables
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste this SQL:

```sql
-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read posts (for now)
CREATE POLICY "Allow public read access" ON posts
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert posts (you'll want to restrict this later with auth)
CREATE POLICY "Allow public insert access" ON posts
  FOR INSERT WITH CHECK (true);

-- Create an index for faster queries
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
```

4. Click "Run" to execute

## Step 3: Configure Vercel with Supabase

### Add Environment Variables to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
     **Value**: Your Supabase project URL
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     **Value**: Your Supabase anon key
5. Click "Save"

## Step 4: Test Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## Step 5: Deploy to Vercel

### Push Changes to Git
```bash
git add .
git commit -m "Add Next.js app with Supabase integration"
git push origin main
```

Vercel will automatically:
- Detect the push
- Build your Next.js app
- Deploy to production
- Your site will be live in ~2 minutes!

### Check Deployment
1. Go to Vercel dashboard
2. You'll see the deployment in progress
3. Once complete, click the deployment URL to view your live site

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── feed/
│   │   └── page.tsx        # Feed page (shows posts from Supabase)
│   └── profile/
│       └── page.tsx        # Profile page
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── .env.local              # Local environment variables (DO NOT COMMIT)
├── .env.local.example      # Example env file
└── package.json            # Dependencies
```

## Next Steps

1. **Add Authentication**: Use Supabase Auth for user login
2. **Create Posts**: Add a form to create new posts
3. **User Profiles**: Link posts to authenticated users
4. **Likes & Comments**: Add social features
5. **File Uploads**: Use Supabase Storage for images

## Troubleshooting

### Deployment not triggering?
- Make sure you've pushed to the correct branch (usually `main`)
- Check Vercel dashboard → Settings → Git to see which branch is deployed

### Environment variables not working?
- Make sure they're added in both `.env.local` (local) AND Vercel Settings (production)
- Redeploy after adding Vercel env vars

### Database errors?
- Check if the SQL table creation ran successfully
- Verify your Supabase credentials are correct
- Check Supabase dashboard → Table Editor to see if `posts` table exists

## Support

- Next.js Docs: [https://nextjs.org/docs](https://nextjs.org/docs)
- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Vercel Docs: [https://vercel.com/docs](https://vercel.com/docs)
