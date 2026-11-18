/**
 * SpendAura localStorage Service Layer
 * Complies with Section 2.1 & 3 of the SRS for Phase 1
 */

import {
  INITIAL_USER,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS,
} from './seedData';

const STORAGE_KEYS = {
  USER: 'spendaura_user',
  CATEGORIES: 'spendaura_categories',
  TRANSACTIONS: 'spendaura_transactions',
  BUDGETS: 'spendaura_budgets',
  GOALS: 'spendaura_goals',
  NOTIFICATIONS: 'spendaura_notifications',
};

function safeGet(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultVal;
  }
}

function safeSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  // User
  getUser() {
    return safeGet(STORAGE_KEYS.USER, INITIAL_USER);
  },
  saveUser(user) {
    safeSet(STORAGE_KEYS.USER, user);
    return user;
  },

  // Categories
  getCategories() {
    return safeGet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  saveCategories(categories) {
    safeSet(STORAGE_KEYS.CATEGORIES, categories);
    return categories;
  },
  addCategory(category) {
    const categories = this.getCategories();
    const newCat = {
      ...category,
      id: `cat-${Date.now()}`,
      isDefault: false,
    };
    const updated = [...categories, newCat];
    this.saveCategories(updated);
    return newCat;
  },
  deleteCategory(catId) {
    // Reassign transactions to 'Others' category (FR-22)
    const categories = this.getCategories();
    const othersCat = categories.find((c) => c.name === 'Others') || categories[0];
    
    const transactions = this.getTransactions().map((t) => {
      if (t.category === catId) {
        return { ...t, category: othersCat.id, categoryName: othersCat.name };
      }
      return t;
    });
    this.saveTransactions(transactions);

    const filtered = categories.filter((c) => c.id !== catId);
    this.saveCategories(filtered);
    return filtered;
  },

  // Transactions
  getTransactions() {
    return safeGet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  },
  saveTransactions(transactions) {
    safeSet(STORAGE_KEYS.TRANSACTIONS, transactions);
    return transactions;
  },
  addTransaction(tx) {
    const transactions = this.getTransactions();
    const newTx = {
      ...tx,
      id: `tx-${Date.now()}`,
      dateTime: tx.dateTime || new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    this.saveTransactions(updated);
    this.checkBudgetAlerts(newTx);
    return newTx;
  },
  updateTransaction(id, updatedFields) {
    const transactions = this.getTransactions();
    const updated = transactions.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    this.saveTransactions(updated);
    return updated.find((t) => t.id === id);
  },
  deleteTransaction(id) {
    const transactions = this.getTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    this.saveTransactions(filtered);
    return filtered;
  },

  // Budgets
  getBudgets() {
    return safeGet(STORAGE_KEYS.BUDGETS, INITIAL_BUDGETS);
  },
  saveBudgets(budgets) {
    safeSet(STORAGE_KEYS.BUDGETS, budgets);
    return budgets;
  },
  addOrUpdateBudget(budget) {
    const budgets = this.getBudgets();
    const idx = budgets.findIndex((b) => b.categoryId === budget.categoryId);
    let updated;
    if (idx >= 0) {
      updated = budgets.map((b, i) => (i === idx ? { ...b, ...budget } : b));
    } else {
      updated = [...budgets, { ...budget, id: `b-${Date.now()}` }];
    }
    this.saveBudgets(updated);
    return updated;
  },

  // Goals
  getGoals() {
    return safeGet(STORAGE_KEYS.GOALS, INITIAL_GOALS);
  },
  saveGoals(goals) {
    safeSet(STORAGE_KEYS.GOALS, goals);
    return goals;
  },
  addGoal(goal) {
    const goals = this.getGoals();
    const newGoal = {
      ...goal,
      id: `g-${Date.now()}`,
      savedAmount: Number(goal.savedAmount || 0),
      status: 'active',
    };
    const updated = [...goals, newGoal];
    this.saveGoals(updated);
    return newGoal;
  },
  updateGoalSavedAmount(goalId, deltaAmount) {
    const goals = this.getGoals();
    let completedGoalName = null;
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const newSaved = Math.max(0, Number(g.savedAmount) + Number(deltaAmount));
        const isComplete = newSaved >= Number(g.targetAmount);
        if (isComplete && g.status !== 'completed') {
          completedGoalName = g.name;
        }
        return {
          ...g,
          savedAmount: newSaved,
          status: isComplete ? 'completed' : 'active',
        };
      }
      return g;
    });
    this.saveGoals(updated);

    if (completedGoalName) {
      this.addNotification({
        title: 'Goal Achieved! 🎉',
        message: `Congratulations! You reached 100% of your target for "${completedGoalName}"!`,
        type: 'goal_milestone',
      });
    }

    return updated;
  },

  // Notifications
  getNotifications() {
    return safeGet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  saveNotifications(notifs) {
    safeSet(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return notifs;
  },
  addNotification(notif) {
    const notifs = this.getNotifications();
    const newNotif = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNotif, ...notifs];
    this.saveNotifications(updated);
    return newNotif;
  },
  markNotificationAsRead(id) {
    const notifs = this.getNotifications().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.saveNotifications(notifs);
    return notifs;
  },
  markAllNotificationsRead() {
    const notifs = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    this.saveNotifications(notifs);
    return notifs;
  },

  // Budget alert checker (FR-19)
  checkBudgetAlerts(newTx) {
    if (newTx.type !== 'expense') return;
    const budgets = this.getBudgets();
    const budget = budgets.find((b) => b.categoryId === newTx.category);
    if (!budget) return;

    // Calculate current category expense
    const txs = this.getTransactions();
    const totalSpent = txs
      .filter((t) => t.category === budget.categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const pct = Math.round((totalSpent / budget.limit) * 100);
    if (pct >= 100) {
      this.addNotification({
        title: 'Budget Exceeded! 🚨',
        message: `${budget.categoryName} has reached ${pct}% (₹${totalSpent.toLocaleString('en-IN')} of ₹${budget.limit.toLocaleString('en-IN')})!`,
        type: 'budget_warning',
      });
    } else if (pct >= 80) {
      this.addNotification({
        title: 'Budget Alert ⚠️',
        message: `${budget.categoryName} is at ${pct}% of your monthly limit.`,
        type: 'budget_warning',
      });
    }
  },

  // Reset to default seed data
  resetAllData() {
    safeSet(STORAGE_KEYS.USER, INITIAL_USER);
    safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    safeSet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    safeSet(STORAGE_KEYS.BUDGETS, INITIAL_BUDGETS);
    safeSet(STORAGE_KEYS.GOALS, INITIAL_GOALS);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
};
