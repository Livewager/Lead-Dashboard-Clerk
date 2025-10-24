'use client'

import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const data = [
  { value: 3 },
  { value: 4 },
  { value: 3 },
  { value: 5 },
  { value: 4 },
  { value: 6 },
  { value: 6 },
]

export default function NewLeadsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorNewLeads" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#06b6d4" 
          strokeWidth={2}
          fill="url(#colorNewLeads)" 
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

