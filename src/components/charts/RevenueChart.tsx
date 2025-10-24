'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'

const data = [
  { value: 150 },
  { value: 180 },
  { value: 220 },
  { value: 200 },
  { value: 250 },
  { value: 280 },
  { value: 300 },
]

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#10b981" />
            <stop offset="95%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="url(#colorRevenue)" 
          strokeWidth={3}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

