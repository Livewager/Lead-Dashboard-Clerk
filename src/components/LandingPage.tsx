'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Sparkles, 
  TrendingUp, 
  Lock, 
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  DollarSign,
  Clock,
  Target
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-green-600 text-white px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Premium Lead Management
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Grow Your Beauty Clinic with Qualified Leads
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              Connect with high-quality, verified leads ready to book their next beauty treatment. 
              Our intelligent matching system delivers leads that convert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
                  <Users className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Log In
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get started in minutes and start converting leads today
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: '1. Sign Up',
                description: 'Create your clinic profile and tell us about your services'
              },
              {
                icon: Target,
                title: '2. Browse Leads',
                description: 'View qualified leads with scores, locations, and preferences'
              },
              {
                icon: Zap,
                title: '3. Claim & Convert',
                description: 'Claim leads instantly and access full contact information'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="glass-effect premium-shadow h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership & Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Pay only for the leads you claim. No subscriptions, no hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                tier: 'Warm Lead',
                price: '$25',
                score: '60-75',
                features: [
                  'Basic lead information',
                  'Location & preferences',
                  'Full contact details',
                  '24hr response time'
                ]
              },
              {
                tier: 'Hot Lead',
                price: '$45',
                score: '75-90',
                features: [
                  'Detailed lead profile',
                  'Priority placement',
                  'Full contact details',
                  'Instant notification',
                  'High conversion rate'
                ],
                popular: true
              },
              {
                tier: 'Platinum Lead',
                price: '$75',
                score: '90-100',
                features: [
                  'Premium verified leads',
                  'Highest quality score',
                  'Full contact details',
                  'Instant notification',
                  'Guaranteed interested',
                  'VIP support'
                ]
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className={`glass-effect premium-shadow h-full ${plan.popular ? 'border-2 border-green-500' : ''}`}>
                  <CardHeader>
                    {plan.popular && (
                      <Badge className="mb-2 bg-green-600 text-white w-fit">
                        Most Popular
                      </Badge>
                    )}
                    <CardTitle className="text-2xl text-white">{plan.tier}</CardTitle>
                    <CardDescription>
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400"> per lead</span>
                    </CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">Score: {plan.score}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                    <Link href="/sign-up" className="block mt-6">
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Clinic Concierge?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Lock,
                title: 'Exclusive Access',
                description: 'Each lead is sold only once. No competition, no sharing.'
              },
              {
                icon: TrendingUp,
                title: 'Quality Scores',
                description: 'AI-powered scoring helps you identify the best opportunities.'
              },
              {
                icon: Clock,
                title: 'Real-Time Alerts',
                description: 'Get notified instantly when new leads match your criteria.'
              },
              {
                icon: DollarSign,
                title: 'Pay Per Lead',
                description: 'No subscriptions. Only pay for leads you choose to claim.'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-effect premium-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <benefit.icon className="h-6 w-6 text-green-400" />
                      </div>
                      <CardTitle className="text-xl text-white">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: 'How does the lead quality score work?',
                a: 'Our AI analyzes multiple factors including lead engagement, demographics, treatment preferences, and budget to assign a score from 0-100. Higher scores indicate better conversion potential.'
              },
              {
                q: 'Can I preview a lead before claiming?',
                a: 'Yes! You can view lead scores, location, treatment preferences, and a blurred photo before claiming. Full contact details are revealed after purchase.'
              },
              {
                q: 'Are leads exclusive?',
                a: 'Absolutely. Each lead is sold to only one clinic. Once you claim a lead, it\'s yours exclusively with no competition.'
              },
              {
                q: 'How quickly do I get lead information?',
                a: 'Instantly! Once you claim a lead, you immediately receive full contact details and can start your outreach.'
              },
              {
                q: 'Is there a subscription fee?',
                a: 'No subscriptions required. You only pay for the leads you choose to claim. Start with no commitment.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-effect premium-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="glass-effect premium-shadow border-2 border-green-500/50">
            <CardContent className="py-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Grow Your Clinic?
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Join hundreds of beauty clinics already converting leads with Clinic Concierge
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    Log In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold text-white">Clinic Concierge</span>
              </div>
              <p className="text-gray-400">
                Premium lead management for beauty clinics
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><Link href="/sign-in" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link href="/sign-up" className="text-gray-400 hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">support@clinicconcierge.com</li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 pt-8 border-t border-white/10">
            <p>&copy; 2025 Clinic Concierge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
