import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState(() => StorageService.getCategories());
  const [transactions, setTransactions] = useState(() => StorageService.getTransactions());
  const [budgets, setBudgets] = useState(() => StorageService.getBudgets());
  const [goals, setGoals] = useState(() => StorageService.getGoals());
  const [notifications, setNotifications] = useState(() => StorageService.getNotifications());
  const [backendOnline, setBackendOnline] = useState(false);

  // Modals & UI States
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardTimeFilter, setDashboardTimeFilter] = useState('This Month');
  const [monthlyOverviewFilter, setMonthlyOverviewFilter] = useState('Last 6 Months');

  // Currency
  const currency = user?.currency || '₹';

  // Check backend health periodically
  useEffect(() => {
    ApiService.checkBackendHealth().then((isOnline) => setBackendOnline(isOnline));
  }, []);

  // Sync state with storage
  const refreshData = () => {
    setCategories(StorageService.getCategories());
    setTransactions(StorageService.getTransactions());
    setBudgets(StorageService.getBudgets());
    setGoals(StorageService.getGoals());
    setNotifications(StorageService.getNotifications());
  };

  // Summary Computations
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const savings = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  const totalBalance = useMemo(() => {
    return savings;
  }, [savings]);

  // Expenses grouped by Category with calculated percentages
  const categoryStats = useMemo(() => {
    if (totalExpense === 0) return [];
    
    // Group expenses by category
    const map = {};
    categories.forEach((c) => {
      map[c.id] = { ...c, total: 0 };
    });

    transactions.forEach((t) => {
      if (t.type === 'expense') {
        if (!map[t.category]) {
          const others = categories.find((c) => c.name === 'Others') || categories[0];
          if (others && map[others.id]) {
            map[others.id].total += Number(t.amount);
          }
        } else {
          map[t.category].total += Number(t.amount);
        }
      }
    });

    return Object.values(map)
      .filter((c) => c.total > 0)
      .map((c) => ({
        ...c,
        percentage: Math.round((c.total / totalExpense) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  }, [categories, transactions, totalExpense]);

  // Dynamic budget progress
  const dynamicBudgets = useMemo(() => {
    return budgets.map((b) => {
      const catSpent = transactions
        .filter((t) => t.category === b.categoryId && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const percentage = b.limit > 0 ? Math.round((catSpent / b.limit) * 100) : 0;
      return {
        ...b,
        spent: catSpent,
        percentage,
      };
    });
  }, [budgets, transactions]);

  // Active goal (first active)
  const activeGoal = useMemo(() => {
    return goals.find((g) => g.status === 'active') || goals[0];
  }, [goals]);

  // Recent 3 transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
      .slice(0, 3);
  }, [transactions]);

  // Unread notification count
  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Action handlers
  const handleAddTransaction = (txData) => {
    const cat = categories.find((c) => c.id === txData.category);
    const newTx = StorageService.addTransaction({
      ...txData,
      categoryName: cat ? cat.name : 'Others',
    });
    refreshData();
    return newTx;
  };

  const handleEditTransaction = (id, updatedData) => {
    const cat = categories.find((c) => c.id === updatedData.category);
    const updated = StorageService.updateTransaction(id, {
      ...updatedData,
      categoryName: cat ? cat.name : updatedData.categoryName,
    });
    refreshData();
    return updated;
  };

  const handleDeleteTransaction = (id) => {
    StorageService.deleteTransaction(id);
    refreshData();
  };

  const handleAddCategory = (catData) => {
    const newCat = StorageService.addCategory(catData);
    refreshData();
    return newCat;
  };

  const handleDeleteCategory = (id) => {
    StorageService.deleteCategory(id);
    refreshData();
  };

  const handleAddOrUpdateBudget = (budgetData) => {
    const cat = categories.find((c) => c.id === budgetData.categoryId);
    StorageService.addOrUpdateBudget({
      ...budgetData,
      categoryName: cat ? cat.name : 'Category',
      categoryIcon: cat ? cat.icon : 'Tag',
      categoryColor: cat ? cat.color : '#581C38',
    });
    refreshData();
  };

  const handleAddGoal = (goalData) => {
    const newGoal = StorageService.addGoal(goalData);
    refreshData();
    return newGoal;
  };

  const handleGoalDeposit = (goalId, amount) => {
    StorageService.updateGoalSavedAmount(goalId, amount);
    refreshData();
  };

  const handleGoalWithdraw = (goalId, amount) => {
    StorageService.updateGoalSavedAmount(goalId, -Math.abs(amount));
    refreshData();
  };

  const handleMarkNotifRead = (id) => {
    StorageService.markNotificationAsRead(id);
    refreshData();
  };

  const handleMarkAllNotifsRead = () => {
    StorageService.markAllNotificationsRead();
    refreshData();
  };

  const handleResetData = () => {
    StorageService.resetAllData();
    refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        categories,
        transactions,
        budgets: dynamicBudgets,
        goals,
        notifications,
        unreadNotificationCount,
        backendOnline,
        // Metrics
        totalBalance,
        totalIncome,
        totalExpense,
        savings,
        categoryStats,
        recentTransactions,
        activeGoal,
        // UI states
        dashboardTimeFilter,
        setDashboardTimeFilter,
        monthlyOverviewFilter,
        setMonthlyOverviewFilter,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        editingTransaction,
        setEditingTransaction,
        isNotificationsOpen,
        setIsNotificationsOpen,
        searchQuery,
        setSearchQuery,
        // Actions
        addTransaction: handleAddTransaction,
        editTransaction: handleEditTransaction,
        deleteTransaction: handleDeleteTransaction,
        addCategory: handleAddCategory,
        deleteCategory: handleDeleteCategory,
        saveBudget: handleAddOrUpdateBudget,
        addGoal: handleAddGoal,
        depositToGoal: handleGoalDeposit,
        withdrawFromGoal: handleGoalWithdraw,
        markNotifRead: handleMarkNotifRead,
        markAllNotifsRead: handleMarkAllNotifsRead,
        resetAllData: handleResetData,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
