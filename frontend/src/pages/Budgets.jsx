import React, { useState } from 'react';
import { Target, Plus, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export const Budgets = () => {
  const { budgets, categories, currency, saveBudget } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');

  // Summaries
  const totalBudgeted = budgets.reduce((sum, b) => sum + Number(b.limit || 0), 0);
  const totalSpentInBudgets = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);
  const totalRemaining = Math.max(0, totalBudgeted - totalSpentInBudgets);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedCatId || !budgetLimit || Number(budgetLimit) <= 0) return;

    saveBudget({
      categoryId: selectedCatId,
      limit: Number(budgetLimit),
      month: 'This Month',
    });

    setIsModalOpen(false);
    setSelectedCatId('');
    setBudgetLimit('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3A0D22]">Monthly Budgets</h1>
          <p className="text-xs sm:text-sm text-[#8C6A78]">
            Plan spending limits for each category and avoid overspending.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCatId(categories[0]?.id || '');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#581C38] hover:bg-[#421229] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Set Category Budget</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-pink-100/70 shadow-xs">
          <span className="text-xs font-semibold text-[#8C6A78] block mb-1">Total Monthly Budget</span>
          <p className="text-2xl font-bold text-[#581C38]">{formatCurrency(totalBudgeted, currency)}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-pink-100/70 shadow-xs">
          <span className="text-xs font-semibold text-[#8C6A78] block mb-1">Total Budget Spent</span>
          <p className="text-2xl font-bold text-[#E11D48]">{formatCurrency(totalSpentInBudgets, currency)}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-pink-100/70 shadow-xs">
          <span className="text-xs font-semibold text-[#8C6A78] block mb-1">Remaining Allowance</span>
          <p className="text-2xl font-bold text-[#0D9488]">{formatCurrency(totalRemaining, currency)}</p>
        </div>
      </div>

      {/* Budget Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((b) => {
          const percent = b.percentage || 0;
          const isOver = percent >= 100;
          const isNear = percent >= 80 && percent < 100;
          const remaining = Math.max(0, b.limit - b.spent);

          return (
            <div
              key={b.id || b.categoryId}
              className="bg-white rounded-3xl p-6 shadow-xs border border-pink-100/70 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Alert Ribbon if over or near */}
              {isOver && (
                <div className="absolute top-0 right-0 bg-[#E11D48] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>OVER LIMIT</span>
                </div>
              )}
              {isNear && (
                <div className="absolute top-0 right-0 bg-[#F59E0B] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>80% REACHED</span>
                </div>
              )}

              {/* Title & Icon */}
              <div className="flex items-center space-x-3 pt-1">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: `${b.categoryColor || '#581C38'}18` }}
                >
                  <Target className="w-5 h-5" style={{ color: b.categoryColor || '#581C38' }} />
                </div>
                <div>
                  <h3 className="font-bold text-[#3A0D22] text-base">{b.categoryName}</h3>
                  <span className="text-xs text-[#8C6A78]">Monthly Target</span>
                </div>
              </div>

              {/* Progress & Values */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#6B5561]">
                    Spent: <span className="font-bold text-[#3A0D22]">{formatCurrency(b.spent, currency)}</span>
                  </span>
                  <span className="text-[#6B5561]">
                    Limit: <span className="font-bold text-[#3A0D22]">{formatCurrency(b.limit, currency)}</span>
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver
                        ? 'bg-[#E11D48]'
                        : isNear
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#14B8A6]'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className={`font-bold ${isOver ? 'text-[#E11D48]' : isNear ? 'text-[#D97706]' : 'text-[#0D9488]'}`}>
                    {percent}% used
                  </span>
                  <span className="text-[#8C6A78]">
                    {isOver ? `${formatCurrency(b.spent - b.limit, currency)} over` : `${formatCurrency(remaining, currency)} left`}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => {
                  setSelectedCatId(b.categoryId);
                  setBudgetLimit(b.limit);
                  setIsModalOpen(true);
                }}
                className="w-full py-2 bg-pink-50 hover:bg-pink-100/70 text-[#581C38] text-xs font-bold rounded-xl transition-colors"
              >
                Adjust Limit
              </button>
            </div>
          );
        })}
      </div>

      {/* Set Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#581C38]">Set Category Budget</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Select Category</label>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 text-xs font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Monthly Spending Limit ({currency})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 text-sm font-bold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#581C38] text-white rounded-xl shadow-xs"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
