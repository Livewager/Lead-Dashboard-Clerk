'use client'

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts'

interface QualityScoreChartProps {
  score: number
}

export default function QualityScoreChart({ score }: QualityScoreChartProps) {
  const data = [{ value: score, fill: '#eab308' }]

  return (
    <ResponsiveContainer width="100%" height={60}>
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="60%" 
        outerRadius="100%" 
        barSize={8}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          background={{ fill: '#422006' }}
          dataKey="value"
          cornerRadius={10}
          fill="#eab308"
        />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}

