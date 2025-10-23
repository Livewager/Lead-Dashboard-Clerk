'use client'

import { useState, useEffect } from 'react'
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
  Eye,
  Sparkles
} from 'lucide-react'
import { formatCurrency, formatScore, getTierDisplayName } from '@/lib/utils'
import { Lead, DashboardStats } from '@/types'
import DemoLeadCard from '@/components/DemoLeadCard'
import DemoClaimModal from '@/components/DemoClaimModal'
import DemoPreviewDrawer from '@/components/DemoPreviewDrawer'

export default function DemoDashboard() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'warm' | 'hot' | 'platinum'>('all')

  // Demo stats data
  const stats: DashboardStats = {
    newLeads24h: 12,
    availableNow: 8,
    averageScore: 82.5,
    totalRevenue: 25000
  }

  // Demo leads data
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
    },
    {
      id: '4',
      tier: 'warm',
      status: 'available',
      price_cents: 1800,
      score: 68.3,
      city: 'Richmond',
      region: 'Steveston',
      summary: 'First-time client interested in basic facial services',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      photos: [{
        id: '4',
        lead_id: '4',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        is_primary: true
      }]
    },
    {
      id: '5',
      tier: 'hot',
      status: 'available',
      price_cents: 3200,
      score: 82.1,
      city: 'North Vancouver',
      region: 'Lonsdale',
      summary: 'Regular client seeking advanced treatment options',
      created_at: new Date(Date.now() - 14400000).toISOString(),
      photos: [{
        id: '5',
        lead_id: '5',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        is_primary: true
      }]
    },
    {
      id: '6',
      tier: 'platinum',
      status: 'available',
      price_cents: 8500,
      score: 92.4,
      city: 'Vancouver',
      region: 'Kitsilano',
      summary: 'High-end client interested in luxury spa treatments',
      created_at: new Date(Date.now() - 18000000).toISOString(),
      photos: [{
        id: '6',
        lead_id: '6',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        is_primary: true
      }]
    }
  ]

  const filteredLeads = filter === 'all' ? demoLeads : demoLeads.filter(lead => lead.tier === filter)

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
    toast.success('Lead claimed successfully! (Demo mode)')
  }

  // Simulate new lead notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const tiers = ['warm', 'hot', 'platinum'] as const
        const cities = ['Vancouver', 'Burnaby', 'Richmond', 'Surrey']
        const randomTier = tiers[Math.floor(Math.random() * tiers.length)]
        const randomCity = cities[Math.floor(Math.random() * cities.length)]
        
        toast.success(
          `New ${getTierDisplayName(randomTier).toLowerCase()} lead available!`,
          {
            description: `${randomCity} • ${formatCurrency(Math.floor(Math.random() * 5000) + 2000)}`,
            action: {
              label: 'View',
              onClick: () => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }
          }
        )
      }
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome to Clinic Concierge! 🎉
              </h1>
              <p className="text-gray-400 mt-1">
                Demo Mode - Premium lead management dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-effect premium-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  New Leads (24h)
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.newLeads24h}
                </div>
                <p className="text-xs text-green-400">
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-effect premium-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Available Now
                </CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.availableNow}
                </div>
                <p className="text-xs text-blue-400">
                  Ready to claim
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-effect premium-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Avg Lead Score
                </CardTitle>
                <Star className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatScore(stats.averageScore)}
                </div>
                <p className="text-xs text-yellow-400">
                  Quality indicator
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-effect premium-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <p className="text-xs text-green-400">
                  This month
                </p>
              </CardContent>
            </Card>
          </motion.div>
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
            {filteredLeads.map((lead, index) => (
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
                <DemoLeadCard
                  lead={lead}
                  onClaim={() => handleClaimLead(lead)}
                  onPreview={() => handlePreviewLead(lead)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              No leads available for this filter
            </div>
            <p className="text-gray-500 mt-2">
              Try selecting a different tier or check back later
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedLead && (
        <>
          <DemoClaimModal
            lead={selectedLead}
            open={claimModalOpen}
            onOpenChange={setClaimModalOpen}
            onSuccess={handleClaimSuccess}
          />
          <DemoPreviewDrawer
            lead={selectedLead}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
          />
        </>
      )}
    </div>
  )
}
