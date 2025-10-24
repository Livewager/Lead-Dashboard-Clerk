'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  MapPin, 
  Star, 
  Eye,
  X,
  Lock,
  User,
  Mail,
  Phone
} from 'lucide-react'
import { formatCurrency, formatScore, getTierColor, getTierDisplayName, maskName, maskEmail, maskPhone } from '@/lib/utils'
import { Lead } from '@/types'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import QualityScoreInfo from '@/components/QualityScoreInfo'

interface NewLeadPopupProps {
  lead: Lead | null
  isVisible: boolean
  onClose: () => void
  onPreview: () => void
  onClaim: () => void
}

export default function NewLeadPopup({ 
  lead, 
  isVisible, 
  onClose, 
  onPreview, 
  onClaim 
}: NewLeadPopupProps) {
  const [imageError, setImageError] = useState(false)
  const [progress, setProgress] = useState(100)

  // Auto-dismiss progress bar
  useEffect(() => {
    if (isVisible) {
      setProgress(100)
      const interval = setInterval(() => {
        setProgress(prev => Math.max(0, prev - (100 / 80))) // 8 seconds
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [isVisible])

  if (!lead) return null

  const primaryPhoto = lead.photos?.find(photo => photo.is_primary) || lead.photos?.[0]

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Pop-up Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <Card className="glass-effect premium-shadow border-2 border-green-500/50 max-w-md w-full pointer-events-auto">
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Badge className="bg-cyan-600 text-white px-3 py-1">
                      <Sparkles className="h-4 w-4 mr-1" />
                      New Lead Alert!
                    </Badge>
                  </motion.div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`${getTierColor(lead.tier)}`}>
                    {lead.tier === 'platinum' && (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    {getTierDisplayName(lead.tier)}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-yellow-400">
                    <Star className="h-4 w-4" />
                    <span>{formatScore(lead.score)}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Lead Image - Blurred */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative aspect-video rounded-lg overflow-hidden bg-gray-800"
                >
                  {primaryPhoto && !imageError ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={primaryPhoto.url}
                        alt="New lead"
                        fill
                        className="object-cover blur-md"
                        onError={() => setImageError(true)}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="h-8 w-8 text-white mx-auto mb-2" />
                          <p className="text-xs text-white/80">Claim to view full image</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                </motion.div>

                {/* Lead Info - Masked */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{lead.city || 'Unknown Location'}</span>
                    {lead.region && <span className="text-gray-400">• {lead.region}</span>}
                  </div>

                  {lead.summary && (
                    <p className="text-sm text-gray-300 line-clamp-2 bg-gray-800/50 p-3 rounded-lg">
                      {lead.summary}
                    </p>
                  )}

                  {/* Masked Contact Info */}
                  <div className="space-y-2 bg-gray-800/50 p-3 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <User className="h-3 w-3" />
                      <span>Name: {maskName(lead.name)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Mail className="h-3 w-3" />
                      <span>Email: {maskEmail(lead.email)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Phone className="h-3 w-3" />
                      <span>Phone: {maskPhone(lead.phone)}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-2xl font-bold text-cyan-400">
                      {formatCurrency(lead.price_cents)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Just now
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex space-x-2 pt-2"
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      onPreview()
                      onClose()
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={() => {
                      onClaim()
                      onClose()
                    }}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                  >
                    Claim Lead
                  </Button>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className="text-center text-xs text-gray-400">
                    Auto-closing in {Math.ceil((progress / 100) * 8)}s • Click anywhere to dismiss
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
