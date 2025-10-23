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
    let { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (clinicError && clinicError.code !== 'PGRST116') {
      throw clinicError
    }

    if (!clinic) {
      // Create clinic record
      const { data: newClinic, error: createError } = await supabaseAdmin
        .from('clinics')
        .insert({
          clerk_user_id: userId,
          clinic_name: 'New Clinic', // This would be updated later
        })
        .select('id')
        .single()

      if (createError) throw createError
      clinic = newClinic
    }

    // Get lead details
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError) throw leadError
    if (!lead) throw new Error('Lead not found')

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
    const { error: claimError } = await supabaseAdmin
      .from('lead_claims')
      .insert({
        lead_id: leadId,
        clinic_id: clinic.id,
        amount_cents: basePrice,
        tax_cents: tax,
        fee_cents: fee,
        total_cents: total,
        status: 'succeeded'
      })

    if (claimError) throw claimError

    // Update lead status
    const { error: updateError } = await supabaseAdmin
      .from('leads')
      .update({ status: 'claimed' })
      .eq('id', leadId)

    if (updateError) throw updateError

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error claiming lead:', error)
    throw error
  }
}
