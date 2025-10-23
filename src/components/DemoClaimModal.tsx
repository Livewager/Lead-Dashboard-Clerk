'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MapPin, 
  Star, 
  DollarSign, 
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { formatCurrency, getTierColor, getTierDisplayName } from '@/lib/utils'
import { Lead } from '@/types'

interface DemoClaimModalProps {
  lead: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function DemoClaimModal({ lead, open, onOpenChange, onSuccess }: DemoClaimModalProps) {
  const [isClaiming, setIsClaiming] = useState(false)

  const taxRate = parseFloat(process.env.NEXT_PUBLIC_LEAD_CLAIM_TAX_RATE || '0.00')
  const flatFee = parseInt(process.env.NEXT_PUBLIC_LEAD_CLAIM_FEE_FLAT || '0')
  
  const basePrice = lead.price_cents
  const tax = Math.round(basePrice * taxRate)
  const fee = flatFee
  const total = basePrice + tax + fee

  const handleClaim = async () => {
    setIsClaiming(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    toast.success('Lead claimed successfully! (Demo mode)')
    onSuccess()
    setIsClaiming(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span>Confirm Lead Claim</span>
          </DialogTitle>
          <DialogDescription>
            Review the details below before claiming this lead.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lead Summary */}
          <Card className="glass-effect">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={`${getTierColor(lead.tier)} text-xs`}>
                  {getTierDisplayName(lead.tier)}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-yellow-400">
                  <Star className="h-4 w-4" />
                  <span>{lead.score.toFixed(1)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{lead.city || 'Unknown Location'}</span>
                {lead.region && <span className="text-gray-400">• {lead.region}</span>}
              </div>
              
              {lead.summary && (
                <p className="text-sm text-gray-300">{lead.summary}</p>
              )}
            </CardContent>
          </Card>

          {/* Pricing Breakdown */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Lead Price</span>
                <span className="text-white">{formatCurrency(basePrice)}</span>
              </div>
              
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Tax ({taxRate * 100}%)</span>
                  <span className="text-white">{formatCurrency(tax)}</span>
                </div>
              )}
              
              {fee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Processing Fee</span>
                  <span className="text-white">{formatCurrency(fee)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-600 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-green-400">{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium">Demo Mode:</p>
              <p>This is a demonstration. In production, this would securely claim the lead and process payment.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isClaiming}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClaim}
            disabled={isClaiming}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            {isClaiming ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Claiming...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Confirm & Claim
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
