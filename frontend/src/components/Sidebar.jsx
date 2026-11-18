import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ArrowLeftRight, 
  Wallet, 
  LayoutGrid, 
  BarChart3, 
  Target,
  X
} from 'lucide-react';
import { SpendAuraLogoIcon, PlantVaseSidebarIllustration } from './Illustrations';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { name: 'Budgets', path: '/budgets', icon: Wallet },
    { name: 'Categories', path: '/categories', icon: LayoutGrid },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Goals', path: '/goals', icon: Target },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#FCEDF0] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } border-r border-[#F5D5DE]/70`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="flex items-center justify-between px-7 pt-7 pb-6">
            <div className="flex items-center space-x-3">
              <SpendAuraLogoIcon className="w-10 h-10" />
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#581C38] tracking-tight leading-none">
                  SpendAura
                </h1>
                <span className="text-xs text-[#8C4A67] font-medium tracking-wide">
                  Expense Tracker
                </span>
              </div>
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-full hover:bg-pink-100 text-[#581C38]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-5 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#FCE7EE] text-[#581C38] shadow-xs translate-x-1'
                        : 'text-[#6B5561] hover:text-[#581C38] hover:bg-[#FEEBF0]/70'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#581C38]' : 'text-[#7D6672]'}`} strokeWidth={isActive ? 2.4 : 2} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Decorative Vase Illustration */}
        <div className="px-4 pb-2">
          <PlantVaseSidebarIllustration />
        </div>
      </aside>
    </>
  );
};
