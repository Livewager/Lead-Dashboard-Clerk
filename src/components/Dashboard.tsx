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
import PreviewDrawer from '@/components/PreviewDrawer'

export default function Dashboard() {
  const { user } = useUser()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'warm' | 'hot' | 'platinum'>('all')

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
        
        if (error) throw error

        const now = new Date()
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        
        const newLeads24h = data.filter(lead => 
          new Date(lead.created_at) > yesterday
        ).length

        const availableNow = data.filter(lead => 
          lead.status === 'available'
        ).length

        const averageScore = data.length > 0 
          ? data.reduce((sum, lead) => sum + lead.score, 0) / data.length 
          : 0

        const totalRevenue = data
          .filter(lead => lead.status === 'claimed')
          .reduce((sum, lead) => sum + lead.price_cents, 0)

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

        if (filter !== 'all') {
          query = query.eq('tier', filter)
        }

        const { data, error } = await query

        if (error) throw error
        return data || []
      } catch (error) {
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

        return filter === 'all' ? demoLeads : demoLeads.filter(lead => lead.tier === filter)
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
            const newLead = payload.new as Lead
            
            // Show toast notification
            toast.success(
              `New ${getTierDisplayName(newLead.tier).toLowerCase()} lead available!`,
              {
                description: `${newLead.city || 'Unknown'} • ${formatCurrency(newLead.price_cents)}`,
                action: {
                  label: 'View',
                  onClick: () => {
                    // Scroll to top to show new lead
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }
              }
            )
            
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
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect premium-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                New Leads (24h)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.newLeads24h || 0}
              </div>
              <p className="text-xs text-green-400">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect premium-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Available Now
              </CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.availableNow || 0}
              </div>
              <p className="text-xs text-blue-400">
                Ready to claim
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect premium-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Avg Lead Score
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatScore(stats?.averageScore || 0)}
              </div>
              <p className="text-xs text-yellow-400">
                Quality indicator
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect premium-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(stats?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-green-400">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Leads' },
              { key: 'warm', label: 'Warm' },
              { key: 'hot', label: 'Hot' },
              { key: 'platinum', label: 'Platinum' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key as any)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Leads Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
          <PreviewDrawer
            lead={selectedLead}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
          />
        </>
      )}
    </div>
  )
}
