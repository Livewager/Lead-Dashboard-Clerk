import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1-l9EGEHTA5JacoOLSUBEjOXKL_Orwg5_gkHdau_3zao/gviz/tq?tqx=out:csv&sheet=Sheet1'

export async function GET() {
  const debug: any = {
    step1_fetch: 'pending',
    step2_parse: 'pending',
    step3_process: 'pending',
    errors: [],
    results: []
  }

  try {
    // Step 1: Fetch CSV
    debug.step1_fetch = 'fetching...'
    const res = await fetch(SHEET_URL, { cache: 'no-store' })
    const csv = await res.text()
    debug.step1_fetch = `success - ${csv.length} bytes`
    debug.csvPreview = csv.substring(0, 500)

    // Step 2: Parse CSV
    debug.step2_parse = 'parsing...'
    const lines = csv.trim().split('\n')
    debug.totalLines = lines.length
    
    const parsedRows = lines.slice(1).map((line, idx) => {
      const regex = /("([^"]*)"|([^,]*))/g
      const values: string[] = []
      let match
      
      while ((match = regex.exec(line)) !== null) {
        values.push(match[2] !== undefined ? match[2] : match[3] || '')
      }
      
      return {
        rowNumber: idx + 2,
        timestamp: values[0],
        direction: values[1],
        toNumber: values[2],
        fromNumber: values[3],
        transcriptLength: values[4]?.length || 0,
        summaryLength: values[5]?.length || 0,
        hasValidPhone: values[3] && values[3].length >= 10
      }
    }).filter(r => r.fromNumber && r.fromNumber.length >= 10)
    
    debug.step2_parse = `success - ${parsedRows.length} valid rows`
    debug.parsedRows = parsedRows

    // Step 3: Process each row
    debug.step3_process = 'processing...'
    
    for (const row of parsedRows) {
      const result: any = { phone: row.fromNumber }
      
      try {
        // Check if exists
        const existing: any = await supabaseAdmin
          .from('leads')
          .select('id')
          .eq('phone', row.fromNumber)
          .maybeSingle()
        
        if (existing.data) {
          result.status = 'skipped - already exists'
          result.leadId = existing.data.id
        } else {
          // Try to create
          const leadData = {
            tier: 'warm',
            status: 'available',
            price_cents: 2500,
            score: 75,
            city: 'Vancouver',
            region: 'Test',
            summary: 'Test lead from Google Sheets',
            phone: row.fromNumber,
            created_at: new Date().toISOString()
          }
          
          const createResult: any = await supabaseAdmin
            .from('leads')
            // @ts-ignore
            .insert(leadData)
            .select('id')
            .single()
          
          if (createResult.error) {
            result.status = 'error'
            result.error = createResult.error
          } else {
            result.status = 'created'
            result.leadId = createResult.data.id
          }
        }
      } catch (error) {
        result.status = 'exception'
        result.error = String(error)
      }
      
      debug.results.push(result)
    }
    
    debug.step3_process = 'complete'
    
    return NextResponse.json(debug, { status: 200 })
  } catch (error) {
    debug.errors.push(String(error))
    return NextResponse.json(debug, { status: 500 })
  }
}

