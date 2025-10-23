'use client'

import { motion } from 'framer-motion'
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
  CheckCircle, 
  Copy, 
  Download,
  Calendar,
  CreditCard,
  Sparkles,
  MapPin,
  Star
} from 'lucide-react'
import { formatCurrency, getTierColor, getTierDisplayName } from '@/lib/utils'
import { Lead } from '@/types'

interface ClaimSuccessModalProps {
  lead: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionId: string
}

export default function ClaimSuccessModal({ 
  lead, 
  open, 
  onOpenChange, 
  transactionId 
}: ClaimSuccessModalProps) {
  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId)
    // You could add a toast here if needed
  }

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      transactionId,
      leadId: lead.id,
      amount: lead.price_cents,
      date: new Date().toISOString(),
      tier: lead.tier,
      location: lead.city
    }
    
    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `receipt-${transactionId}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
            <DialogTitle className="text-2xl font-bold text-white">
              Lead Successfully Claimed! 🎉
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Your lead has been secured and is now in your dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Transaction Details */}
            <Card className="glass-effect">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-cyan-400" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Transaction ID</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-400">
                      {transactionId.slice(0, 8)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyTransactionId}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-lg font-bold text-cyan-400">
                    {formatCurrency(lead.price_cents)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Date</span>
                  <span className="text-sm text-white">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Lead Summary */}
            <Card className="glass-effect">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                  Lead Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={`${getTierColor(lead.tier)} text-sm`}>
                    {lead.tier === 'platinum' && (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    {getTierDisplayName(lead.tier)}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-yellow-400">
                    <Star className="h-4 w-4" />
                    <span>{lead.score.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{lead.city || 'Unknown Location'}</span>
                  {lead.region && <span className="text-gray-400">• {lead.region}</span>}
                </div>
                
                {lead.summary && (
                  <p className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                    {lead.summary}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-400 mb-2">Next Steps</h4>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• Lead details are now available in your dashboard</li>
                <li>• Contact information will be provided within 24 hours</li>
                <li>• You can track lead progress in your account</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
            >
              Continue to Dashboard
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
