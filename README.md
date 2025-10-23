# Clinic Concierge Leads Dashboard

A premium lead management dashboard for beauty clinics, built with Next.js, TypeScript, and modern web technologies.

## Features

- 🎨 **Premium Dark UI** - Beautiful, modern interface with glass effects and animations
- 📊 **Real-time Dashboard** - Live updates with KPI cards and lead metrics
- 🔐 **Secure Authentication** - Clerk integration with JWT verification
- 💾 **Database Integration** - Supabase with Row Level Security (RLS)
- 📱 **Responsive Design** - Perfect on desktop and mobile
- ⚡ **Real-time Updates** - Live lead notifications and animations
- 🎯 **Lead Management** - Claim, preview, and track leads with different tiers
- 📈 **Analytics** - Comprehensive dashboard with charts and metrics

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui + Radix UI
- **Charts**: Tremor (beautiful, readable charts)
- **Authentication**: Clerk (email/password + OAuth)
- **Database**: Supabase (PostgreSQL with RLS)
- **State Management**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Notifications**: Sonner (toasts)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lead-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Supabase Database
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME=Clinic Concierge Leads
   LEAD_CLAIM_TAX_RATE=0.00
   LEAD_CLAIM_FEE_FLAT=0
   ```

4. **Database Setup**
   
   Run the migration in your Supabase SQL editor:
   ```bash
   # Copy the contents of supabase/migrations/0001_init.sql
   # and run it in your Supabase project
   ```
   
   Optionally, run the seed script for test data:
   ```bash
   # Copy the contents of supabase/seed.sql
   # and run it in your Supabase project
   ```

5. **Clerk Setup**
   
   - Create a new Clerk application
   - Configure authentication methods (email/password + OAuth)
   - Add your domain to allowed origins
   - Copy the publishable key and secret key to your `.env.local`

6. **Supabase Setup**
   
   - Create a new Supabase project
   - Run the migration SQL
   - Enable Row Level Security
   - Configure realtime for the leads table
   - Copy the URL and keys to your `.env.local`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

1. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` to client

3. **Update Clerk Origins**
   - Add your Vercel domain to Clerk allowed origins

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── account/           # Account management page
│   ├── sign-in/           # Authentication pages
│   ├── sign-up/
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard home
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Dashboard.tsx     # Main dashboard
│   ├── LeadCard.tsx      # Individual lead card
│   ├── ClaimModal.tsx    # Lead claim modal
│   ├── PreviewDrawer.tsx # Lead preview
│   ├── AccountPage.tsx   # Account management
│   └── Navigation.tsx    # App navigation
├── lib/                  # Utilities and configurations
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## Database Schema

### Tables

- **clinics** - Clinic profiles linked to Clerk users
- **leads** - Lead information with tiers and status
- **lead_photos** - Lead photos with primary/secondary flags
- **lead_claims** - Purchase/claim records
- **lead_locks** - Race condition prevention for claiming

### Lead Tiers

- **Warm** - Basic leads with lower scores
- **Hot** - High-quality leads with good scores  
- **Platinum** - Premium leads with excellent scores

### Lead Status

- **available** - Ready to be claimed
- **being_claimed** - Currently being claimed (with lock)
- **claimed** - Successfully claimed by a clinic

## Features Overview

### Dashboard
- KPI cards showing metrics (new leads, available, average score, revenue)
- Real-time lead grid with filtering by tier
- Responsive design that works on all devices

### Lead Management
- **Lead Cards** - Beautiful cards showing lead details, photos, and actions
- **Claim Flow** - Secure claiming with pricing breakdown and confirmation
- **Preview** - Detailed lead information with photo gallery
- **Real-time Updates** - New leads appear instantly with animations

### Account Management
- Clinic profile management
- Billing preferences (placeholder)
- Notification settings (placeholder)
- API access (placeholder)

### Security
- Row Level Security (RLS) on all tables
- JWT-based authentication with Clerk
- Server-side data validation
- Secure API endpoints

## Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.ts` for theme customization
- Use CSS variables for consistent theming

### Database
- Add new fields to existing tables
- Create additional tables as needed
- Update RLS policies for new security requirements

### Features
- Add new lead tiers or statuses
- Implement additional payment methods
- Add more analytics and reporting features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the development team.
