'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function useSheetSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const syncSheets = async () => {
    if (isSyncing) return
    
    setIsSyncing(true)
    try {
      const response = await fetch('/api/sync-sheets')
      const result = await response.json()
      
      if (result.success && result.newLeads > 0) {
        toast.success(`${result.newLeads} new lead(s) added from calls!`, {
          description: `Processed ${result.processed} call records`,
        })
        setLastSync(new Date())
      }
    } catch (error) {
      console.error('Sheet sync error:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  // Auto-sync every 30 seconds in background
  useEffect(() => {
    // Initial sync after 5 seconds
    const timeout = setTimeout(() => {
      syncSheets()
    }, 5000)
    
    // Set up interval for background polling
    const interval = setInterval(() => {
      syncSheets()
    }, 30 * 1000) // 30 seconds
    
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return { syncSheets, isSyncing, lastSync }
}

