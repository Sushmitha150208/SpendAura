import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Coins, 
  Palette, 
  Bell, 
  Download, 
  RotateCcw, 
  Check, 
  LogOut,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { resetAllData } = useApp();

  const [name, setName] = useState(user?.name || 'Sushmitha');
  const [email, setEmail] = useState(user?.email || 'sushmitha@spendaura.com');
  const [currency, setCurrency] = useState(user?.currency || '₹');
  const [theme, setTheme] = useState(user?.theme || 'blush-pink');
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      currency,
      theme,
      budgetAlerts,
      goalAlerts,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportJSON = () => {
    const data = {
      user,
      transactions: JSON.parse(localStorage.getItem('spendaura_transactions') || '[]'),
      budgets: JSON.parse(localStorage.getItem('spendaura_budgets') || '[]'),
      goals: JSON.parse(localStorage.getItem('spendaura_goals') || '[]'),
      categories: JSON.parse(localStorage.getItem('spendaura_categories') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SpendAura_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const handleConfirmReset = () => {
    resetAllData();
    setResetModal(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3A0D22]">Profile & Settings</h1>
          <p className="text-xs sm:text-sm text-[#8C6A78]">
            Manage your personal profile, preferences, theme, and data backups.
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-pink-100/70 space-y-6">
          <h2 className="font-bold text-base text-[#3A0D22] flex items-center space-x-2">
            <User className="w-5 h-5 text-[#581C38]" />
            <span>Personal Information</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-100 border-2 border-pink-200 shadow-sm">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-pink-50/40 text-xs font-semibold text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#581C38] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-pink-50/40 text-xs font-semibold text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-pink-100/70 space-y-6">
          <h2 className="font-bold text-base text-[#3A0D22] flex items-center space-x-2">
            <Coins className="w-5 h-5 text-[#581C38]" />
            <span>Currency & Regional Formats</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#581C38] mb-1.5">Primary Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 text-xs font-bold text-[#581C38] rounded-xl border border-pink-200 focus:outline-none cursor-pointer"
              >
                <option value="₹">₹ INR – Indian Rupee (Default, Indian Lakhs/Crores format)</option>
                <option value="$">$ USD – US Dollar</option>
                <option value="€">€ EUR – Euro</option>
                <option value="£">£ GBP – British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#581C38] mb-1.5">Aesthetic Color Palette</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'blush-pink', name: 'Blush Pink (Default)', color: '#FCEDF0' },
                  { id: 'lavender', name: 'Lavender Aura', color: '#F3E8FF' },
                  { id: 'mint', name: 'Mint Breeze', color: '#E0F7F6' },
                  { id: 'cream', name: 'Peach Sunset', color: '#FEF7E6' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id)}
                    className={`p-2 rounded-xl text-[11px] font-bold border flex items-center space-x-2 transition-all ${
                      theme === th.id
                        ? 'border-[#581C38] ring-1 ring-[#581C38] bg-pink-50'
                        : 'border-pink-100 hover:bg-pink-50/50'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full shrink-0 border" style={{ backgroundColor: th.color }} />
                    <span className="truncate">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-pink-100/70 space-y-4">
          <h2 className="font-bold text-base text-[#3A0D22] flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#581C38]" />
            <span>Alerts & Notifications</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50/50 transition-colors cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#3A0D22] block">Budget Limit Warnings</span>
                <span className="text-[11px] text-[#8C6A78]">Notify me when category spending exceeds 80% and 100%</span>
              </div>
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => setBudgetAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#581C38] focus:ring-[#581C38]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50/50 transition-colors cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#3A0D22] block">Savings Goal Milestones</span>
                <span className="text-[11px] text-[#8C6A78]">Celebrate when goals reach 25%, 50%, 75%, and 100%</span>
              </div>
              <input
                type="checkbox"
                checked={goalAlerts}
                onChange={(e) => setGoalAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#581C38] focus:ring-[#581C38]"
              />
            </label>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#581C38] hover:bg-[#43132A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            Save All Preferences
          </button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-pink-100/70 space-y-4">
        <h2 className="font-bold text-base text-[#3A0D22]">Data Management & Backups</h2>
        <p className="text-xs text-[#8C6A78]">
          Export your complete ledger data or reset local data to the original template seed.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#581C38] text-xs font-bold border border-pink-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            onClick={() => setResetModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Mock Template Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3A0D22]">Reset All Local Data?</h3>
            <p className="text-xs text-[#8C6A78] leading-relaxed">
              This will restore all default transactions, budgets, goals, and categories matching the SpendAura UI template. Any custom changes will be overwritten.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setResetModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 text-xs font-bold bg-[#E11D48] text-white rounded-xl shadow-xs"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
