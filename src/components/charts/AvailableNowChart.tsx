'use client'

import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts'

const data = [
  { value: 2 },
  { value: 3 },
  { value: 2 },
  { value: 4 },
  { value: 3 },
  { value: 3 },
  { value: 3 },
]

const colors = ['#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#60a5fa']

export default function AvailableNowChart() {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <BarChart data={data}>
        <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={true}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

