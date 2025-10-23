'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, Check } from 'lucide-react'
import { themes, applyTheme, getStoredTheme, type ThemeName } from '@/lib/themes'
import { motion } from 'framer-motion'

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('clinical-teal')

  useEffect(() => {
    const stored = getStoredTheme()
    setCurrentTheme(stored)
    applyTheme(stored)
  }, [])

  const handleThemeChange = (themeName: ThemeName) => {
    setCurrentTheme(themeName)
    applyTheme(themeName)
  }

  return (
    <Card className="glass-effect premium-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-cyan-400" />
          <span className="text-white">Appearance Theme</span>
        </CardTitle>
        <CardDescription className="text-gray-300">
          Choose from 7 premium 2025 color schemes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(themes).map((theme, index) => {
            const isActive = currentTheme === theme.name
            return (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <button
                  onClick={() => handleThemeChange(theme.name)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    isActive
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold text-lg">{theme.displayName}</h4>
                    {isActive && (
                      <Badge className="bg-cyan-600 text-white">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{theme.description}</p>
                  
                  {/* Color Preview */}
                  <div className="flex space-x-2">
                    <div 
                      className="w-10 h-10 rounded-lg border border-white/20 shadow-inner"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-10 h-10 rounded-lg border border-white/20 shadow-inner"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="w-10 h-10 rounded-lg border border-white/20 shadow-inner"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colors.background}, ${theme.colors.backgroundEnd})`
                      }}
                      title="Background"
                    />
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
        
        <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <p className="text-cyan-200 text-sm">
            <strong>💡 Pro Tip:</strong> Your theme choice will be saved and applied across all pages.
            The entire dashboard, modals, and buttons will adapt to your selected color scheme.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

