'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10">
                  <Image
                    src="/logo.png"
                    alt="Clinic Concierge"
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <span className="text-lg font-bold text-white">
                  Clinic Concierge
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Premium lead management for beauty clinics. Grow your business with qualified, verified leads.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                    Account
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:support@clinicconcierge.com" className="hover:text-cyan-400 transition-colors">
                    support@clinicconcierge.com
                  </a>
                </li>
                <li className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>(604) 555-0100</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Vancouver, BC</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} Clinic Concierge. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
                Status
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
                API Docs
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

