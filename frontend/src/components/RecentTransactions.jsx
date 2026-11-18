import React from 'react';
import { Clock, ArrowRight, ShoppingCart, Utensils, Car, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatFriendlyDate } from '../utils/formatters';

const getTransactionIcon = (note, catName) => {
  const text = `${note} ${catName}`.toLowerCase();
  if (text.includes('groc') || text.includes('supermarket') || text.includes('mart')) {
    return { icon: ShoppingCart, bg: 'bg-[#FEF3C7]', color: 'text-[#D97706]' };
  }
  if (text.includes('rest') || text.includes('food') || text.includes('dining')) {
    return { icon: Utensils, bg: 'bg-[#FFE4E6]', color: 'text-[#E11D48]' };
  }
  if (text.includes('trans') || text.includes('cab') || text.includes('fuel')) {
    return { icon: Car, bg: 'bg-[#CCFBF1]', color: 'text-[#0D9488]' };
  }
  return { icon: ShoppingCart, bg: 'bg-[#EDE9FE]', color: 'text-[#7C3AED]' };
};

export const RecentTransactions = () => {
  const { recentTransactions, currency } = useApp();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-pink-100/60 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-[#581C38]" />
          <h2 className="font-bold text-[#3A0D22] text-base">Recent Transactions</h2>
        </div>

        <Link
          to="/transactions"
          className="text-xs font-bold text-[#581C38] hover:text-[#A8325E] flex items-center space-x-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3.5 flex-1 justify-center flex flex-col">
        {recentTransactions.map((tx) => {
          const { icon: Icon, bg, color } = getTransactionIcon(tx.note, tx.categoryName);
          const isExpense = tx.type === 'expense';

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-pink-50/60 transition-colors"
            >
              {/* Left icon & name */}
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center shrink-0 shadow-xs`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#3A0D22] truncate">
                    {tx.note || tx.categoryName}
                  </h3>
                  <span className="text-xs text-[#8C6A78] block">
                    {formatFriendlyDate(tx.dateTime)}
                  </span>
                </div>
              </div>

              {/* Right amount */}
              <div className="text-right ml-3 shrink-0">
                <span
                  className={`text-sm font-bold tracking-tight ${
                    isExpense ? 'text-[#E11D48]' : 'text-[#0D9488]'
                  }`}
                >
                  {isExpense ? '- ' : '+ '}
                  {formatCurrency(tx.amount, currency).replace('- ', '')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
