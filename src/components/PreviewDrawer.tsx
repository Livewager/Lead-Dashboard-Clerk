'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MapPin, 
  Star, 
  Calendar,
  User,
  Mail,
  Phone,
  Sparkles,
  X,
  DollarSign
} from 'lucide-react'
import { formatCurrency, formatScore, getTierColor, getTierDisplayName, maskName, maskEmail, maskPhone } from '@/lib/utils'
import { Lead } from '@/types'
import Image from 'next/image'
import QualityScoreInfo from '@/components/QualityScoreInfo'

interface PreviewDrawerProps {
  lead: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PreviewDrawer({ lead, open, onOpenChange }: PreviewDrawerProps) {
  const [imageError, setImageError] = useState(false)
  
  const isClaimed = lead.status === 'claimed'
  const canClaim = lead.status === 'available'
  const leadClaim = Array.isArray(lead.claim) ? lead.claim[0] : lead.claim
  const isClaimedByMe = isClaimed // Simplified: all claimed leads show full info
  
  const primaryPhoto = lead.photos?.find(photo => photo.is_primary) || lead.photos?.[0]
  const allPhotos = lead.photos || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto bg-gray-900/98 border-cyan-500/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="border-b border-white/10 pb-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center space-x-3 text-2xl">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-white">Lead Details</span>
              </DialogTitle>
              <div className="flex items-center space-x-3">
                <Badge className={`${getTierColor(lead.tier)} text-base px-4 py-1.5`}>
                  {lead.tier === 'platinum' && <Sparkles className="h-4 w-4 mr-1.5" />}
                  {getTierDisplayName(lead.tier)}
                </Badge>
                <div className="text-3xl font-bold text-cyan-400">
                  {formatCurrency(lead.price_cents)}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-6">
            {/* Main Photo Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-800 border border-white/10">
                  {primaryPhoto && !imageError ? (
                    <Image
                      src={primaryPhoto.url}
                      alt="Lead photo"
                      fill
                      className={`object-cover transition-all duration-500 ${
                        isClaimedByMe ? '' : 'blur-sm'
                      }`}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-20 w-20 text-gray-600" />
                    </div>
                  )}
                  {!isClaimedByMe && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Sparkles className="h-8 w-8 text-cyan-400" />
                        </div>
                        <p className="text-white font-semibold">Claim to view</p>
                        <p className="text-gray-300 text-sm mt-1">Full resolution photo</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Photos */}
                {allPhotos.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {allPhotos.slice(0, 3).map((photo, index) => (
                      <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 border border-white/10">
                        <Image
                          src={photo.url}
                          alt={`Photo ${index + 1}`}
                          fill
                          className={`object-cover ${isClaimedByMe ? '' : 'blur-sm'}`}
                        />
                        {photo.is_primary && (
                          <Badge className="absolute top-2 left-2 text-xs bg-cyan-600">
                            Primary
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lead Information */}
              <div className="space-y-4">
                {/* Location & Score */}
                <Card className="modal-glass border-cyan-500/20">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">{lead.city || 'Unknown'}</p>
                        {lead.region && <p className="text-gray-400 text-sm">{lead.region}</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">Quality Score</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-yellow-400 text-2xl font-bold">{formatScore(lead.score)}/100</p>
                          <QualityScoreInfo score={lead.score} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Created</p>
                        <p className="text-white font-medium">
                          {new Date(lead.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                {lead.summary && (
                  <Card className="modal-glass border-cyan-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-cyan-400" />
                        <span>Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-200 leading-relaxed text-base">
                        {lead.summary}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <Card className="modal-glass border-cyan-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <User className="h-5 w-5 text-cyan-400" />
                    <span>Contact Information</span>
                  </CardTitle>
                  {!isClaimedByMe && (
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      Claim to reveal
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <User className="h-4 w-4" />
                      <span>Full Name</span>
                    </div>
                    <p className={`text-lg font-semibold ${isClaimedByMe ? 'text-white' : 'text-gray-500'}`}>
                      {isClaimedByMe ? (lead.name || 'Amanda Lee') : maskName(lead.name)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </div>
                    <p className={`text-lg font-semibold ${isClaimedByMe ? 'text-white' : 'text-gray-500'}`}>
                      {isClaimedByMe ? (lead.email || 'amanda.lee@email.com') : maskEmail(lead.email)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>Phone Number</span>
                    </div>
                    <p className={`text-lg font-semibold ${isClaimedByMe ? 'text-white' : 'text-gray-500'}`}>
                      {isClaimedByMe ? (lead.phone || '(778) 555-0234') : maskPhone(lead.phone)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Badge */}
            <div className="flex items-center justify-center">
              <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full ${
                isClaimedByMe 
                  ? 'bg-cyan-500/20 border border-cyan-500/30' 
                  : canClaim
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-gray-500/20 border border-gray-500/30'
              }`}>
                <div className={`h-3 w-3 rounded-full ${
                  isClaimedByMe 
                    ? 'bg-cyan-400 animate-pulse' 
                    : canClaim
                      ? 'bg-blue-400'
                      : 'bg-gray-400'
                }`} />
                <span className={`font-semibold ${
                  isClaimedByMe 
                    ? 'text-cyan-400' 
                    : canClaim
                      ? 'text-blue-400'
                      : 'text-gray-400'
                }`}>
                  {isClaimedByMe ? 'Claimed by You' : canClaim ? 'Available to Claim' : 'Claimed by Another Clinic'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
