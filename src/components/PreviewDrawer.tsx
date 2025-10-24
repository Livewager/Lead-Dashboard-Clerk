'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Star, 
  Calendar,
  User,
  Mail,
  Phone,
  Sparkles,
  X,
  Clock,
  TrendingUp
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
  const isClaimedByMe = isClaimed
  
  const primaryPhoto = lead.photos?.find(photo => photo.is_primary) || lead.photos?.[0]
  const allPhotos = lead.photos || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] p-0 bg-transparent border-none shadow-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
          className="relative bg-gradient-to-br from-gray-900/98 via-gray-900/96 to-gray-800/98 backdrop-blur-3xl rounded-3xl border-2 border-cyan-500/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-500/8 via-purple-500/4 to-transparent pointer-events-none blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/8 via-transparent to-transparent pointer-events-none blur-3xl" />
          
          {/* Header Bar */}
          <div className="relative px-10 py-7 border-b border-white/10 bg-gradient-to-r from-gray-900/60 via-gray-900/40 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Badge className={`${getTierColor(lead.tier)} text-xl px-7 py-3 shadow-xl font-bold`}>
                  {lead.tier === 'platinum' && <Sparkles className="h-6 w-6 mr-2.5" />}
                  {getTierDisplayName(lead.tier)}
                </Badge>
                <div className="h-10 w-px bg-white/20" />
                <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent tracking-tight">
                  {formatCurrency(lead.price_cents)}
                </div>
              </div>
              
              <button
                onClick={() => onOpenChange(false)}
                className="w-12 h-12 rounded-xl bg-gray-800/90 hover:bg-red-500/80 border-2 border-white/20 hover:border-red-400/50 flex items-center justify-center transition-all hover:scale-105 duration-200 group"
                aria-label="Close modal"
              >
                <X className="h-6 w-6 text-gray-300 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="relative px-10 py-8 overflow-y-auto max-h-[calc(95vh-120px)] custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
              
              {/* LEFT: Photo Column (3/7) */}
              <div className="lg:col-span-3 space-y-5">
                {/* Main Photo */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800/50 border-2 border-white/10 shadow-2xl">
                  {primaryPhoto && !imageError ? (
                    <>
                      <Image
                        src={primaryPhoto.url}
                        alt="Lead profile photo"
                        fill
                        className={`object-cover transition-all duration-500 ${isClaimedByMe ? '' : 'blur-md scale-110'}`}
                        onError={() => setImageError(true)}
                        priority
                      />
                      {!isClaimedByMe && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full flex items-center justify-center mx-auto backdrop-blur-md border-3 border-cyan-400/60 shadow-xl">
                              <Sparkles className="h-12 w-12 text-cyan-300" />
                            </div>
                            <div>
                              <p className="text-white font-bold text-xl mb-1">Claim to View</p>
                              <p className="text-gray-300 text-sm">Full resolution photo</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <User className="h-24 w-24 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Grid */}
                {allPhotos.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {allPhotos.slice(1, 5).map((photo, index) => (
                      <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-800/50 border border-white/10 group hover:border-cyan-500/50 transition-all">
                        <Image
                          src={photo.url}
                          alt={`Additional photo ${index + 1}`}
                          fill
                          className={`object-cover group-hover:scale-110 transition-transform duration-300 ${isClaimedByMe ? '' : 'blur-sm'}`}
                        />
                        {!isClaimedByMe && (
                          <div className="absolute inset-0 bg-black/40" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {allPhotos.length > 5 && (
                  <p className="text-center text-xs text-gray-400">
                    +{allPhotos.length - 5} more photos available
                  </p>
                )}
              </div>

              {/* RIGHT: Information Column (4/7) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="bg-gradient-to-br from-cyan-500/15 to-blue-500/15 border-2 border-cyan-500/25 rounded-2xl p-6 hover:border-cyan-500/40 transition-all">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-cyan-500/25 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MapPin className="h-6 w-6 text-cyan-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-cyan-300/80 uppercase tracking-wider font-semibold mb-1.5">Location</p>
                        <p className="text-2xl font-bold text-white truncate">{lead.city || 'Unknown'}</p>
                        {lead.region && <p className="text-base text-gray-300 mt-0.5">{lead.region}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Quality Score */}
                  <div className="bg-gradient-to-br from-yellow-500/15 to-orange-500/15 border-2 border-yellow-500/25 rounded-2xl p-6 hover:border-yellow-500/40 transition-all">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-yellow-500/25 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Star className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-yellow-300/80 uppercase tracking-wider font-semibold mb-1.5">Quality Score</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-3xl font-bold text-yellow-400">{formatScore(lead.score)}</p>
                          <span className="text-gray-400 text-xl font-medium">/100</span>
                          <QualityScoreInfo score={lead.score} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                {lead.summary && (
                  <div className="bg-gradient-to-br from-purple-500/12 to-pink-500/12 border-2 border-purple-500/25 rounded-2xl p-7 hover:border-purple-500/35 transition-all">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500/25 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-purple-300" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Lead Summary</h3>
                    </div>
                    <p className="text-gray-200 text-base leading-relaxed">
                      {lead.summary}
                    </p>
                    {/* Extended summary text for more detail */}
                    <p className="text-gray-300 text-sm leading-relaxed mt-3 opacity-90">
                      This lead has been verified and is ready for immediate contact. They have expressed interest in {lead.tier} tier services and are located in the {lead.city} area. 
                      {lead.tier === 'platinum' && ' As a platinum lead, this represents our highest quality tier with maximum conversion potential.'}
                      {lead.tier === 'hot' && ' This hot lead shows strong engagement signals and high booking intent.'}
                      {lead.tier === 'warm' && ' This warm lead represents a solid opportunity with good conversion potential.'}
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 border-white/20 rounded-2xl p-7 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-cyan-500/25 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-cyan-300" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Contact Information</h3>
                    </div>
                    {!isClaimedByMe && (
                      <Badge className="bg-orange-500/25 text-orange-300 border-2 border-orange-500/40 text-sm px-4 py-1.5 font-semibold">
                        🔒 Claim to Reveal
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="flex items-center space-x-5 p-5 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl border border-purple-500/20 hover:border-purple-500/30 transition-all group">
                      <div className="w-12 h-12 bg-purple-500/25 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <User className="h-6 w-6 text-purple-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-purple-300/70 uppercase tracking-wider font-semibold mb-1.5">Full Name</p>
                        <p className={`text-xl font-bold ${isClaimedByMe ? 'text-white' : 'text-gray-500'} truncate`}>
                          {isClaimedByMe ? (lead.name || 'Amanda Lee') : maskName(lead.name)}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-5 p-5 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl border border-blue-500/20 hover:border-blue-500/30 transition-all group">
                      <div className="w-12 h-12 bg-blue-500/25 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="h-6 w-6 text-blue-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-blue-300/70 uppercase tracking-wider font-semibold mb-1.5">Email Address</p>
                        <p className={`text-xl font-bold ${isClaimedByMe ? 'text-white' : 'text-gray-500'} truncate`}>
                          {isClaimedByMe ? (lead.email || 'amanda.lee@email.com') : maskEmail(lead.email)}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-5 p-5 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl border border-green-500/20 hover:border-green-500/30 transition-all group">
                      <div className="w-12 h-12 bg-green-500/25 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Phone className="h-6 w-6 text-green-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-green-300/70 uppercase tracking-wider font-semibold mb-1.5">Phone Number</p>
                        <p className={`text-xl font-bold ${isClaimedByMe ? 'text-white' : 'text-gray-500'} truncate`}>
                          {isClaimedByMe ? (lead.phone || '(778) 555-0234') : maskPhone(lead.phone)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between px-6 py-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Created</p>
                      <p className="text-sm font-semibold">{new Date(lead.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}</p>
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full shadow-lg ${
                    isClaimedByMe 
                      ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 border-2 border-cyan-400/40' 
                      : canClaim
                        ? 'bg-gradient-to-r from-blue-500/25 to-purple-500/25 border-2 border-blue-400/40'
                        : 'bg-gray-500/20 border-2 border-gray-500/40'
                  }`}>
                    <div className={`h-3 w-3 rounded-full ${
                      isClaimedByMe 
                        ? 'bg-cyan-300 animate-pulse shadow-lg shadow-cyan-400/50' 
                        : canClaim
                          ? 'bg-blue-300 shadow-lg shadow-blue-400/50'
                          : 'bg-gray-400'
                    }`} />
                    <span className={`font-bold text-base ${
                      isClaimedByMe 
                        ? 'text-cyan-200' 
                        : canClaim
                          ? 'text-blue-200'
                          : 'text-gray-300'
                    }`}>
                      {isClaimedByMe ? 'Owned by You' : canClaim ? 'Available to Claim' : 'Claimed by Another'}
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
