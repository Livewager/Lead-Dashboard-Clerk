import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import LandingPage from '@/components/LandingPage'

export default async function HomePage() {
  const { userId } = await auth()
  
  // If user is signed in, redirect to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  // Otherwise show landing page
  return <LandingPage />
}
