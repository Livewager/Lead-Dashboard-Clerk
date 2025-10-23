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

interface LeadCardProps {
  lead: Lead
  onClaim: () => void
  onPreview: () => void
}

export default function LeadCard({ lead, onClaim, onPreview }: LeadCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const primaryPhoto = lead.photos?.find(photo => photo.is_primary) || lead.photos?.[0]
  const isClaimed = lead.status === 'claimed'
  const isBeingClaimed = lead.status === 'being_claimed'
  const canClaim = lead.status === 'available'

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
                    !canClaim ? 'blur-sm' : ''
                  }`}
                  onError={() => setImageError(true)}
                />
                {!canClaim && (
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
            <div className="flex space-x-2">
              {lead.photos.slice(0, 3).map((photo, index) => (
                <div key={photo.id} className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-700">
                  <Image
                    src={photo.url}
                    alt={`Lead photo ${index + 1}`}
                    fill
                    className={`object-cover transition-all duration-300 ${
                      !canClaim ? 'blur-sm' : ''
                    }`}
                  />
                  {!canClaim && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {lead.photos.length > 3 && (
                <div className="w-12 h-12 rounded-md bg-gray-700 flex items-center justify-center">
                  <span className="text-xs text-gray-400">+{lead.photos.length - 3}</span>
                </div>
              )}
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
              <span className="text-yellow-400">{formatScore(lead.score)}</span>
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
              <span className={`${isClaimed ? 'text-gray-200' : 'text-gray-400'}`}>
                {isClaimed ? (lead.name || 'John Doe') : maskName(lead.name)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Mail className="h-3 w-3 text-gray-400" />
              <span className={`${isClaimed ? 'text-gray-200' : 'text-gray-400'}`}>
                {isClaimed ? (lead.email || 'john@example.com') : maskEmail(lead.email)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Phone className="h-3 w-3 text-gray-400" />
              <span className={`${isClaimed ? 'text-gray-200' : 'text-gray-400'}`}>
                {isClaimed ? (lead.phone || '(555) 123-4567') : maskPhone(lead.phone)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-lg font-bold text-white">
              {formatCurrency(lead.price_cents)}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(lead.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          
          {canClaim && (
            <Button
              size="sm"
              onClick={onClaim}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Claim Lead
            </Button>
          )}
          
          {isBeingClaimed && (
            <Button
              size="sm"
              disabled
              className="flex-1 bg-orange-600"
            >
              <Clock className="h-4 w-4 mr-1 animate-spin" />
              Claiming...
            </Button>
          )}
          
          {isClaimed && (
            <Button
              size="sm"
              disabled
              className="flex-1 bg-gray-600"
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
