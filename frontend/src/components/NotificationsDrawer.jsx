import React from 'react';
import { X, CheckCheck, AlertTriangle, Target, Bell, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatFriendlyDate } from '../utils/formatters';

const getNotifIcon = (type) => {
  if (type === 'budget_warning') {
    return { icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-700' };
  }
  if (type === 'goal_milestone') {
    return { icon: Target, bg: 'bg-emerald-100', color: 'text-emerald-700' };
  }
  if (type === 'reminder') {
    return { icon: Calendar, bg: 'bg-blue-100', color: 'text-blue-700' };
  }
  return { icon: Bell, bg: 'bg-purple-100', color: 'text-purple-700' };
};

export const NotificationsDrawer = () => {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications, 
    markNotifRead, 
    markAllNotifsRead 
  } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm h-full bg-white shadow-2xl flex flex-col border-l border-pink-100 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pink-100">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#581C38]" />
            <h2 className="font-serif text-lg font-bold text-[#581C38]">Notifications</h2>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1.5 rounded-full hover:bg-pink-50 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-pink-50/50 border-b border-pink-100 text-xs">
          <span className="font-semibold text-[#8C6A78]">
            {notifications.filter((n) => !n.isRead).length} unread
          </span>
          <button
            onClick={markAllNotifsRead}
            className="font-bold text-[#581C38] hover:text-[#A8325E] flex items-center space-x-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">
              No notifications yet. You're all caught up!
            </div>
          ) : (
            notifications.map((notif) => {
              const { icon: Icon, bg, color } = getNotifIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => markNotifRead(notif.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.isRead
                      ? 'bg-white border-pink-100/60 opacity-75'
                      : 'bg-pink-50/70 border-pink-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#3A0D22]">
                          {notif.title || 'Notification'}
                        </span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                        )}
                      </div>
                      <p className="text-xs text-[#581C38] mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-[#8C6A78] mt-2 block">
                        {formatFriendlyDate(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
