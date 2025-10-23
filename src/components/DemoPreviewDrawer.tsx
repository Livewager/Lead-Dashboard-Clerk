'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { formatCurrency, formatScore, getTierColor, getTierDisplayName } from '@/lib/utils'
import { Lead } from '@/types'
import Image from 'next/image'

interface DemoPreviewDrawerProps {
  lead: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DemoPreviewDrawer({ lead, open, onOpenChange }: DemoPreviewDrawerProps) {
  const [imageError, setImageError] = useState(false)
  const [showFullImages, setShowFullImages] = useState(false)
  
  const isClaimed = lead.status === 'claimed'
  const isBeingClaimed = lead.status === 'being_claimed'
  const canClaim = lead.status === 'available'
  const canViewFullImages = isClaimed && lead.claim?.clinic_id

  const primaryPhoto = lead.photos?.find(photo => photo.is_primary) || lead.photos?.[0]
  const allPhotos = lead.photos || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-400" />
            <span>Lead Preview</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about this lead opportunity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge className={`${getTierColor(lead.tier)} text-sm`}>
                {getTierDisplayName(lead.tier)}
              </Badge>
              <div className="flex items-center space-x-1 text-sm text-yellow-400">
                <Star className="h-4 w-4" />
                <span>{lead.score.toFixed(1)}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(lead.price_cents)}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">{lead.city || 'Unknown Location'}</span>
            {lead.region && (
              <span className="text-gray-400">• {lead.region}</span>
            )}
          </div>

          {/* Summary */}
          {lead.summary && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Lead Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{lead.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          {allPhotos.length > 0 && (
            <Card className="glass-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Photos</CardTitle>
                  {!canViewFullImages && (
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Claim to view full resolution
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allPhotos.map((photo, index) => (
                    <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                      {canViewFullImages || showFullImages ? (
                        <Image
                          src={photo.url}
                          alt={`Lead photo ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            src={photo.url}
                            alt={`Lead photo ${index + 1}`}
                            fill
                            className="object-cover blur-sm"
                            onError={() => setImageError(true)}
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      )}
                      {photo.is_primary && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            Primary
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {!canViewFullImages && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFullImages(!showFullImages)}
                    >
                      {showFullImages ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide Full Images
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Show Full Images
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Lead Details */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-lg">Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Tier</label>
                  <p className="text-white font-medium">{getTierDisplayName(lead.tier)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Score</label>
                  <p className="text-white font-medium">{formatScore(lead.score)}/100</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Price</label>
                  <p className="text-white font-medium">{formatCurrency(lead.price_cents)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Created</label>
                  <p className="text-white font-medium">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {isClaimed && (
                  <>
                    <div className="h-3 w-3 bg-green-500 rounded-full" />
                    <span className="text-green-400 font-medium">Claimed</span>
                  </>
                )}
                {isBeingClaimed && (
                  <>
                    <div className="h-3 w-3 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-orange-400 font-medium">Being Claimed</span>
                  </>
                )}
                {canClaim && (
                  <>
                    <div className="h-3 w-3 bg-blue-500 rounded-full" />
                    <span className="text-blue-400 font-medium">Available</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
