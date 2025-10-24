import { NextResponse } from 'next/server'

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1-l9EGEHTA5JacoOLSUBEjOXKL_Orwg5_gkHdau_3zao/gviz/tq?tqx=out:csv&sheet=Sheet1'

export async function GET() {
  try {
    // Fetch the CSV
    const res = await fetch(SHEET_URL, { cache: 'no-store' })
    const csv = await res.text()
    
    // Parse first few lines for debugging
    const lines = csv.split('\n').slice(0, 5)
    
    // Extract phone numbers
    const regex = /("([^"]*)"|([^,]*))/g
    const rows = lines.slice(1).map(line => {
      const values: string[] = []
      let match
      while ((match = regex.exec(line)) !== null) {
        values.push(match[2] !== undefined ? match[2] : match[3] || '')
      }
      return {
        timestamp: values[0],
        direction: values[1],
        toNumber: values[2],
        fromNumber: values[3],
        transcriptPreview: values[4]?.substring(0, 100),
        summary: values[5]?.substring(0, 100)
      }
    })
    
    return NextResponse.json({ 
      success: true,
      csvLength: csv.length,
      totalLines: csv.split('\n').length,
      sampleRows: rows,
      rawCSV: csv.substring(0, 500)
    })
  } catch (error) {
    return NextResponse.json({ 
      error: String(error),
      message: 'Failed to fetch sheet'
    }, { status: 500 })
  }
}

