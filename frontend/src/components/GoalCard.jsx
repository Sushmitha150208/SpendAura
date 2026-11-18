import React, { useState } from 'react';
import { Flag, Plus, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { LaptopGoalIllustration } from './Illustrations';

export const GoalCard = () => {
  const { activeGoal, currency, depositToGoal } = useApp();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const target = Number(activeGoal?.targetAmount || 60000);
  const saved = Number(activeGoal?.savedAmount || 18450);
  const percent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;

  const handleQuickDeposit = (e) => {
    e.preventDefault();
    if (depositAmount && Number(depositAmount) > 0) {
      depositToGoal(activeGoal.id, Number(depositAmount));
      setDepositAmount('');
      setQuickAddOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-pink-100/60 flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Flag className="w-5 h-5 text-[#581C38]" />
          <h2 className="font-bold text-[#3A0D22] text-base">Your Goal</h2>
        </div>

        <Link
          to="/goals"
          className="text-xs font-bold text-[#581C38] hover:text-[#A8325E] transition-colors"
        >
          Manage
        </Link>
      </div>

      {/* Goal Details & Laptop Art */}
      <div className="flex items-center justify-between gap-4 my-auto">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold text-[#4A2D3C] block mb-2">
            {activeGoal?.name || 'Save for a Laptop'}
          </span>

          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 mb-2.5 max-w-[200px]">
            <div
              className="h-full bg-[#14B8A6] rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#3A0D22]">
              {formatCurrency(saved, currency)}
            </span>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs font-semibold text-[#8C6A78]">
              {formatCurrency(target, currency)}
            </span>
          </div>
        </div>

        {/* Laptop Illustration from mockup */}
        <div className="shrink-0">
          <LaptopGoalIllustration />
        </div>
      </div>

      {/* Quick Add money button */}
      <div className="mt-3 pt-2 border-t border-pink-50">
        {!quickAddOpen ? (
          <button
            onClick={() => setQuickAddOpen(true)}
            className="w-full py-1.5 px-3 rounded-xl bg-pink-50 hover:bg-pink-100/80 text-[#581C38] text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Savings to Goal</span>
          </button>
        ) : (
          <form onSubmit={handleQuickDeposit} className="flex items-center space-x-2">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount (₹)"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-pink-200 focus:outline-none focus:ring-1 focus:ring-[#581C38]"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#581C38] text-white text-xs font-bold shrink-0"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setQuickAddOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600 px-1"
            >
              ✕
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
