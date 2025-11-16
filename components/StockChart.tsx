
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { StockDataPoint } from '../types';

interface StockChartProps {
  data: StockDataPoint[];
}

export const StockChart: React.FC<StockChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;
  }

  const lastPrice = data[data.length - 1]?.price;
  const firstPrice = data[0]?.price;
  const strokeColor = lastPrice >= firstPrice ? '#34D399' : '#F87171';
  const gradientId = lastPrice >= firstPrice ? 'gradientGreen' : 'gradientRed';

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34D399" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F87171" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis 
            dataKey="day" 
            tick={{ fill: '#A0AEC0' }} 
            axisLine={{ stroke: '#4A5568' }}
            tickLine={{ stroke: '#4A5568' }}
          />
          <YAxis 
            tick={{ fill: '#A0AEC0' }} 
            axisLine={{ stroke: '#4A5568' }}
            tickLine={{ stroke: '#4A5568' }}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderColor: '#4A5568',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#E5E7EB' }}
            itemStyle={{ color: '#E5E7EB' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            labelFormatter={(label: number) => `Day: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
