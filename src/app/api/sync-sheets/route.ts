import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1-l9EGEHTA5JacoOLSUBEjOXKL_Orwg5_gkHdau_3zao/gviz/tq?tqx=out:csv&sheet=Sheet1'

interface CallRow {
  timestamp: string
  direction: string
  toNumber: string
  fromNumber: string
  transcript: string
  summary: string
}

function parseCSV(csv: string): CallRow[] {
  const lines = csv.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  
  return lines.slice(1).map(line => {
    // Handle CSV with quoted fields
    const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || []
    
    return {
      timestamp: values[0] || '',
      direction: values[1] || '',
      toNumber: values[2] || '',
      fromNumber: values[3] || '',
      transcript: values[4] || '',
      summary: values[5] || ''
    }
  }).filter(row => row.timestamp) // Filter out empty rows
}

function inferLeadTier(summary: string, transcript: string): 'warm' | 'hot' | 'platinum' {
  const combined = (summary + ' ' + transcript).toLowerCase()
  
  // Platinum indicators
  if (combined.includes('premium') || combined.includes('luxury') || 
      combined.includes('comprehensive') || combined.includes('full package')) {
    return 'platinum'
  }
  
  // Hot indicators  
  if (combined.includes('urgent') || combined.includes('soon') || 
      combined.includes('interested') || combined.includes('ready')) {
    return 'hot'
  }
  
  // Default to warm
  return 'warm'
}

function calculateQualityScore(summary: string, transcript: string): number {
  let score = 60 // Base score
  
  const combined = (summary + ' ' + transcript).toLowerCase()
  
  // Add points for engagement signals
  if (combined.includes('interested')) score += 10
  if (combined.includes('ready')) score += 10
  if (combined.includes('appointment') || combined.includes('consultation')) score += 10
  if (combined.length > 100) score += 5 // Detailed inquiry
  if (combined.includes('urgent') || combined.includes('soon')) score += 5
  
  return Math.min(100, score)
}

function extractLocationFromPhone(phone: string): { city: string, region: string } {
  // Basic area code mapping (can be enhanced)
  const areaCode = phone.replace(/\D/g, '').slice(0, 3)
  
  const locationMap: Record<string, { city: string, region: string }> = {
    '604': { city: 'Vancouver', region: 'Metro Vancouver' },
    '778': { city: 'Vancouver', region: 'Metro Vancouver' },
    '236': { city: 'Vancouver', region: 'Metro Vancouver' },
    '250': { city: 'Victoria', region: 'Vancouver Island' },
  }
  
  return locationMap[areaCode] || { city: 'British Columbia', region: 'Unknown' }
}

export async function GET() {
  try {
    // Fetch CSV from Google Sheets
    const res = await fetch(SHEET_URL, { cache: 'no-store' })
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch sheet' }, { status: 500 })
    }
    
    const csv = await res.text()
    const rows = parseCSV(csv)
    
    // Process each row and create leads
    const newLeads = []
    
    for (const row of rows) {
      // Check if lead already exists (by phone number or timestamp)
      const existingLead: any = await supabaseAdmin
        .from('leads')
        .select('id')
        .eq('phone', row.fromNumber)
        .eq('created_at', new Date(row.timestamp).toISOString())
        .single()
      
      if (existingLead.data) {
        continue // Skip if already exists
      }
      
      const tier = inferLeadTier(row.summary, row.transcript)
      const score = calculateQualityScore(row.summary, row.transcript)
      const location = extractLocationFromPhone(row.fromNumber)
      
      // Determine price based on tier
      const priceMap = {
        'warm': 2500,
        'hot': 4500,
        'platinum': 7500
      }
      
      // Create lead in database
      const leadData = {
        tier,
        status: 'available' as const,
        price_cents: priceMap[tier],
        score,
        city: location.city,
        region: location.region,
        summary: row.summary || 'Call inquiry about beauty services',
        name: null, // Will be extracted from conversation if available
        email: null,
        phone: row.fromNumber,
        created_at: new Date(row.timestamp).toISOString()
      }
      
      const result: any = await supabaseAdmin
        .from('leads')
        // @ts-ignore
        .insert(leadData)
        .select('id')
        .single()
      
      if (result.data) {
        newLeads.push(result.data)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      processed: rows.length,
      newLeads: newLeads.length,
      message: `Processed ${rows.length} rows, created ${newLeads.length} new leads`
    })
  } catch (error) {
    console.error('Error syncing sheets:', error)
    return NextResponse.json({ error: 'Sync failed', details: String(error) }, { status: 500 })
  }
}

