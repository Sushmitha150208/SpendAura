import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { HeaderDeskIllustration } from '../components/Illustrations';
import { SummaryCards } from '../components/SummaryCards';
import { ExpenseDonutChart } from '../components/ExpenseDonutChart';
import { MonthlyOverviewChart } from '../components/MonthlyOverviewChart';
import { RecentTransactions } from '../components/RecentTransactions';
import { BudgetProgress } from '../components/BudgetProgress';
import { GoalCard } from '../components/GoalCard';

export const Dashboard = () => {
  const { user } = useAuth();
  const { setIsAddExpenseOpen, setEditingTransaction } = useApp();

  const handleOpenAddExpense = () => {
    setEditingTransaction(null);
    setIsAddExpenseOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Greeting Banner matching the design */}
      <div className="relative bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#FCEAEF] rounded-3xl p-6 sm:p-8 shadow-xs border border-pink-100/70 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left greeting text & CTA */}
        <div className="relative z-10 max-w-md space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A0D22] tracking-tight">
            Hi there! <span className="inline-block transform hover:rotate-12 transition-transform cursor-pointer">👋</span>
          </h1>
          <p className="text-sm sm:text-base text-[#6B5561] font-medium leading-relaxed">
            Track, manage, and make smarter money choices.
          </p>

          <div className="pt-2">
            <button
              onClick={handleOpenAddExpense}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#581C38] hover:bg-[#421229] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Right decorative Desk Illustration (Books, Cup, Calendar, Trailing vines) */}
        <div className="relative z-0 self-end md:self-center w-full md:w-auto">
          <HeaderDeskIllustration />
        </div>
      </div>

      {/* 4 Summary Cards (Total Balance, Total Income, Total Expense, Savings) */}
      <SummaryCards />

      {/* Middle Grid: Expense by Category (Donut) & Monthly Overview (Area chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseDonutChart />
        <MonthlyOverviewChart />
      </div>

      {/* Bottom Grid: Recent Transactions, Budget Progress, Your Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <RecentTransactions />
        <BudgetProgress />
        <GoalCard />
      </div>
    </div>
  );
};
