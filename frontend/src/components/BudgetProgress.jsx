import React from 'react';
import { Target, ChevronDown, Utensils, ShoppingBag, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

const getBudgetVisuals = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('food') || lower.includes('dining')) {
    return {
      icon: Utensils,
      badgeBg: 'bg-[#FCE7EE]',
      iconColor: 'text-[#581C38]',
      barColor: 'bg-[#581C38]',
      tagBg: 'bg-[#FCE7EE] text-[#581C38]',
    };
  }
  if (lower.includes('shop')) {
    return {
      icon: ShoppingBag,
      badgeBg: 'bg-[#CCFBF1]',
      iconColor: 'text-[#0D9488]',
      barColor: 'bg-[#14B8A6]',
      tagBg: 'bg-[#CCFBF1] text-[#0F766E]',
    };
  }
  return {
    icon: Zap,
    badgeBg: 'bg-[#FEF3C7]',
    iconColor: 'text-[#D97706]',
    barColor: 'bg-[#F59E0B]',
    tagBg: 'bg-[#FEF3C7] text-[#B45309]',
  };
};

export const BudgetProgress = () => {
  const { budgets, currency } = useApp();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-pink-100/60 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-[#581C38]" />
          <h2 className="font-bold text-[#3A0D22] text-base">Budget Progress</h2>
        </div>

        {/* Dropdown chip */}
        <div className="relative">
          <select className="appearance-none bg-pink-50/70 text-xs font-semibold text-[#581C38] pl-3 pr-7 py-1.5 rounded-full border border-pink-100 hover:bg-pink-100/70 focus:outline-none cursor-pointer">
            <option>This Month</option>
            <option>Last Month</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#581C38] pointer-events-none" />
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 flex-1 justify-center flex flex-col">
        {budgets.slice(0, 3).map((item) => {
          const { icon: Icon, badgeBg, iconColor, barColor, tagBg } = getBudgetVisuals(item.categoryName);
          const percentClamped = Math.min(100, item.percentage || 0);
          const isOverBudget = (item.percentage || 0) >= 100;

          return (
            <div key={item.id || item.categoryName} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                {/* Category Icon & Name */}
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${badgeBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  </div>
                  <span className="font-bold text-[#3A0D22] truncate">
                    {item.categoryName}
                  </span>
                </div>

                {/* Amount & Percentage */}
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#6B5561]">
                    {formatCurrency(item.spent, currency)} <span className="text-gray-400">/</span> {formatCurrency(item.limit, currency)}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isOverBudget ? 'bg-red-100 text-red-700' : tagBg}`}>
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-[#E11D48]' : barColor}`}
                  style={{ width: `${percentClamped}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
