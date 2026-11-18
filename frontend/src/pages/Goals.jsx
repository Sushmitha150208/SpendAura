import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Laptop, Shield, Palmtree, Sparkles, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

const getGoalIcon = (iconName) => {
  if (iconName === 'Laptop') return Laptop;
  if (iconName === 'Shield') return Shield;
  if (iconName === 'Palmtree') return Palmtree;
  return Target;
};

export const Goals = () => {
  const { goals, currency, addGoal, depositToGoal, withdrawFromGoal } = useApp();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [depositModalGoal, setDepositModalGoal] = useState(null);
  const [withdrawModalGoal, setWithdrawModalGoal] = useState(null);
  const [amountInput, setAmountInput] = useState('');

  // Create Goal fields
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [newGoalIcon, setNewGoalIcon] = useState('Laptop');

  // Celebration state (FR-28)
  const [celebrationMessage, setCelebrationMessage] = useState(null);

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalTarget || Number(newGoalTarget) <= 0) return;

    addGoal({
      name: newGoalName.trim(),
      targetAmount: Number(newGoalTarget),
      targetDate: newGoalDate || null,
      icon: newGoalIcon,
    });

    setIsCreateOpen(false);
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalDate('');
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const num = Number(amountInput);
    if (depositModalGoal && num > 0) {
      depositToGoal(depositModalGoal.id, num);
      if (depositModalGoal.savedAmount + num >= depositModalGoal.targetAmount) {
        setCelebrationMessage(`🎉 Congratulations! You reached 100% for "${depositModalGoal.name}"!`);
        setTimeout(() => setCelebrationMessage(null), 5000);
      }
      setDepositModalGoal(null);
      setAmountInput('');
    }
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const num = Number(amountInput);
    if (withdrawModalGoal && num > 0) {
      withdrawFromGoal(withdrawModalGoal.id, num);
      setWithdrawModalGoal(null);
      setAmountInput('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert for Goal celebration */}
      {celebrationMessage && (
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>{celebrationMessage}</span>
          </div>
          <button onClick={() => setCelebrationMessage(null)} className="text-white hover:text-gray-200 text-xs px-2">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3A0D22]">Savings Goals</h1>
          <p className="text-xs sm:text-sm text-[#8C6A78]">
            Set financial targets, track your progress, and stay motivated.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#581C38] hover:bg-[#421229] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((g) => {
          const Icon = getGoalIcon(g.icon);
          const percent = g.targetAmount > 0 ? Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100)) : 0;
          const isCompleted = g.status === 'completed' || percent >= 100;

          return (
            <div
              key={g.id}
              className="bg-white rounded-3xl p-6 shadow-xs border border-pink-100/70 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              {/* Completed Badge */}
              {isCompleted && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>COMPLETED</span>
                </div>
              )}

              {/* Goal Icon & Title */}
              <div className="flex items-center space-x-3 pt-1">
                <div className={`w-12 h-12 rounded-2xl ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-pink-50 text-[#581C38]'} flex items-center justify-center shrink-0 shadow-xs`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3A0D22] text-base">{g.name}</h3>
                  <span className="text-xs text-[#8C6A78]">
                    {g.targetDate ? `Target: ${new Date(g.targetDate).toLocaleDateString()}` : 'No deadline'}
                  </span>
                </div>
              </div>

              {/* Amounts and Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#6B5561]">
                    Saved: <strong className="text-[#3A0D22]">{formatCurrency(g.savedAmount, currency)}</strong>
                  </span>
                  <span className="text-[#6B5561]">
                    Target: <strong className="text-[#3A0D22]">{formatCurrency(g.targetAmount, currency)}</strong>
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-[#14B8A6]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#581C38]">{percent}% achieved</span>
                  <span className="text-[#8C6A78]">
                    {isCompleted ? 'Target met! 🎉' : `${formatCurrency(Math.max(0, g.targetAmount - g.savedAmount), currency)} to go`}
                  </span>
                </div>
              </div>

              {/* Action buttons: Add Money & Withdraw */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-pink-50">
                <button
                  onClick={() => {
                    setDepositModalGoal(g);
                    setAmountInput('');
                  }}
                  className="py-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#581C38] text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>Add Money</span>
                </button>
                <button
                  disabled={g.savedAmount <= 0}
                  onClick={() => {
                    setWithdrawModalGoal(g);
                    setAmountInput('');
                  }}
                  className="py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-40 text-gray-700 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                >
                  <ArrowUpCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#581C38]">Create Savings Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Goal Name *</label>
                <input
                  type="text"
                  required
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g. Save for a Laptop, Vacation..."
                  className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Target Amount ({currency}) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="e.g. 60000"
                  className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Target Date</label>
                <input
                  type="date"
                  value={newGoalDate}
                  onChange={(e) => setNewGoalDate(e.target.value)}
                  className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Select Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Laptop', 'Shield', 'Palmtree', 'Target'].map((iconKey) => {
                    const Ic = getGoalIcon(iconKey);
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setNewGoalIcon(iconKey)}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                          newGoalIcon === iconKey
                            ? 'bg-[#581C38] text-white border-[#581C38]'
                            : 'bg-pink-50/50 text-[#581C38] border-pink-200'
                        }`}
                      >
                        <Ic className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#581C38] text-white rounded-xl shadow-xs"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#581C38]">
              Add Money to {depositModalGoal.name}
            </h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Deposit Amount ({currency})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 text-sm font-bold"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0D9488] text-white rounded-xl shadow-xs"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#581C38]">
              Withdraw from {withdrawModalGoal.name}
            </h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">
                  Withdrawal Amount ({currency}) (Max: {formatCurrency(withdrawModalGoal.savedAmount, currency)})
                </label>
                <input
                  type="number"
                  min="1"
                  max={withdrawModalGoal.savedAmount}
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 text-sm font-bold"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setWithdrawModalGoal(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl shadow-xs"
                >
                  Confirm Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
