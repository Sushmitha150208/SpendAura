import React, { useState } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MONTHLY_OVERVIEW_DATA } from '../services/seedData';
import { formatCurrency } from '../utils/formatters';

export const MonthlyOverviewChart = () => {
  const { currency, monthlyOverviewFilter, setMonthlyOverviewFilter } = useApp();
  const [activePoint, setActivePoint] = useState(null);

  const data = MONTHLY_OVERVIEW_DATA;
  const maxY = 40000;

  // SVG Chart Dimensions
  const width = 500;
  const height = 220;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Coordinates helper
  const getX = (index) => paddingX + (index / (data.length - 1)) * chartW;
  const getY = (val) => height - paddingY - (val / maxY) * chartH;

  // Build smooth cubic bezier curve SVG path
  const createSplinePath = (key) => {
    return data.reduce((acc, point, i, arr) => {
      const x = getX(i);
      const y = getY(point[key]);
      if (i === 0) return `M ${x},${y}`;

      const prevX = getX(i - 1);
      const prevY = getY(arr[i - 1][key]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpX2 = prevX + (x - prevX) / 2;
      return `${acc} C ${cpX1},${prevY} ${cpX2},${y} ${x},${y}`;
    }, '');
  };

  const incomePath = createSplinePath('income');
  const expensePath = createSplinePath('expense');

  // Closed area paths for gradient fill
  const incomeAreaPath = `${incomePath} L ${getX(data.length - 1)},${height - paddingY} L ${getX(0)},${height - paddingY} Z`;
  const expenseAreaPath = `${expensePath} L ${getX(data.length - 1)},${height - paddingY} L ${getX(0)},${height - paddingY} Z`;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-pink-100/60 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-[#581C38]" />
          <h2 className="font-bold text-[#3A0D22] text-base">Monthly Overview</h2>
        </div>

        {/* Dropdown chip */}
        <div className="relative">
          <select
            value={monthlyOverviewFilter}
            onChange={(e) => setMonthlyOverviewFilter(e.target.value)}
            className="appearance-none bg-pink-50/70 text-xs font-semibold text-[#581C38] pl-3 pr-7 py-1.5 rounded-full border border-pink-100 hover:bg-pink-100/70 focus:outline-none cursor-pointer"
          >
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>Last 12 Months</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#581C38] pointer-events-none" />
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full h-56">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Income Gradient */}
            <linearGradient id="income_area_grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>
            {/* Expense Gradient */}
            <linearGradient id="expense_area_grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis labels */}
          {[0, 10000, 20000, 30000, 40000].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#F3E8E8"
                  strokeWidth="1"
                  strokeDasharray="2,3"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#9D7D8B"
                  fontSize="10"
                  fontWeight="500"
                >
                  {val === 0 ? '0' : `${val / 1000}K`}
                </text>
              </g>
            );
          })}

          {/* Fills */}
          <path d={incomeAreaPath} fill="url(#income_area_grad)" />
          <path d={expenseAreaPath} fill="url(#expense_area_grad)" />

          {/* Lines */}
          <path d={incomePath} fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <path d={expensePath} fill="none" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" />

          {/* Data Points */}
          {data.map((point, i) => {
            const x = getX(i);
            const yInc = getY(point.income);
            const yExp = getY(point.expense);

            return (
              <g key={point.month}>
                {/* Income point */}
                <circle
                  cx={x}
                  cy={yInc}
                  r="4.5"
                  fill="#FFFFFF"
                  stroke="#8B5CF6"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-transform hover:scale-125"
                  onMouseEnter={() => setActivePoint({ ...point, type: 'Income', amount: point.income, x, y: yInc })}
                  onMouseLeave={() => setActivePoint(null)}
                />

                {/* Expense point */}
                <circle
                  cx={x}
                  cy={yExp}
                  r="4.5"
                  fill="#FFFFFF"
                  stroke="#14B8A6"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-transform hover:scale-125"
                  onMouseEnter={() => setActivePoint({ ...point, type: 'Expense', amount: point.expense, x, y: yExp })}
                  onMouseLeave={() => setActivePoint(null)}
                />

                {/* X axis month labels */}
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  fill="#7A5B69"
                  fontSize="11"
                  fontWeight="600"
                >
                  {point.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1.5 bg-[#3A0D22] text-white text-xs rounded-lg shadow-lg font-medium whitespace-nowrap"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100}%`,
              marginTop: '-8px',
            }}
          >
            {activePoint.type}: {formatCurrency(activePoint.amount, currency)} ({activePoint.month})
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-3 pt-2 border-t border-pink-50">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
          <span className="text-xs font-semibold text-[#581C38]">Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#14B8A6]"></span>
          <span className="text-xs font-semibold text-[#581C38]">Expense</span>
        </div>
      </div>
    </div>
  );
};
