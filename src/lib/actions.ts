'use server'

import { auth } from '@clerk/nextjs'
import { supabaseAdmin } from './supabase'
import { revalidatePath } from 'next/cache'

export async function claimLead(leadId: string) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    // Get or create clinic
    const clinicQuery: any = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (clinicQuery.error && clinicQuery.error.code !== 'PGRST116') {
      throw clinicQuery.error
    }

    let clinic = clinicQuery.data

    if (!clinic) {
      // Create clinic record
      const clinicCreate: any = await supabaseAdmin
        .from('clinics')
        // @ts-ignore - Supabase type inference issue
        .insert({
          clerk_user_id: userId,
          clinic_name: 'New Clinic', // This would be updated later
        })
        .select('id')
        .single()

      if (clinicCreate.error) throw clinicCreate.error
      clinic = clinicCreate.data
    }

    // Get lead details
    const leadQuery: any = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadQuery.error) throw leadQuery.error
    if (!leadQuery.data) throw new Error('Lead not found')
    
    const lead = leadQuery.data

    if (lead.status !== 'available') {
      throw new Error('Lead is no longer available')
    }

    // Calculate pricing
    const basePrice = lead.price_cents
    const taxRate = parseFloat(process.env.LEAD_CLAIM_TAX_RATE || '0.00')
    const flatFee = parseInt(process.env.LEAD_CLAIM_FEE_FLAT || '0')
    const tax = Math.round(basePrice * taxRate)
    const fee = flatFee
    const total = basePrice + tax + fee

    // Create claim record
    const claimCreate: any = await supabaseAdmin
      .from('lead_claims')
      // @ts-ignore - Supabase type inference issue
      .insert({
        lead_id: leadId,
        clinic_id: clinic.id,
        amount_cents: basePrice,
        tax_cents: tax,
        fee_cents: fee,
        total_cents: total,
        status: 'succeeded'
      })

    if (claimCreate.error) throw claimCreate.error

    // Update lead status
    const leadUpdate: any = await supabaseAdmin
      .from('leads')
      // @ts-ignore - Supabase type inference issue
      .update({ status: 'claimed' })
      .eq('id', leadId)

    if (leadUpdate.error) throw leadUpdate.error

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error claiming lead:', error)
    throw error
  }
}
