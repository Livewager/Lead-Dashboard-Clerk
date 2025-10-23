# 🚀 Quick Setup - Run This First!

## The app is deployed but the database needs to be initialized

### **Step 1: Set Up Supabase Database (5 minutes)**

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/dujlrmzxltsxcmipxxij/sql
   
2. **Run Migration 1 - Create Tables**
   - Click "New query"
   - Copy ALL contents from `supabase/migrations/0001_init.sql`
   - Paste into the SQL editor
   - Click "Run" (bottom right)
   - Wait for "Success. No rows returned"

3. **Run Migration 2 - Update Policies**
   - Click "New query" again
   - Copy ALL contents from `supabase/migrations/0002_update_rls_policies.sql`
   - Paste into the SQL editor
   - Click "Run"
   - Wait for "Success"

4. **Add Demo Data (Optional)**
   - Click "New query"
   - Copy ALL contents from `supabase/seed.sql`
   - Paste and run
   - This creates sample leads for testing

### **Step 2: Enable Realtime (1 minute)**

1. **Go to**: https://supabase.com/dashboard/project/dujlrmzxltsxcmipxxij/database/replication
2. **Find the "leads" table**
3. **Toggle it ON** to enable real-time updates

### **Step 3: Test the App**

1. **Refresh your Vercel app**: https://super-lead-dashboard-czmbyrjab-jhordans-projects-272eaf31.vercel.app
2. **Sign in** with your Clerk account
3. **Try claiming a lead** - should work now!
4. **Check Account page** - should load your profile

---

## ⚠️ Current Errors You're Seeing:

- ❌ **"Failed to claim lead"** → Database tables don't exist yet
- ❌ **"Failed to load clinic information"** → Clinics table doesn't exist

## ✅ After Running Migrations:

- ✅ Claim leads successfully
- ✅ Load clinic profile
- ✅ View "My Leads"
- ✅ Real-time lead updates
- ✅ Full contact info after claiming

---

## 📋 Migrations Summary:

**Migration 1 (0001_init.sql)** creates:
- `clinics` table (your profile)
- `leads` table (all leads)
- `lead_photos` table (lead images)
- `lead_claims` table (purchase records)
- `lead_locks` table (prevent race conditions)
- RLS policies for security

**Migration 2 (0002_update_rls_policies.sql)** updates:
- Allows clinics to create claims
- Allows clinics to create profiles
- Allows updating lead status when claiming
- Proper read permissions for claims

---

**Total time**: ~5-7 minutes to complete setup
**Result**: Fully functional lead management system!

