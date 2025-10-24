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
  
  return lines.slice(1).map(line => {
    // More robust CSV parsing with proper quote handling
    const regex = /("([^"]*)"|([^,]*))/g
    const values: string[] = []
    let match
    
    while ((match = regex.exec(line)) !== null) {
      values.push(match[2] !== undefined ? match[2] : match[3] || '')
    }
    
    return {
      timestamp: values[0]?.trim() || new Date().toISOString(),
      direction: values[1]?.trim() || 'inbound',
      toNumber: values[2]?.trim() || '',
      fromNumber: values[3]?.trim() || '',
      transcript: values[4]?.trim() || '',
      summary: values[5]?.trim() || 'Phone inquiry'
    }
  }).filter(row => row.fromNumber && row.fromNumber.length > 5) // Filter out empty/invalid rows
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
      
      // Extract name from transcript if possible (simple heuristic)
      const nameMatch = row.transcript.match(/my name is (\w+)|I'm (\w+)|this is (\w+)/i)
      const extractedName = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3]) : null
      
      // Create lead in database with full data
      const leadData = {
        tier,
        status: 'available' as const,
        price_cents: priceMap[tier],
        score,
        city: location.city,
        region: location.region,
        summary: row.summary || 'Phone inquiry about beauty services',
        name: extractedName,
        email: null, // Not available from calls
        phone: row.fromNumber,
        created_at: row.timestamp && row.timestamp !== 'missing event_timestamp' 
          ? new Date(row.timestamp).toISOString() 
          : new Date().toISOString()
      }
      
      const result: any = await supabaseAdmin
        .from('leads')
        // @ts-ignore
        .insert(leadData)
        .select('id')
        .single()
      
      if (result.data && result.data.id) {
        // Add a random profile photo for the lead
        const randomPhotos = [
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        ]
        
        const randomPhoto = randomPhotos[Math.floor(Math.random() * randomPhotos.length)]
        
        // Add photo
        await supabaseAdmin
          .from('lead_photos')
          // @ts-ignore
          .insert({
            lead_id: result.data.id,
            url: randomPhoto,
            is_primary: true
          })
        
        // Store full transcript and summary in metadata table
        // Only visible to clinics that purchase the lead
        await supabaseAdmin
          .from('lead_metadata')
          // @ts-ignore
          .insert({
            lead_id: result.data.id,
            transcript: row.transcript,
            call_summary: row.summary,
            call_direction: row.direction
          })
        
        newLeads.push({ 
          ...result.data, 
          phone: row.fromNumber
        })
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

