import React from 'react';
import { BarChartData } from '../types';

interface BarChartProps {
  data: BarChartData[];
  title: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 h-full">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">{title}</h3>
      <div className="flex justify-around items-end h-64 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2 group h-full">
            <div 
              className="w-full bg-blue-200 group-hover:bg-blue-400 rounded-t-lg transition-all duration-300 ease-out"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.label}: ${item.value}`}
            ></div>
            <span className="text-xs font-medium text-slate-500 uppercase">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
