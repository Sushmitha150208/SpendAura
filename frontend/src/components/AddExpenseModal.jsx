import React, { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddExpenseModal = () => {
  const { 
    isAddExpenseOpen, 
    setIsAddExpenseOpen, 
    editingTransaction, 
    setEditingTransaction,
    categories, 
    addTransaction, 
    editTransaction,
    currency 
  } = useApp();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [note, setNote] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  // Initialize or reset form when opening
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type || 'expense');
      setAmount(editingTransaction.amount?.toString() || '');
      setCategory(editingTransaction.category || (categories[0]?.id || ''));
      setDateTime(
        editingTransaction.dateTime 
          ? new Date(editingTransaction.dateTime).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      );
      setPaymentMethod(editingTransaction.paymentMethod || 'UPI');
      setNote(editingTransaction.note || '');
      setReceiptPreview(editingTransaction.receipt || null);
    } else {
      setType('expense');
      setAmount('');
      setCategory(categories[0]?.id || '');
      setDateTime(new Date().toISOString().slice(0, 16));
      setPaymentMethod('UPI');
      setNote('');
      setReceipt(null);
      setReceiptPreview(null);
    }
  }, [editingTransaction, isAddExpenseOpen, categories]);

  if (!isAddExpenseOpen) return null;

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const payload = {
      type,
      amount: Number(amount),
      category: category || categories[0]?.id,
      dateTime: dateTime ? new Date(dateTime).toISOString() : new Date().toISOString(),
      paymentMethod,
      note: note.trim() || (type === 'income' ? 'Income' : 'Expense'),
      receipt: receiptPreview,
    };

    if (editingTransaction) {
      editTransaction(editingTransaction.id, payload);
    } else {
      addTransaction(payload);
    }

    setIsAddExpenseOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-pink-100 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <h2 className="font-serif text-xl font-bold text-[#581C38]">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={() => {
              setIsAddExpenseOpen(false);
              setEditingTransaction(null);
            }}
            className="p-1.5 rounded-full hover:bg-pink-100 text-[#581C38] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type Toggle: Expense / Income */}
          <div className="grid grid-cols-2 p-1 bg-pink-50/80 rounded-2xl border border-pink-100">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-[#581C38] text-white shadow-xs'
                  : 'text-[#6B5561] hover:text-[#581C38]'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#6B5561] hover:text-[#0D9488]'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-[#581C38] mb-1">
              Amount ({currency}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-2.5 bg-pink-50/40 text-base font-bold text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#581C38]/20 focus:border-[#581C38]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#581C38] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-pink-50/40 text-sm font-semibold text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#581C38]/20 focus:border-[#581C38]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-bold text-[#581C38] mb-1">
              Note / Description
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Grocery, Dining, Cab..."
              className="w-full px-3.5 py-2.5 bg-pink-50/40 text-sm font-medium text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#581C38]/20 focus:border-[#581C38]"
            />
          </div>

          {/* Date & Time and Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#581C38] mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-3 py-2 bg-pink-50/40 text-xs font-medium text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#581C38]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#581C38] mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-pink-50/40 text-xs font-medium text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#581C38]/20"
              >
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Cash</option>
                <option>Net Banking</option>
              </select>
            </div>
          </div>

          {/* Receipt Attachment (FR-16) */}
          <div>
            <label className="block text-xs font-bold text-[#581C38] mb-1">
              Attach Receipt (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 px-3 py-2 bg-pink-50 hover:bg-pink-100 text-[#581C38] rounded-xl text-xs font-bold cursor-pointer border border-pink-200 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
              </label>
              {receiptPreview && (
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-pink-200 shadow-xs">
                  <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setReceipt(null); setReceiptPreview(null); }}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-pink-100">
            <button
              type="button"
              onClick={() => {
                setIsAddExpenseOpen(false);
                setEditingTransaction(null);
              }}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-[#6B5561] hover:bg-pink-100/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#581C38] hover:bg-[#43132A] shadow-md transition-all hover:scale-102"
            >
              {editingTransaction ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
