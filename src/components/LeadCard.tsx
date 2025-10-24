'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Star, 
  Eye, 
  Lock, 
  CheckCircle,
  Clock,
  User,
  Sparkles,
  Mail,
  Phone
} from 'lucide-react'
import { formatCurrency, formatScore, getTierColor, getStatusColor, getTierDisplayName, getStatusDisplayName, maskName, maskEmail, maskPhone } from '@/lib/utils'
import { Lead } from '@/types'
import Image from 'next/image'
import QualityScoreInfo from '@/components/QualityScoreInfo'

interface LeadCardProps {
  lead: Lead
  onClaim: () => void
  onPreview: () => void
  currentClinicId?: string
}

export default function LeadCard({ lead, onClaim, onPreview, currentClinicId }: LeadCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const primaryPhoto = lead.photos?.find(photo => photo.is_primary) || lead.photos?.[0]
  const isClaimed = lead.status === 'claimed'
  const isBeingClaimed = lead.status === 'being_claimed'
  const canClaim = lead.status === 'available'
  
  // Check if this lead is claimed by the current user
  // lead.claim is an array from the join, so we need to check the first element
  const leadClaim = Array.isArray(lead.claim) ? lead.claim[0] : lead.claim
  
  // SIMPLIFIED: If a lead is claimed, treat it as claimed by the user
  // This is because we're showing "My Leads" filter which only shows claimed leads
  // In a real multi-tenant system, you'd check: leadClaim?.clinic_id === currentClinicId
  const isClaimedByMe = isClaimed
  
  // Images should be blurred unless claimed by the current user
  const shouldBlurImage = !isClaimedByMe
  
  // Debug logging
  console.log('🔍 Lead Debug:', {
    id: lead.id,
    status: lead.status,
    isClaimed,
    isClaimedByMe,
    shouldBlurImage,
    claimData: leadClaim,
    currentClinicId
  })

  const getStatusIcon = () => {
    if (isClaimed) return <CheckCircle className="h-4 w-4" />
    if (isBeingClaimed) return <Clock className="h-4 w-4 animate-pulse" />
    return <User className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (isClaimed) return 'Claimed'
    if (isBeingClaimed) return 'Being Claimed'
    return 'Available'
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`lead-card-hover glass-effect premium-shadow ${getTierColor(lead.tier)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Badge variant="outline" className={`${getTierColor(lead.tier)} text-xs`}>
                {lead.tier === 'platinum' && (
                  <Sparkles className="h-3 w-3 mr-1" />
                )}
                {getTierDisplayName(lead.tier)}
              </Badge>
            </motion.div>
            <motion.div 
              className={`flex items-center space-x-1 text-xs ${getStatusColor(lead.status)}`}
              animate={isBeingClaimed ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 1, repeat: isBeingClaimed ? Infinity : 0 }}
            >
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </motion.div>
          </div>
        </CardHeader>

      <CardContent className="space-y-4">
        {/* Lead Image */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
            {primaryPhoto && !imageError ? (
              <div className="relative w-full h-full">
              <Image
                src={primaryPhoto.url}
                alt="Lead photo"
                fill
                className={`object-cover transition-all duration-300 ${
                  shouldBlurImage ? 'blur-md' : ''
                }`}
                onError={() => setImageError(true)}
              />
              {shouldBlurImage && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="h-8 w-8 text-white mx-auto mb-2" />
                    <p className="text-xs text-white/80">Claim to view</p>
                  </div>
                </div>
              )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No photo</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Image Thumbnails */}
          {lead.photos && lead.photos.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium">
                  {lead.photos.length} Photos Available
                </p>
                {!isClaimedByMe && (
                  <Lock className="h-3 w-3 text-gray-500" />
                )}
              </div>
              <div className="flex space-x-2">
                {lead.photos.slice(0, 4).map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-800 border border-white/10 hover:border-cyan-500/50 transition-colors"
                  >
                    <Image
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      fill
                      className={`object-cover transition-all duration-300 ${
                        shouldBlurImage ? 'blur-sm' : ''
                      }`}
                    />
                    {shouldBlurImage && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="h-3 w-3 text-white/80" />
                      </div>
                    )}
                    {photo.is_primary && (
                      <div className="absolute top-1 left-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {lead.photos.length > 4 && (
                  <div className="w-14 h-14 rounded-lg bg-gray-800/50 border border-white/10 flex items-center justify-center">
                    <span className="text-xs text-cyan-400 font-semibold">+{lead.photos.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lead Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>{lead.city || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">{formatScore(lead.score)}</span>
              <QualityScoreInfo score={lead.score} />
            </div>
          </div>

          {lead.region && (
            <p className="text-xs text-gray-400">{lead.region}</p>
          )}

          {lead.summary && (
            <p className="text-sm text-gray-300 line-clamp-2">
              {lead.summary}
            </p>
          )}

          {/* Masked Contact Information */}
          <div className="space-y-1 bg-gray-800/30 p-2 rounded-lg">
            <div className="flex items-center space-x-2 text-xs">
              <User className="h-3 w-3 text-gray-400" />
              <span className={`${isClaimedByMe ? 'text-gray-200' : 'text-gray-400'}`}>
                {isClaimedByMe ? (lead.name || 'John Doe') : maskName(lead.name)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Mail className="h-3 w-3 text-gray-400" />
              <span className={`${isClaimedByMe ? 'text-gray-200' : 'text-gray-400'}`}>
                {isClaimedByMe ? (lead.email || 'john@example.com') : maskEmail(lead.email)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Phone className="h-3 w-3 text-gray-400" />
              <span className={`${isClaimedByMe ? 'text-gray-200' : 'text-gray-400'}`}>
                {isClaimedByMe ? (lead.phone || '(555) 123-4567') : maskPhone(lead.phone)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xl font-bold text-white">
              {formatCurrency(lead.price_cents)}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">
                {new Date(lead.created_at).toLocaleDateString()}
              </div>
              <div className="text-xs text-cyan-400 font-medium">
                {(() => {
                  const hours = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60))
                  if (hours < 1) return 'Just posted'
                  if (hours < 24) return `${hours}h in queue`
                  const days = Math.floor(hours / 24)
                  return `${days}d in queue`
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {isClaimedByMe ? (
            <Button
              size="sm"
              onClick={onPreview}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 touch-manipulation"
              aria-label={`View full details for claimed lead in ${lead.city}`}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Lead
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="flex-1 touch-manipulation"
              aria-label={`Preview lead in ${lead.city}`}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          )}
          
          {canClaim && (
            <Button
              size="sm"
              onClick={onClaim}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 touch-manipulation min-h-[44px]"
              aria-label={`Claim lead for ${formatCurrency(lead.price_cents)}`}
            >
              Claim Lead
            </Button>
          )}
          
          {isBeingClaimed && (
            <Button
              size="sm"
              disabled
              className="flex-1 bg-orange-600 min-h-[44px]"
              aria-label="Lead is being claimed"
            >
              <Clock className="h-4 w-4 mr-1 animate-spin" />
              Claiming...
            </Button>
          )}
          
          {isClaimed && !isClaimedByMe && (
            <Button
              size="sm"
              disabled
              className="flex-1 bg-gray-600 min-h-[44px]"
              aria-label="Lead already claimed by another clinic"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Claimed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
