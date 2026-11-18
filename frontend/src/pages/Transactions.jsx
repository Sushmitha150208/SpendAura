import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  Edit3, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatFriendlyDate } from '../utils/formatters';

export const Transactions = () => {
  const { 
    transactions, 
    categories, 
    currency, 
    deleteTransaction, 
    setIsAddExpenseOpen, 
    setEditingTransaction 
  } = useApp();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals for actions
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [viewReceiptUrl, setViewReceiptUrl] = useState(null);

  // Filtered and Sorted list
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchNote = (t.note || '').toLowerCase().includes(term);
          const matchCat = (t.categoryName || '').toLowerCase().includes(term);
          if (!matchNote && !matchCat) return false;
        }

        // Category
        if (selectedCategory !== 'ALL' && t.category !== selectedCategory) {
          return false;
        }

        // Type
        if (selectedType !== 'ALL' && t.type !== selectedType) {
          return false;
        }

        // Date Filter
        if (dateFilter !== 'ALL') {
          const txDate = new Date(t.dateTime);
          const now = new Date();
          if (dateFilter === 'TODAY' && txDate.toDateString() !== now.toDateString()) {
            return false;
          }
          if (dateFilter === 'THIS_MONTH') {
            if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.dateTime) - new Date(a.dateTime);
        if (sortBy === 'date-asc') return new Date(a.dateTime) - new Date(b.dateTime);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchTerm, selectedCategory, selectedType, dateFilter, sortBy]);

  // Paginated slice
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setIsAddExpenseOpen(true);
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3A0D22]">Transactions</h1>
          <p className="text-xs sm:text-sm text-[#8C6A78]">
            Manage, filter, and review all your income and expenses.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTransaction(null);
            setIsAddExpenseOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#581C38] hover:bg-[#421229] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-pink-100/70 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by note or merchant..."
              className="w-full pl-10 pr-3 py-2 bg-pink-50/40 text-xs text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#581C38]/20"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-pink-50/40 text-xs font-semibold text-[#581C38] rounded-xl border border-pink-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-pink-50/40 text-xs font-semibold text-[#581C38] rounded-xl border border-pink-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-pink-50/40 text-xs font-semibold text-[#581C38] rounded-xl border border-pink-200 focus:outline-none cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-pink-100/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50/60 border-b border-pink-100 text-[11px] font-bold text-[#8C6A78] uppercase tracking-wider">
                <th className="py-4 px-6">Transaction</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Method</th>
                <th className="py-4 px-4">Receipt</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50 text-xs">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    No transactions found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const isExpense = tx.type === 'expense';
                  return (
                    <tr key={tx.id} className="hover:bg-pink-50/40 transition-colors">
                      {/* Name / Note */}
                      <td className="py-3.5 px-6 font-bold text-[#3A0D22]">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`p-1.5 rounded-lg ${
                              isExpense ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-600'
                            }`}
                          >
                            {isExpense ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                          </span>
                          <span>{tx.note || tx.categoryName}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-semibold text-[#581C38]">
                        <span className="px-2.5 py-1 rounded-full bg-pink-50 text-[11px]">
                          {tx.categoryName}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-[#8C6A78]">
                        {formatFriendlyDate(tx.dateTime)}
                      </td>

                      {/* Method */}
                      <td className="py-3.5 px-4 text-[#6B5561] font-medium">
                        {tx.paymentMethod || 'UPI'}
                      </td>

                      {/* Receipt */}
                      <td className="py-3.5 px-4">
                        {tx.receipt ? (
                          <button
                            onClick={() => setViewReceiptUrl(tx.receipt)}
                            className="p-1 rounded-md bg-pink-100/70 text-[#581C38] hover:bg-pink-200 transition-colors"
                            title="View receipt"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-6 text-right font-bold text-sm">
                        <span className={isExpense ? 'text-[#E11D48]' : 'text-[#0D9488]'}>
                          {isExpense ? '- ' : '+ '}
                          {formatCurrency(tx.amount, currency).replace('- ', '')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="p-1.5 rounded-lg hover:bg-pink-100 text-[#581C38] transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(tx.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-pink-50/40 border-t border-pink-100 text-xs">
          <span className="text-[#8C6A78] font-medium">
            Showing {filteredTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
            {filteredTransactions.length} entries
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-white border border-pink-200 disabled:opacity-40 hover:bg-pink-50"
            >
              <ChevronLeft className="w-4 h-4 text-[#581C38]" />
            </button>
            <span className="font-bold text-[#581C38] px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-white border border-pink-200 disabled:opacity-40 hover:bg-pink-50"
            >
              <ChevronRight className="w-4 h-4 text-[#581C38]" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (FR-13) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3A0D22]">
              Delete Transaction?
            </h3>
            <p className="text-xs text-[#8C6A78] leading-relaxed">
              Are you sure you want to delete this transaction? This action will adjust your balances immediately.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#6B5561] hover:bg-pink-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#E11D48] text-white hover:bg-red-700 shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {viewReceiptUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setViewReceiptUrl(null)}
        >
          <div className="bg-white p-3 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <img src={viewReceiptUrl} alt="Receipt" className="w-full h-auto rounded-xl object-contain" />
            <button
              onClick={() => setViewReceiptUrl(null)}
              className="w-full mt-3 py-2 text-xs font-bold text-[#581C38] bg-pink-100 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
