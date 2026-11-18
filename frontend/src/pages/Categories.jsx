import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Plus, 
  Trash2, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Home, 
  Heart, 
  MoreHorizontal,
  Coffee,
  Plane,
  Gift,
  Film,
  Zap,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const AVAILABLE_ICONS = [
  { name: 'Utensils', icon: Utensils },
  { name: 'Car', icon: Car },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Home', icon: Home },
  { name: 'Heart', icon: Heart },
  { name: 'Coffee', icon: Coffee },
  { name: 'Plane', icon: Plane },
  { name: 'Gift', icon: Gift },
  { name: 'Film', icon: Film },
  { name: 'Zap', icon: Zap },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'MoreHorizontal', icon: MoreHorizontal },
];

const PRESET_COLORS = [
  '#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#264653',
  '#8338EC', '#3A86FF', '#FF006E', '#FB5607', '#581C38',
  '#14B8A6', '#64748B'
];

export const Categories = () => {
  const { categories, addCategory, deleteCategory, transactions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Coffee');
  const [selectedColor, setSelectedColor] = useState('#E76F51');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    addCategory({
      name: catName.trim(),
      icon: selectedIcon,
      color: selectedColor,
    });

    setIsModalOpen(false);
    setCatName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3A0D22]">Expense Categories</h1>
          <p className="text-xs sm:text-sm text-[#8C6A78]">
            Organize your spending into custom colorful groups.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#581C38] hover:bg-[#421229] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          // Count transactions in this category
          const txCount = transactions.filter((t) => t.category === cat.id).length;
          const totalCatSpent = transactions
            .filter((t) => t.category === cat.id && t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-5 shadow-xs border border-pink-100/70 flex items-center justify-between hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  <div
                    className="w-6 h-6 flex items-center justify-center"
                    style={{ color: cat.color }}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-[#3A0D22] text-sm truncate flex items-center space-x-1.5">
                    <span>{cat.name}</span>
                    {cat.isDefault && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-[#8C6A78]">
                        Default
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-[#8C6A78]">
                    {txCount} transactions
                  </span>
                </div>
              </div>

              {/* Actions */}
              {!cat.isDefault && cat.name !== 'Others' && (
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete category (moves items to Others)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#581C38]">Create Category</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Subscriptions, Hobbies..."
                  className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1.5">Choose Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        selectedColor === col ? 'scale-125 ring-2 ring-[#581C38]' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
