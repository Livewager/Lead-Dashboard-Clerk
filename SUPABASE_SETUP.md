# Supabase Setup Guide

## Prerequisites
- Supabase account at [https://supabase.com](https://supabase.com)
- Project created with the credentials you provided

## Step 1: Run Database Migrations

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/dujlrmzxltsxcmipxxij
2. **Navigate to**: SQL Editor
3. **Run Migration 1** - Copy and paste the contents of `supabase/migrations/0001_init.sql`
4. **Click "Run"**
5. **Run Migration 2** - Copy and paste the contents of `supabase/migrations/0002_update_rls_policies.sql`
6. **Click "Run"**

## Step 2: Configure Clerk Integration

1. **Go to Supabase Dashboard** → Authentication → Providers
2. **Scroll to "Custom" section**
3. **Enable Custom JWT**
4. **Set JWT Secret**: `ERdt1xa29Rz+sgh4PW+DEqHBkwEmxz+vCD+/YXVBqba3ZLif76bfQQPGhP9cXvbcNRGw+FbpyDzfx45kq1ts7Q==`

## Step 3: Set up Clerk JWT Template

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com
2. **Navigate to**: JWT Templates
3. **Create New Template** named "supabase"
4. **Add this configuration**:
```json
{
  "aud": "authenticated",
  "exp": {{(user.created_at + 3600) * 1000}},
  "iat": {{user.created_at}},
  "iss": "https://dujlrmzxltsxcmipxxij.supabase.co/auth/v1",
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "role": "authenticated"
}
```

## Step 4: Seed Demo Data (Optional)

1. **Go to**: SQL Editor in Supabase
2. **Run**: Contents of `supabase/seed.sql`
3. **This will create**: Sample leads and demo data for testing

## Step 5: Enable Realtime

1. **Go to**: Database → Replication
2. **Find the "leads" table**
3. **Enable Replication** for real-time updates

## Step 6: Verify Environment Variables

Make sure these are set in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dujlrmzxltsxcmipxxij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Step 7: Test the Integration

1. **Sign up** for a new clinic account
2. **Try claiming** a lead
3. **Check Account page** - it should load your profile
4. **View "My Leads"** - should show only your claimed leads

## Troubleshooting

### "Failed to claim lead"
- Check that Migration 2 has been run (updates RLS policies)
- Verify Clerk JWT template is configured
- Check browser console for specific errors

### "Failed to load clinic information"
- Ensure clinics table exists
- Check that you're logged in with Clerk
- Verify RLS policies allow reading own clinic

### Images not loading
- Check that lead_photos table has data
- Verify Unsplash images are accessible
- Check Next.js image domains configuration

## Current Status

✅ Environment variables configured in Vercel  
⏳ Database migrations need to be run in Supabase  
⏳ Clerk JWT template needs to be configured  
⏳ Realtime replication needs to be enabled  

