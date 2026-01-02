import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
}
export function LineChart({
  data,
  dataKey,
  xAxisKey,
  color = '#3B82F6',
  height = 300
}: LineChartProps) {
  return <div className="w-full" style={{
    height
  }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{
        top: 5,
        right: 20,
        bottom: 5,
        left: 0
      }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={value => `${value}`} />
          <Tooltip contentStyle={{
          backgroundColor: '#1E293B',
          borderColor: '#334155',
          color: '#F8FAFC',
          borderRadius: '0.5rem'
        }} itemStyle={{
          color: '#F8FAFC'
        }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{
          r: 4,
          fill: color,
          strokeWidth: 2,
          stroke: '#1E293B'
        }} activeDot={{
          r: 6,
          strokeWidth: 0
        }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>;
}