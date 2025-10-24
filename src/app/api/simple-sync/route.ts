import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Simple test: Can we create a lead?
    const testLead: any = await supabaseAdmin
      .from('leads')
      // @ts-ignore
      .insert({
        tier: 'warm',
        status: 'available',
        price_cents: 2500,
        score: 75.5,
        city: 'Test City',
        region: 'Test Region',
        summary: 'Test lead from simple sync',
        phone: '1234567890' + Date.now(), // Unique phone
      })
      .select()
      .single()

    if (testLead.error) {
      return NextResponse.json({ 
        success: false, 
        error: testLead.error,
        message: 'Failed to create test lead'
      })
    }

    // Success - add a photo
    await supabaseAdmin
      .from('lead_photos')
      // @ts-ignore
      .insert({
        lead_id: testLead.data.id,
        url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        is_primary: true
      })

    return NextResponse.json({ 
      success: true,
      leadId: testLead.data.id,
      message: 'Test lead created successfully! Check your dashboard.'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || String(error),
      stack: error.stack
    }, { status: 500 })
  }
}

