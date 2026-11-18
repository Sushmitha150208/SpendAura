import React, { useState } from 'react';
import { Search, Bell, Menu, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onOpenMobileSidebar }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    unreadNotificationCount, 
    setIsNotificationsOpen, 
    searchQuery, 
    setSearchQuery,
    backendOnline 
  } = useApp();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 bg-[#FCEDF0]/90 backdrop-blur-md">
      {/* Mobile Hamburger & Logo indicator */}
      <div className="flex items-center space-x-3 lg:hidden">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl bg-white/70 shadow-xs text-[#581C38] hover:bg-white"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-serif font-bold text-lg text-[#581C38]">SpendAura</span>
      </div>

      {/* Center/Left Search Bar matching the template */}
      <form 
        onSubmit={handleSearchSubmit}
        className="relative flex-1 max-w-md mx-2 sm:mx-0"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6A78]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, categories..."
            className="w-full pl-11 pr-4 py-2.5 bg-white text-sm text-[#3A0D22] placeholder-[#9D7D8B] rounded-full border border-pink-100/80 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E76F51]/30 focus:border-[#E76F51]/50 transition-all"
          />
        </div>
      </form>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Backend status badge (subtle) */}
        <div 
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/60 border border-pink-100 text-[#7A5B69]"
          title={backendOnline ? "Connected to Django REST API" : "Running in standalone browser mode with localStorage"}
        >
          <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span>{backendOnline ? 'Django API' : 'Local Storage'}</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2.5 rounded-full bg-white hover:bg-pink-50 text-[#581C38] shadow-xs border border-pink-100/60 transition-all hover:scale-105"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#E11D48] rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-2 p-1 rounded-full bg-white hover:bg-pink-50 shadow-xs border border-pink-100/60 transition-all"
          title="Profile & Settings"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#EDE9FE] flex items-center justify-center border border-purple-200">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4 text-[#6B21A8]" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
};
