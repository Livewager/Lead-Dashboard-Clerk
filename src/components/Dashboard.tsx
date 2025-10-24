'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Users, 
  Star, 
  DollarSign,
  Filter,
  RefreshCw,
  Bell,
  Eye
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatScore, getTierDisplayName } from '@/lib/utils'
import { Lead, DashboardStats } from '@/types'
import LeadCard from '@/components/LeadCard'
import ClaimModal from '@/components/ClaimModal'
import ClaimSuccessModal from '@/components/ClaimSuccessModal'
import PreviewDrawer from '@/components/PreviewDrawer'
import NewLeadPopup from '@/components/NewLeadPopup'
import NewLeadsChart from '@/components/charts/NewLeadsChart'
import AvailableNowChart from '@/components/charts/AvailableNowChart'
import QualityScoreChart from '@/components/charts/QualityScoreChart'
import RevenueChart from '@/components/charts/RevenueChart'
import { useSheetSync } from '@/hooks/useSheetSync'

export default function Dashboard() {
  const { user } = useUser()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [claimSuccessOpen, setClaimSuccessOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [newLeadPopupOpen, setNewLeadPopupOpen] = useState(false)
  const [newLead, setNewLead] = useState<Lead | null>(null)
  const [filter, setFilter] = useState<'all' | 'warm' | 'hot' | 'platinum' | 'my-leads'>('all')
  const [transactionId, setTransactionId] = useState('')
  const [currentClinicId, setCurrentClinicId] = useState<string | undefined>(undefined)

  // Auto-sync with Google Sheets (11 Labs calls)
  const { syncSheets, isSyncing, lastSync } = useSheetSync()

  // Fetch current clinic ID
  useEffect(() => {
    const fetchClinicId = async () => {
      try {
        const response = await fetch('/api/profile')
        const result = await response.json()
        if (result.clinic) {
          setCurrentClinicId(result.clinic.id)
        }
      } catch (error) {
        console.log('Could not fetch clinic ID')
      }
    }
    if (user) {
      fetchClinicId()
    }
  }, [user])

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      try {
        const result: any = await supabase
          .from('leads')
          .select('*')
        
        if (result.error) throw result.error
        const data = result.data || []

        const now = new Date()
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        
        const newLeads24h = data.filter((lead: any) => 
          new Date(lead.created_at) > yesterday
        ).length

        const availableNow = data.filter((lead: any) => 
          lead.status === 'available'
        ).length

        const averageScore = data.length > 0 
          ? data.reduce((sum: number, lead: any) => sum + lead.score, 0) / data.length 
          : 0

        const totalRevenue = data
          .filter((lead: any) => lead.status === 'claimed')
          .reduce((sum: number, lead: any) => sum + lead.price_cents, 0)

        return {
          newLeads24h,
          availableNow,
          averageScore,
          totalRevenue
        }
      } catch (error) {
        // Return demo data if Supabase is not configured
        return {
          newLeads24h: 12,
          availableNow: 8,
          averageScore: 82.5,
          totalRevenue: 25000
        }
      }
    }
  })

  // Fetch leads
  const { data: leads, isLoading: leadsLoading, refetch } = useQuery({
    queryKey: ['leads', filter],
    queryFn: async (): Promise<Lead[]> => {
      try {
        let query = supabase
          .from('leads')
          .select(`
            *,
            photos:lead_photos(*),
            claim:lead_claims(*)
          `)
          .order('created_at', { ascending: false })

        if (filter === 'my-leads') {
          // Filter to show only claimed leads
          query = query.eq('status', 'claimed')
        } else if (filter !== 'all') {
          // Filter by tier
          query = query.eq('tier', filter)
        }

        const result: any = await query

        if (result.error) throw result.error
        const data = result.data || []
        
        // If "My Leads" filter, further filter by current user's claims
        if (filter === 'my-leads' && data && user) {
          // In a real implementation, we would filter by clinic_id matching the user
          // For now, we'll return all claimed leads
          return data.filter((lead: any) => lead.status === 'claimed')
        }
        
        return data
      } catch (error) {
        console.error('Error loading leads:', error)
        // Return demo data if Supabase is not configured
        const demoLeads: Lead[] = [
          {
            id: '1',
            tier: 'warm',
            status: 'available',
            price_cents: 2500,
            score: 75.5,
            city: 'Vancouver',
            region: 'Downtown',
            summary: 'Seeking comprehensive beauty consultation for special event',
            created_at: new Date().toISOString(),
            photos: [{
              id: '1',
              lead_id: '1',
              url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
              is_primary: true
            }]
          },
          {
            id: '2',
            tier: 'hot',
            status: 'available',
            price_cents: 4500,
            score: 88.2,
            city: 'Burnaby',
            region: 'Metrotown',
            summary: 'Interested in full facial treatment and skincare routine',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            photos: [{
              id: '2',
              lead_id: '2',
              url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
              is_primary: true
            }]
          },
          {
            id: '3',
            tier: 'platinum',
            status: 'available',
            price_cents: 7500,
            score: 95.0,
            city: 'West Vancouver',
            region: 'Ambleside',
            summary: 'Looking for premium anti-aging treatments and consultation',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            photos: [{
              id: '3',
              lead_id: '3',
              url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
              is_primary: true
            }]
          }
        ]

        if (filter === 'all') return demoLeads
        if (filter === 'my-leads') return demoLeads.filter(lead => lead.status === 'claimed')
        return demoLeads.filter(lead => lead.tier === filter)
      }
    }
  })

  // Set up realtime subscription
  useEffect(() => {
    try {
      const channel = supabase
        .channel('leads')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'leads' },
          (payload) => {
            console.log('New lead received:', payload.new)
            const incomingLead = payload.new as Lead
            
            // Show large centered popup instead of toast
            setNewLead(incomingLead)
            setNewLeadPopupOpen(true)
            
            // Auto-close popup after 15 seconds
            setTimeout(() => {
              setNewLeadPopupOpen(false)
            }, 15000)
            
            refetch()
          }
        )
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'leads' },
          (payload) => {
            console.log('Lead updated:', payload.new)
            refetch()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (error) {
      console.log('Realtime subscription not available in demo mode')
    }
  }, [refetch])

  const handleClaimLead = (lead: Lead) => {
    setSelectedLead(lead)
    setClaimModalOpen(true)
  }

  const handlePreviewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setPreviewOpen(true)
  }

  const handleClaimSuccess = () => {
    setClaimModalOpen(false)
    // Generate a transaction ID
    const txId = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setTransactionId(txId)
    setClaimSuccessOpen(true)
    refetch()
  }

  if (statsLoading || leadsLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your leads and grow your business
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {lastSync && (
                <div className="text-xs text-gray-400">
                  Last sync: {lastSync.toLocaleTimeString()}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  syncSheets()
                  refetch()
                }}
                disabled={isSyncing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Calls'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="glass-effect premium-shadow-lg border-l-4 border-l-cyan-500/50 hover:border-l-cyan-400 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-200 uppercase tracking-wide">
                New Leads (24h)
              </CardTitle>
              <div className="p-1.5 sm:p-2.5 bg-cyan-500/20 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stats?.newLeads24h || 0}
              </div>
              <div className="h-12 sm:h-16">
                <NewLeadsChart />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-cyan-400" />
                <p className="text-xs sm:text-sm text-cyan-400 font-medium">
                  +12%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect premium-shadow-lg border-l-4 border-l-blue-500/50 hover:border-l-blue-400 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-200 uppercase tracking-wide">
                Available Now
              </CardTitle>
              <div className="p-1.5 sm:p-2.5 bg-blue-500/20 rounded-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stats?.availableNow || 0}
              </div>
              <div className="h-12 sm:h-16">
                <AvailableNowChart />
              </div>
              <p className="text-xs sm:text-sm text-blue-400 font-medium">
                Ready
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect premium-shadow-lg border-l-4 border-l-yellow-500/50 hover:border-l-yellow-400 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-200 uppercase tracking-wide">
                Avg Score
              </CardTitle>
              <div className="p-1.5 sm:p-2.5 bg-yellow-500/20 rounded-lg">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {formatScore(stats?.averageScore || 0)}
              </div>
              <div className="h-12 sm:h-16">
                <QualityScoreChart score={stats?.averageScore || 0} />
              </div>
              <p className="text-xs sm:text-sm text-yellow-400 font-medium">
                Quality
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect premium-shadow-lg border-l-4 border-l-green-500/50 hover:border-l-green-400 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-200 uppercase tracking-wide">
                Revenue
              </CardTitle>
              <div className="p-1.5 sm:p-2.5 bg-green-500/20 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {formatCurrency(stats?.totalRevenue || 0)}
              </div>
              <div className="h-12 sm:h-16">
                <RevenueChart />
              </div>
              <p className="text-xs sm:text-sm text-green-400 font-medium">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Leads' },
              { key: 'my-leads', label: 'My Leads' },
              { key: 'warm', label: 'Warm' },
              { key: 'hot', label: 'Hot' },
              { key: 'platinum', label: 'Platinum' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key as any)}
                className={filter === key && key === 'my-leads' ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Leads Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            layout
          >
            {leads?.map((lead, index) => (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <LeadCard
                  lead={lead}
                  onClaim={() => handleClaimLead(lead)}
                  onPreview={() => handlePreviewLead(lead)}
                  currentClinicId={currentClinicId}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {leads?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              No leads available at the moment
            </div>
            <p className="text-gray-500 mt-2">
              Check back later for new opportunities
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedLead && (
        <>
          <ClaimModal
            lead={selectedLead}
            open={claimModalOpen}
            onOpenChange={setClaimModalOpen}
            onSuccess={handleClaimSuccess}
          />
          <ClaimSuccessModal
            lead={selectedLead}
            open={claimSuccessOpen}
            onOpenChange={setClaimSuccessOpen}
            transactionId={transactionId}
          />
          <PreviewDrawer
            lead={selectedLead}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
          />
        </>
      )}

      {/* New Lead Popup */}
      <NewLeadPopup
        lead={newLead}
        isVisible={newLeadPopupOpen}
        onClose={() => setNewLeadPopupOpen(false)}
        onPreview={() => {
          if (newLead) {
            setSelectedLead(newLead)
            setPreviewOpen(true)
          }
        }}
        onClaim={() => {
          if (newLead) {
            setSelectedLead(newLead)
            setClaimModalOpen(true)
          }
        }}
      />
    </div>
  )
}
