'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings,
  Bell,
  Key,
  CreditCard,
  Save,
  Edit
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Clinic } from '@/types'

export default function AccountPage() {
  const { user } = useUser()
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    clinic_name: '',
    email: '',
    phone: '',
    location: '',
    logo_url: ''
  })

  useEffect(() => {
    if (user) {
      fetchClinicData()
    }
  }, [user])

  const fetchClinicData = async () => {
    if (!user) return

    try {
      // Check if we're in demo mode (no real Supabase connection)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl === 'https://demo.supabase.co' || supabaseUrl.includes('localhost')) {
        // Demo mode - create mock clinic data
        const mockClinic = {
          id: 'demo-clinic-1',
          clerk_user_id: user.id,
          clinic_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'My Clinic',
          email: user.emailAddresses[0]?.emailAddress || 'demo@clinic.com',
          phone: '',
          location: '',
          logo_url: '',
          created_at: new Date().toISOString()
        }
        
        setClinic(mockClinic)
        setFormData({
          clinic_name: mockClinic.clinic_name,
          email: mockClinic.email,
          phone: mockClinic.phone,
          location: mockClinic.location,
          logo_url: mockClinic.logo_url
        })
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        const clinicData = data as Clinic
        setClinic(clinicData)
        setFormData({
          clinic_name: clinicData.clinic_name || '',
          email: clinicData.email || '',
          phone: clinicData.phone || '',
          location: clinicData.location || '',
          logo_url: clinicData.logo_url || ''
        })
      } else {
        // Create new clinic record
        const insertResult: any = await supabase
          .from('clinics')
          // @ts-ignore - Supabase type inference issue
          .insert({
            clerk_user_id: user.id,
            clinic_name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0]?.emailAddress,
          })
          .select('*')
          .single()

        if (insertResult.error) throw insertResult.error
        const newClinicData = insertResult.data as Clinic
        setClinic(newClinicData)
        setFormData({
          clinic_name: newClinicData.clinic_name || '',
          email: newClinicData.email || '',
          phone: newClinicData.phone || '',
          location: newClinicData.location || '',
          logo_url: newClinicData.logo_url || ''
        })
      }
    } catch (error) {
      console.error('Error fetching clinic data:', error)
      toast.error('Failed to load clinic information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !clinic) return

    try {
      // Check if we're in demo mode
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl === 'https://demo.supabase.co' || supabaseUrl.includes('localhost')) {
        // Demo mode - just update local state
        const updatedClinic = { ...clinic, ...formData }
        setClinic(updatedClinic)
        toast.success('Profile updated successfully! (Demo mode)')
        setIsEditing(false)
        return
      }

      const updateResult: any = await supabase
        .from('clinics')
        // @ts-ignore - Supabase type inference issue
        .update(formData)
        .eq('id', clinic.id)

      if (updateResult.error) throw updateResult.error

      toast.success('Profile updated successfully!')
      setIsEditing(false)
      fetchClinicData()
    } catch (error) {
      console.error('Error updating clinic:', error)
      toast.error('Failed to update profile')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
          <p className="text-gray-400">Loading account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Account Settings</h1>
              <p className="text-gray-400 mt-1">
                Manage your clinic profile and preferences
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-effect premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Clinic Profile</span>
                </CardTitle>
                <CardDescription>
                  Update your clinic information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Clinic Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.clinic_name}
                        onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter clinic name"
                      />
                    ) : (
                      <p className="text-white">{clinic?.clinic_name || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter email"
                      />
                    ) : (
                      <p className="text-white">{clinic?.email || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-white">{clinic?.phone || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter location"
                      />
                    ) : (
                      <p className="text-white">{clinic?.location || 'Not set'}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Preferences */}
            <Card className="glass-effect premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Billing Preferences</span>
                </CardTitle>
                <CardDescription>
                  Manage your payment methods and billing settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Billing settings coming soon</p>
                  <p className="text-sm text-gray-500 mt-2">
                    We're working on integrating secure payment processing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="glass-effect premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Email Notifications</p>
                    <p className="text-xs text-gray-400">New leads and updates</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">SMS Alerts</p>
                    <p className="text-xs text-gray-400">Urgent lead notifications</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Push Notifications</p>
                    <p className="text-xs text-gray-400">Real-time updates</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="glass-effect premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>API Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Key className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">API integration coming soon</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Connect your existing systems
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="glass-effect premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Account Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Account Type</span>
                  <Badge className="bg-cyan-600">Premium</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Member Since</span>
                  <span className="text-sm text-white">
                    {new Date(clinic?.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Status</span>
                  <Badge className="bg-cyan-600">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
