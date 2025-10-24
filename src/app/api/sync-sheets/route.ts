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
  
  // Skip header row and parse data rows
  const dataRows = lines.slice(1).map((line, index) => {
    try {
      // Split by comma but respect quotes
      const matches = line.match(/("(?:[^"]|"")*"|[^,]*)/g) || []
      const values = matches.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"').trim())
      
      const fromNumber = values[3]?.replace(/\D/g, '') || '' // Extract digits only
      
      // Only process if we have a valid phone number
      if (!fromNumber || fromNumber.length < 10) {
        return null
      }
      
      return {
        timestamp: values[0] || '',
        direction: values[1] || 'inbound',
        toNumber: values[2] || '',
        fromNumber: fromNumber,
        transcript: values[4] || '',
        summary: values[5] || 'Phone inquiry about services'
      }
    } catch (error) {
      console.error(`Error parsing row ${index}:`, error)
      return null
    }
  }).filter((row): row is CallRow => row !== null)
  
  console.log(`Parsed ${dataRows.length} valid rows from ${lines.length - 1} total rows`)
  return dataRows
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
  const log: string[] = []
  
  try {
    log.push('Starting Google Sheets sync...')
    
    // Fetch CSV from Google Sheets
    const res = await fetch(SHEET_URL, { cache: 'no-store' })
    
    if (!res.ok) {
      log.push(`Failed to fetch sheet: ${res.status}`)
      return NextResponse.json({ error: 'Failed to fetch sheet', log }, { status: 500 })
    }
    
    const csv = await res.text()
    log.push(`Fetched CSV: ${csv.length} bytes`)
    
    const rows = parseCSV(csv)
    log.push(`Parsed ${rows.length} rows with valid phone numbers`)
    
    // Process each row and create leads
    const newLeads = []
    const skipped = []
    const errors = []
    
    for (const row of rows) {
      // Skip if no valid phone number
      if (!row.fromNumber || row.fromNumber.length < 10) {
        continue
      }
      
      // Check if lead already exists (by phone number only - since timestamp is often missing)
      const existingLead: any = await supabaseAdmin
        .from('leads')
        .select('id')
        .eq('phone', row.fromNumber)
        .limit(1)
        .maybeSingle()
      
      if (existingLead.data) {
        log.push(`Skipped ${row.fromNumber} - already exists`)
        skipped.push(row.fromNumber)
        continue
      }
      
      log.push(`Creating lead for ${row.fromNumber}...`)
      
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
        created_at: new Date().toISOString() // Always use current time for consistency
      }
      
      const result: any = await supabaseAdmin
        .from('leads')
        // @ts-ignore
        .insert(leadData)
        .select('id')
        .single()
      
      if (result.error) {
        log.push(`Error creating lead for ${row.fromNumber}: ${result.error.message}`)
        errors.push({ phone: row.fromNumber, error: result.error.message })
        continue
      }
      
      if (result.data && result.data.id) {
        log.push(`✅ Created lead ${result.data.id}`)
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
      skipped: skipped.length,
      errors: errors.length,
      message: `Processed ${rows.length} rows, created ${newLeads.length} new leads, skipped ${skipped.length}, errors ${errors.length}`,
      log,
      errorDetails: errors,
      samplePhones: rows.slice(0, 3).map(r => r.fromNumber)
    })
  } catch (error: any) {
    log.push(`Fatal error: ${error.message}`)
    return NextResponse.json({ 
      success: false,
      error: error.message || String(error),
      log,
      stack: error.stack
    }, { status: 500 })
  }
}

