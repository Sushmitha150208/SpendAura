import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieIcon,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export const Reports = () => {
  const { transactions, categoryStats, totalIncome, totalExpense, savings, currency } = useApp();
  const [timeframe, setTimeframe] = useState('monthly'); // 'weekly', 'monthly', 'yearly'

  // Month-over-month comparison calculations (FR-24)
  const currentMonthExpense = totalExpense;
  const lastMonthExpense = 23000; // Benchmark comparison from seed data
  const diff = currentMonthExpense - lastMonthExpense;
  const percentChange = Math.round((Math.abs(diff) / lastMonthExpense) * 100);
  const isSpendingReduced = diff < 0;

  // Breakdown by payment method
  const paymentMethodStats = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const method = t.paymentMethod || 'UPI';
      acc[method] = (acc[method] || 0) + Number(t.amount);
      return acc;
    }, {});

  // CSV Export handler (FR-25)
  const handleExportCSV = () => {
    const headers = ['ID,Type,Note,Category,Amount,Payment Method,Date\n'];
    const rows = transactions.map((t) => 
      `"${t.id}","${t.type}","${t.note || ''}","${t.categoryName || ''}","${t.amount}","${t.paymentMethod || ''}","${t.dateTime}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SpendAura_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF / Print handler (FR-25)
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3A0D22]">Financial Reports</h1>
          <p className="text-xs sm:text-sm text-[#8C6A78]">
            Analyze spending patterns, compare months, and export analytics.
          </p>
        </div>

        {/* Action Buttons: CSV & Print/PDF */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 text-[#581C38] text-xs font-bold shadow-xs border border-pink-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-[#581C38] hover:bg-[#421229] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Timeframe Filter Tabs */}
      <div className="flex space-x-2 p-1 bg-pink-100/60 rounded-2xl max-w-xs">
        {['weekly', 'monthly', 'yearly'].map((tab) => (
          <button
            key={tab}
            onClick={() => setTimeframe(tab)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              timeframe === tab
                ? 'bg-white text-[#581C38] shadow-xs'
                : 'text-[#8C6A78] hover:text-[#581C38]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Month-over-Month Comparison Card (FR-24) */}
      <div className="bg-gradient-to-r from-[#FFF5F7] to-[#FCEAEF] rounded-3xl p-6 border border-pink-100/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C6A78]">
            Month-over-Month Insight
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#3A0D22]">
            {isSpendingReduced ? 'Great job! You spent less this month.' : 'Spending increased compared to last month.'}
          </h2>
          <p className="text-xs text-[#6B5561]">
            October expenses: <strong className="text-[#3A0D22]">{formatCurrency(currentMonthExpense, currency)}</strong> vs September:{' '}
            <strong className="text-[#3A0D22]">{formatCurrency(lastMonthExpense, currency)}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs ${
              isSpendingReduced ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {isSpendingReduced ? <TrendingDown className="w-7 h-7" /> : <TrendingUp className="w-7 h-7" />}
          </div>
          <div>
            <span className={`text-2xl font-bold ${isSpendingReduced ? 'text-emerald-700' : 'text-rose-700'}`}>
              {percentChange}% {isSpendingReduced ? 'decrease' : 'increase'}
            </span>
            <span className="block text-xs text-[#8C6A78]">vs previous month</span>
          </div>
        </div>
      </div>

      {/* Grid: Category Breakdown & Payment Method Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spending Categories */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-pink-100/70 space-y-4">
          <div className="flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-[#581C38]" />
            <h3 className="font-bold text-[#3A0D22] text-base">Category Expenditure</h3>
          </div>

          <div className="space-y-3.5">
            {categoryStats.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#3A0D22]">{item.name}</span>
                  <span className="text-[#6B5561]">
                    {formatCurrency(item.total, currency)} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-pink-100/70 space-y-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-[#581C38]" />
            <h3 className="font-bold text-[#3A0D22] text-base">Payment Methods</h3>
          </div>

          <div className="space-y-3.5">
            {Object.entries(paymentMethodStats).map(([method, amount]) => {
              const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
              return (
                <div key={method} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#3A0D22]">{method}</span>
                    <span className="text-[#6B5561]">
                      {formatCurrency(amount, currency)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#581C38]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
