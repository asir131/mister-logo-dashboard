import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  colors?: string[];
  height?: number;
}
export function BarChart({
  data,
  dataKey,
  xAxisKey,
  colors = ['#3B82F6'],
  height = 300
}: BarChartProps) {
  return <div className="w-full" style={{
    height
  }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{
        top: 5,
        right: 20,
        bottom: 5,
        left: 0
      }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{
          fill: '#334155',
          opacity: 0.2
        }} contentStyle={{
          backgroundColor: '#1E293B',
          borderColor: '#334155',
          color: '#F8FAFC',
          borderRadius: '0.5rem'
        }} />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>;
}