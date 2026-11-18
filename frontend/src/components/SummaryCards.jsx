import React from 'react';
import { Wallet, ArrowDown, ArrowUp, Coins } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export const SummaryCards = () => {
  const { totalBalance, totalIncome, totalExpense, savings, currency } = useApp();

  const cards = [
    {
      title: 'Total Balance',
      amount: totalBalance,
      bgColor: 'bg-[#F3E8FF]',
      borderColor: 'border-[#E9D5FF]',
      badgeBg: 'bg-[#EDE9FE]',
      iconColor: 'text-[#7C3AED]',
      icon: Wallet,
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      bgColor: 'bg-[#E0F7F6]',
      borderColor: 'border-[#CCFBF1]',
      badgeBg: 'bg-[#CCFBF1]',
      iconColor: 'text-[#0D9488]',
      icon: ArrowDown,
    },
    {
      title: 'Total Expense',
      amount: totalExpense,
      bgColor: 'bg-[#FFEAEA]',
      borderColor: 'border-[#FFE4E6]',
      badgeBg: 'bg-[#FFE4E6]',
      iconColor: 'text-[#E11D48]',
      icon: ArrowUp,
    },
    {
      title: 'Savings',
      amount: savings,
      bgColor: 'bg-[#FEF7E6]',
      borderColor: 'border-[#FEF3C7]',
      badgeBg: 'bg-[#FEF3C7]',
      iconColor: 'text-[#D97706]',
      icon: Coins,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`${card.bgColor} ${card.borderColor} border rounded-3xl p-5 flex items-center space-x-4 shadow-xs transition-transform duration-200 hover:-translate-y-0.5`}
          >
            {/* Round Icon Badge */}
            <div className={`w-12 h-12 rounded-2xl ${card.badgeBg} flex items-center justify-center shrink-0 shadow-xs`}>
              <Icon className={`w-6 h-6 ${card.iconColor}`} strokeWidth={2.4} />
            </div>

            {/* Label and Amount */}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-[#6B5561] block mb-0.5">
                {card.title}
              </span>
              <p className="text-xl sm:text-2xl font-bold text-[#3A0D22] tracking-tight truncate">
                {formatCurrency(card.amount, currency)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
