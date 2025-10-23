import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch clinic profile
export async function GET() {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get clinic using service role
    const clinicQuery: any = await supabaseAdmin
      .from('clinics')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    // If clinic doesn't exist, create it
    if (clinicQuery.error && clinicQuery.error.code === 'PGRST116') {
      const clinicCreate: any = await supabaseAdmin
        .from('clinics')
        .insert({
          clerk_user_id: userId,
          clinic_name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'My Clinic',
          email: user?.emailAddresses[0]?.emailAddress || '',
        })
        .select('*')
        .single()

      if (clinicCreate.error) {
        console.error('Error creating clinic:', clinicCreate.error)
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
      }

      return NextResponse.json({ clinic: clinicCreate.data })
    }

    if (clinicQuery.error) {
      console.error('Error fetching clinic:', clinicQuery.error)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    return NextResponse.json({ clinic: clinicQuery.data })
  } catch (error) {
    console.error('Error in profile GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update clinic profile
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    // Get clinic ID
    const clinicQuery: any = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (clinicQuery.error || !clinicQuery.data) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    // Update clinic using service role
    const updateResult: any = await supabaseAdmin
      .from('clinics')
      .update(updates)
      .eq('id', clinicQuery.data.id)
      .select('*')
      .single()

    if (updateResult.error) {
      console.error('Error updating clinic:', updateResult.error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ clinic: updateResult.data })
  } catch (error) {
    console.error('Error in profile PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

