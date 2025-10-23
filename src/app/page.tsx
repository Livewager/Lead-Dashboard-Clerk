import { redirect } from 'next/navigation'

export default async function HomePage() {
  // Redirect to demo page for local testing
  redirect('/demo')
}
