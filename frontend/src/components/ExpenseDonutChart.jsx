import React, { useState } from 'react';
import { 
  PieChart as PieIcon, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Home, 
  Heart, 
  MoreHorizontal,
  ChevronDown 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { LeafDonutCenterIcon } from './Illustrations';

// Icon mapping helper
const getCategoryIcon = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('food') || lower.includes('dining')) return Utensils;
  if (lower.includes('transport') || lower.includes('travel')) return Car;
  if (lower.includes('shop')) return ShoppingBag;
  if (lower.includes('bill') || lower.includes('util')) return Home;
  if (lower.includes('health') || lower.includes('med')) return Heart;
  return MoreHorizontal;
};

export const ExpenseDonutChart = () => {
  const { totalExpense, categoryStats, currency, dashboardTimeFilter, setDashboardTimeFilter } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Fallback data if no expenses exist yet
  const displayStats = categoryStats.length > 0 ? categoryStats : [
    { name: 'Food & Dining', percentage: 34, color: '#E76F51', total: 5627 },
    { name: 'Transport', percentage: 18, color: '#F4A261', total: 2979 },
    { name: 'Shopping', percentage: 15, color: '#E9C46A', total: 2482 },
    { name: 'Bills & Utilities', percentage: 12, color: '#8338EC', total: 1986 },
    { name: 'Health', percentage: 10, color: '#FF006E', total: 1655 },
    { name: 'Others', percentage: 11, color: '#94A3B8', total: 1821 },
  ];

  // SVG Donut calculation
  const size = 200;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-pink-100/60 flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <PieIcon className="w-5 h-5 text-[#581C38]" />
          <h2 className="font-bold text-[#3A0D22] text-base">Expense by Category</h2>
        </div>

        {/* Dropdown chip */}
        <div className="relative">
          <select
            value={dashboardTimeFilter}
            onChange={(e) => setDashboardTimeFilter(e.target.value)}
            className="appearance-none bg-pink-50/70 text-xs font-semibold text-[#581C38] pl-3 pr-7 py-1.5 rounded-full border border-pink-100 hover:bg-pink-100/70 focus:outline-none cursor-pointer"
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#581C38] pointer-events-none" />
        </div>
      </div>

      {/* Donut & Legend Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        {/* Donut Visual with SVG */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {displayStats.map((item, index) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.percentage;

              const isHovered = hoveredIndex === index;

              return (
                <circle
                  key={item.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Donut Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <LeafDonutCenterIcon className="w-6 h-6 mb-0.5" />
            <span className="text-base font-bold text-[#3A0D22] leading-tight">
              {formatCurrency(totalExpense, currency)}
            </span>
            <span className="text-[11px] font-medium text-[#8C6A78]">
              Total Expense
            </span>
          </div>
        </div>

        {/* Category Legend List */}
        <div className="flex-1 w-full space-y-2.5">
          {displayStats.map((item, idx) => {
            const Icon = getCategoryIcon(item.name);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between p-1 rounded-xl transition-colors cursor-pointer ${
                  isHovered ? 'bg-pink-50' : ''
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color}22` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <span className="text-xs font-semibold text-[#4A2D3C] truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#3A0D22] ml-2">
                  {item.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
