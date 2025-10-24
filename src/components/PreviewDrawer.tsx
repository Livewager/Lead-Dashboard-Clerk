'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Star, 
  Calendar,
  User,
  Mail,
  Phone,
  Sparkles,
  X
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
  const isClaimedByMe = isClaimed
  
  const primaryPhoto = lead.photos?.find(photo => photo.is_primary) || lead.photos?.[0]
  const allPhotos = lead.photos || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-transparent border-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="relative bg-gradient-to-br from-gray-900/98 via-gray-900/95 to-gray-800/98 backdrop-blur-2xl rounded-2xl border-2 border-cyan-500/30 shadow-2xl overflow-hidden"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700/80 border border-white/20 flex items-center justify-center transition-all hover:scale-110"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>

          {/* Header */}
          <div className="relative px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge className={`${getTierColor(lead.tier)} text-lg px-5 py-2`}>
                  {lead.tier === 'platinum' && <Sparkles className="h-5 w-5 mr-2" />}
                  {getTierDisplayName(lead.tier)}
                </Badge>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {formatCurrency(lead.price_cents)}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: Photo */}
              <div className="lg:col-span-2 space-y-4">
                {/* Main Photo */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-800/50 border border-white/10 shadow-2xl">
                  {primaryPhoto && !imageError ? (
                    <>
                      <Image
                        src={primaryPhoto.url}
                        alt="Lead photo"
                        fill
                        className={`object-cover ${isClaimedByMe ? '' : 'blur-sm'}`}
                        onError={() => setImageError(true)}
                      />
                      {!isClaimedByMe && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-2 border-cyan-400/50">
                              <Sparkles className="h-10 w-10 text-cyan-400" />
                            </div>
                            <p className="text-white font-semibold text-lg">Claim to view</p>
                            <p className="text-gray-300 text-sm mt-1">Full resolution photo</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-20 w-20 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Additional Photos */}
                {allPhotos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {allPhotos.slice(1, 5).map((photo, index) => (
                      <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800/50 border border-white/10">
                        <Image
                          src={photo.url}
                          alt={`Photo ${index + 2}`}
                          fill
                          className={`object-cover ${isClaimedByMe ? '' : 'blur-sm'}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-3 space-y-6">
                {/* Location & Score */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-5">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                        <p className="text-xl font-bold text-white">{lead.city || 'Unknown'}</p>
                        <p className="text-sm text-gray-400">{lead.region}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-5">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Quality Score</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold text-yellow-400">{formatScore(lead.score)}</p>
                          <span className="text-gray-500 text-lg">/100</span>
                          <QualityScoreInfo score={lead.score} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {lead.summary && (
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      <h3 className="text-lg font-bold text-white">Summary</h3>
                    </div>
                    <p className="text-gray-200 text-base leading-relaxed">
                      {lead.summary}
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-white/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-cyan-400" />
                      <h3 className="text-lg font-bold text-white">Contact Information</h3>
                    </div>
                    {!isClaimedByMe && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs px-3 py-1">
                        Claim to reveal
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Full Name</p>
                        <p className={`text-lg font-semibold ${isClaimedByMe ? 'text-white' : 'text-gray-500'}`}>
                          {isClaimedByMe ? (lead.name || 'Amanda Lee') : maskName(lead.name)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email Address</p>
                        <p className={`text-lg font-semibold ${isClaimedByMe ? 'text-white' : 'text-gray-500'}`}>
                          {isClaimedByMe ? (lead.email || 'amanda.lee@email.com') : maskEmail(lead.email)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Phone Number</p>
                        <p className={`text-lg font-semibold ${isClaimedByMe ? 'text-white' : 'text-gray-500'}`}>
                          {isClaimedByMe ? (lead.phone || '(778) 555-0234') : maskPhone(lead.phone)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Created {new Date(lead.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                    isClaimedByMe 
                      ? 'bg-cyan-500/20 border border-cyan-500/40' 
                      : canClaim
                        ? 'bg-blue-500/20 border border-blue-500/40'
                        : 'bg-gray-500/20 border border-gray-500/40'
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      isClaimedByMe 
                        ? 'bg-cyan-400 animate-pulse' 
                        : canClaim
                          ? 'bg-blue-400'
                          : 'bg-gray-400'
                    }`} />
                    <span className={`font-semibold text-sm ${
                      isClaimedByMe 
                        ? 'text-cyan-400' 
                        : canClaim
                          ? 'text-blue-400'
                          : 'text-gray-400'
                    }`}>
                      {isClaimedByMe ? 'Owned by You' : canClaim ? 'Available' : 'Claimed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
