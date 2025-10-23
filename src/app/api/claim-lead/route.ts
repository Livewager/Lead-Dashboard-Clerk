import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { leadId } = await request.json()

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
    }

    // Get or create clinic using service role (bypasses RLS)
    const clinicQuery: any = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    let clinicId = clinicQuery.data?.id

    if (!clinicId) {
      // Create clinic record
      const clinicCreate: any = await supabaseAdmin
        .from('clinics')
        // @ts-ignore
        .insert({
          clerk_user_id: userId,
          clinic_name: 'New Clinic',
        })
        .select('id')
        .single()

      if (clinicCreate.error) {
        console.error('Error creating clinic:', clinicCreate.error)
        return NextResponse.json({ error: 'Failed to create clinic profile' }, { status: 500 })
      }
      
      clinicId = clinicCreate.data.id
    }

    // Get lead details
    const leadQuery: any = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadQuery.error || !leadQuery.data) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const lead = leadQuery.data

    if (lead.status !== 'available') {
      return NextResponse.json({ error: 'Lead is no longer available' }, { status: 400 })
    }

    // Calculate pricing
    const basePrice = lead.price_cents
    const taxRate = parseFloat(process.env.LEAD_CLAIM_TAX_RATE || '0.00')
    const flatFee = parseInt(process.env.LEAD_CLAIM_FEE_FLAT || '0')
    const tax = Math.round(basePrice * taxRate)
    const fee = flatFee
    const total = basePrice + tax + fee

    // Create claim record using service role
    const claimCreate: any = await supabaseAdmin
      .from('lead_claims')
      // @ts-ignore
      .insert({
        lead_id: leadId,
        clinic_id: clinicId,
        amount_cents: basePrice,
        tax_cents: tax,
        fee_cents: fee,
        total_cents: total,
        status: 'succeeded'
      })

    if (claimCreate.error) {
      console.error('Error creating claim:', claimCreate.error)
      return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 })
    }

    // Update lead status using service role
    const leadUpdate: any = await supabaseAdmin
      .from('leads')
      // @ts-ignore
      .update({ status: 'claimed' })
      .eq('id', leadId)

    if (leadUpdate.error) {
      console.error('Error updating lead:', leadUpdate.error)
      return NextResponse.json({ error: 'Failed to update lead status' }, { status: 500 })
    }

    return NextResponse.json({ success: true, clinicId })
  } catch (error) {
    console.error('Error in claim-lead API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

