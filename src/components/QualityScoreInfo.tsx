'use client'

import { useState } from 'react'
import { Info, Star, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface QualityScoreInfoProps {
  score: number
  className?: string
}

export default function QualityScoreInfo({ score, className = '' }: QualityScoreInfoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-5 w-5 p-0 hover:bg-cyan-500/20 rounded-full ${className}`}
          aria-label="Learn about quality score"
        >
          <Info className="h-3.5 w-3.5 text-cyan-400 hover:text-cyan-300 transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900/98 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="text-white">Quality Score: {score.toFixed(1)}/100</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base">
            How we calculate lead quality and conversion potential
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Score Breakdown */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Lead Completeness</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Profile details, photos, treatment preferences, and contact verification
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Engagement Signals</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Recent activity, response rate, booking intent, and consultation readiness
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Recency & Timing</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  How recently the lead was generated and optimal contact timing
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Historical Conversion</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Similar lead performance and tier-specific conversion rates
                </p>
              </div>
            </div>
          </div>

          {/* Score Range Guide */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
            <h4 className="text-white font-semibold text-sm mb-3">Score Guide</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">90-100:</span>
                <span className="text-purple-400 font-semibold">Platinum - Excellent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">75-89:</span>
                <span className="text-red-400 font-semibold">Hot - Very Good</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">60-74:</span>
                <span className="text-orange-400 font-semibold">Warm - Good</span>
              </div>
            </div>
          </div>

          {/* Learn More */}
          <div className="text-center">
            <a 
              href="#" 
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors inline-flex items-center space-x-1"
            >
              <span>Learn more about our scoring methodology</span>
              <Info className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

