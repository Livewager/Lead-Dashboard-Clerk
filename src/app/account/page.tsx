import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import AccountPage from '@/components/AccountPage'

export default async function Account() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return <AccountPage />
}
