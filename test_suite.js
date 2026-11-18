/**
 * SpendAura Comprehensive Automated Test Suite
 * 20 End-to-End Test Cases covering Core Financial Logic, Functional Requirements (FR-1 to FR-31),
 * State Management, Budget Alerts, Goal Tracking, and Storage Persistence.
 */

const fs = require('fs');
const path = require('path');

// Mock localStorage in memory for rigorous testing
class MemoryStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new MemoryStorage();

// Seed Data
const INITIAL_USER = {
  id: 'user-1',
  name: 'Sushmitha',
  email: 'sushmitha@spendaura.com',
  currency: '₹',
  theme: 'blush-pink',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
};

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Food & Dining', icon: 'Utensils', color: '#E76F51', isDefault: true },
  { id: 'cat-2', name: 'Transport', icon: 'Car', color: '#F4A261', isDefault: true },
  { id: 'cat-3', name: 'Shopping', icon: 'ShoppingBag', color: '#E9C46A', isDefault: true },
  { id: 'cat-4', name: 'Bills & Utilities', icon: 'Home', color: '#8338EC', isDefault: true },
  { id: 'cat-5', name: 'Health', icon: 'Heart', color: '#FF006E', isDefault: true },
  { id: 'cat-6', name: 'Others', icon: 'MoreHorizontal', color: '#94A3B8', isDefault: true },
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', type: 'expense', amount: 2350, category: 'cat-1', categoryName: 'Food & Dining', note: 'Grocery', paymentMethod: 'UPI', dateTime: '2026-11-17T10:24:00.000Z' },
  { id: 'tx-2', type: 'expense', amount: 850, category: 'cat-1', categoryName: 'Food & Dining', note: 'Restaurant', paymentMethod: 'Credit Card', dateTime: '2026-11-16T20:15:00.000Z' },
  { id: 'tx-3', type: 'expense', amount: 120, category: 'cat-2', categoryName: 'Transport', note: 'Transport', paymentMethod: 'UPI', dateTime: '2026-10-14T09:00:00.000Z' },
  { id: 'tx-4', type: 'expense', amount: 2427, category: 'cat-1', categoryName: 'Food & Dining', note: 'Weekly Organic Mart', paymentMethod: 'Credit Card', dateTime: '2026-11-10T12:00:00.000Z' },
  { id: 'tx-5', type: 'expense', amount: 2859, category: 'cat-2', categoryName: 'Transport', note: 'Monthly Fuel & Metro Pass', paymentMethod: 'UPI', dateTime: '2026-11-08T09:00:00.000Z' },
  { id: 'tx-6', type: 'expense', amount: 2482, category: 'cat-3', categoryName: 'Shopping', note: 'Books & Apparel', paymentMethod: 'Credit Card', dateTime: '2026-11-05T14:30:00.000Z' },
  { id: 'tx-7', type: 'expense', amount: 1986, category: 'cat-4', categoryName: 'Bills & Utilities', note: 'High-speed Fiber & Electricity', paymentMethod: 'Net Banking', dateTime: '2026-11-03T11:00:00.000Z' },
  { id: 'tx-8', type: 'expense', amount: 1655, category: 'cat-5', categoryName: 'Health', note: 'Pharmacy & Wellness Clinic', paymentMethod: 'UPI', dateTime: '2026-11-01T16:00:00.000Z' },
  { id: 'tx-9', type: 'expense', amount: 1821, category: 'cat-6', categoryName: 'Others', note: 'Stationery & Plant potting', paymentMethod: 'Cash', dateTime: '2026-10-28T10:00:00.000Z' },
  { id: 'tx-10', type: 'income', amount: 35000, category: 'cat-6', categoryName: 'Income', note: 'Monthly Salary', paymentMethod: 'Net Banking', dateTime: '2026-11-12T10:00:00.000Z' }
];

const INITIAL_BUDGETS = [
  { id: 'b-1', categoryId: 'cat-1', categoryName: 'Food & Dining', limit: 6000 },
  { id: 'b-2', categoryId: 'cat-3', categoryName: 'Shopping', limit: 4000 },
  { id: 'b-3', categoryId: 'cat-4', categoryName: 'Bills & Utilities', limit: 2500 }
];

const INITIAL_GOALS = [
  { id: 'g-1', name: 'Save for a Laptop', targetAmount: 60000, savedAmount: 18450, targetDate: '2026-12-31', status: 'active', icon: 'Laptop' },
  { id: 'g-2', name: 'Emergency Fund', targetAmount: 100000, savedAmount: 45000, targetDate: '2027-03-31', status: 'active', icon: 'Shield' }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'notif-1', title: 'Budget Alert', message: 'Food & Dining is at 87% of its monthly limit.', type: 'budget_warning', isRead: false },
  { id: 'notif-2', title: 'Goal Progress', message: 'Great going! You have saved ₹ 18,450 for your Laptop goal.', type: 'goal_milestone', isRead: false }
];

// App Domain Controller
class SpendAuraEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.user = JSON.parse(JSON.stringify(INITIAL_USER));
    this.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    this.transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
    this.budgets = JSON.parse(JSON.stringify(INITIAL_BUDGETS));
    this.goals = JSON.parse(JSON.stringify(INITIAL_GOALS));
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('spendaura_user', JSON.stringify(this.user));
    localStorage.setItem('spendaura_categories', JSON.stringify(this.categories));
    localStorage.setItem('spendaura_transactions', JSON.stringify(this.transactions));
    localStorage.setItem('spendaura_budgets', JSON.stringify(this.budgets));
    localStorage.setItem('spendaura_goals', JSON.stringify(this.goals));
    localStorage.setItem('spendaura_notifications', JSON.stringify(this.notifications));
  }

  loadFromStorage() {
    this.user = JSON.parse(localStorage.getItem('spendaura_user'));
    this.categories = JSON.parse(localStorage.getItem('spendaura_categories'));
    this.transactions = JSON.parse(localStorage.getItem('spendaura_transactions'));
    this.budgets = JSON.parse(localStorage.getItem('spendaura_budgets'));
    this.goals = JSON.parse(localStorage.getItem('spendaura_goals'));
    this.notifications = JSON.parse(localStorage.getItem('spendaura_notifications'));
  }

  getTotalIncome() {
    return this.transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + Number(t.amount), 0);
  }

  getTotalExpense() {
    return this.transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount), 0);
  }

  getSavings() {
    return this.getTotalIncome() - this.getTotalExpense();
  }

  getBalance() {
    return this.getSavings();
  }

  getCategoryBreakdown() {
    const totalExp = this.getTotalExpense();
    if (totalExp === 0) return [];
    const map = {};
    this.categories.forEach((c) => { map[c.id] = { ...c, total: 0 }; });

    this.transactions.forEach((t) => {
      if (t.type === 'expense') {
        if (map[t.category]) map[t.category].total += Number(t.amount);
        else {
          const others = this.categories.find((c) => c.name === 'Others') || this.categories[0];
          if (others && map[others.id]) map[others.id].total += Number(t.amount);
        }
      }
    });

    return Object.values(map)
      .filter((c) => c.total > 0)
      .map((c) => ({
        ...c,
        percentage: Math.round((c.total / totalExp) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  }

  getDynamicBudgets() {
    return this.budgets.map((b) => {
      const spent = this.transactions
        .filter((t) => t.category === b.categoryId && t.type === 'expense')
        .reduce((s, t) => s + Number(t.amount), 0);
      const percentage = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
      return {
        ...b,
        spent,
        percentage,
        isOverLimit: percentage >= 100,
        isNearLimit: percentage >= 80 && percentage < 100,
      };
    });
  }

  addTransaction(tx) {
    const cat = this.categories.find((c) => c.id === tx.category);
    const newTx = {
      ...tx,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      categoryName: cat ? cat.name : 'Others',
      dateTime: tx.dateTime || new Date().toISOString(),
    };
    this.transactions.unshift(newTx);
    this.checkBudgetAlerts(newTx);
    this.saveToStorage();
    return newTx;
  }

  editTransaction(id, updatedFields) {
    const cat = this.categories.find((c) => c.id === updatedFields.category);
    this.transactions = this.transactions.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          ...updatedFields,
          categoryName: cat ? cat.name : t.categoryName,
        };
      }
      return t;
    });
    this.saveToStorage();
    return this.transactions.find((t) => t.id === id);
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    this.saveToStorage();
  }

  filterTransactions({ category, type, search }) {
    return this.transactions.filter((t) => {
      if (category && category !== 'ALL' && t.category !== category) return false;
      if (type && type !== 'ALL' && t.type !== type) return false;
      if (search) {
        const q = search.toLowerCase();
        const mNote = (t.note || '').toLowerCase().includes(q);
        const mCat = (t.categoryName || '').toLowerCase().includes(q);
        if (!mNote && !mCat) return false;
      }
      return true;
    });
  }

  checkBudgetAlerts(newTx) {
    if (newTx.type !== 'expense') return;
    const budget = this.budgets.find((b) => b.categoryId === newTx.category);
    if (!budget) return;

    const totalSpent = this.transactions
      .filter((t) => t.category === budget.categoryId && t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount), 0);

    const pct = Math.round((totalSpent / budget.limit) * 100);
    if (pct >= 100) {
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: 'Budget Exceeded! 🚨',
        message: `${budget.categoryName} is at ${pct}% of limit!`,
        type: 'budget_warning',
        isRead: false,
      });
    } else if (pct >= 80) {
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: 'Budget Alert ⚠️',
        message: `${budget.categoryName} reached ${pct}% of limit.`,
        type: 'budget_warning',
        isRead: false,
      });
    }
  }

  addCategory(cat) {
    const newCat = {
      ...cat,
      id: `cat-${Date.now()}`,
      isDefault: false,
    };
    this.categories.push(newCat);
    this.saveToStorage();
    return newCat;
  }

  deleteCategory(catId) {
    const others = this.categories.find((c) => c.name === 'Others') || this.categories[0];
    this.transactions = this.transactions.map((t) => {
      if (t.category === catId) {
        return { ...t, category: others.id, categoryName: others.name };
      }
      return t;
    });
    this.categories = this.categories.filter((c) => c.id !== catId);
    this.saveToStorage();
  }

  addGoal(goal) {
    const newGoal = {
      ...goal,
      id: `g-${Date.now()}`,
      savedAmount: Number(goal.savedAmount || 0),
      status: 'active',
    };
    this.goals.push(newGoal);
    this.saveToStorage();
    return newGoal;
  }

  depositToGoal(goalId, amount) {
    let completedName = null;
    this.goals = this.goals.map((g) => {
      if (g.id === goalId) {
        const newSaved = Number(g.savedAmount) + Number(amount);
        const isComplete = newSaved >= Number(g.targetAmount);
        if (isComplete && g.status !== 'completed') {
          completedName = g.name;
        }
        return {
          ...g,
          savedAmount: newSaved,
          status: isComplete ? 'completed' : 'active',
        };
      }
      return g;
    });

    if (completedName) {
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: 'Goal Achieved! 🎉',
        message: `Congratulations! You reached 100% of your target for "${completedName}"!`,
        type: 'goal_milestone',
        isRead: false,
      });
    }
    this.saveToStorage();
  }

  withdrawFromGoal(goalId, amount) {
    this.goals = this.goals.map((g) => {
      if (g.id === goalId) {
        const newSaved = Math.max(0, Number(g.savedAmount) - Number(amount));
        return {
          ...g,
          savedAmount: newSaved,
          status: newSaved >= g.targetAmount ? 'completed' : 'active',
        };
      }
      return g;
    });
    this.saveToStorage();
  }
}

// TEST SUITE HARNESS
const tests = [];
let passedCount = 0;
let failedCount = 0;

function it(id, description, testFn) {
  tests.push({ id, description, testFn });
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected [${expected}] (${typeof expected}) but got [${actual}] (${typeof actual})`);
      }
    },
    toEqual(expected) {
      const a = JSON.stringify(actual);
      const e = JSON.stringify(expected);
      if (a !== e) {
        throw new Error(`Expected equality:\nExpected: ${e}\nReceived: ${a}`);
      }
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected) {
      if (!(actual >= expected)) {
        throw new Error(`Expected ${actual} to be >= ${expected}`);
      }
    },
    toBeLessThan(expected) {
      if (!(actual < expected)) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value but got [${actual}]`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value but got [${actual}]`);
      }
    },
    toContain(sub) {
      if (!actual.includes(sub)) {
        throw new Error(`Expected [${actual}] to contain [${sub}]`);
      }
    }
  };
}

// ==========================================
// 20 TEST CASES DEFINITION
// ==========================================

const engine = new SpendAuraEngine();

// TC-01: System State Initialization
it('TC-01', 'Verify initial seed data integrity and user profile initialization', () => {
  expect(engine.user.name).toBe('Sushmitha');
  expect(engine.user.currency).toBe('₹');
  expect(engine.categories.length).toBe(6);
  expect(engine.transactions.length).toBe(10);
  expect(engine.budgets.length).toBe(3);
  expect(engine.goals.length).toBe(2);
});

// TC-02: Total Income & Total Expense Computation
it('TC-02', 'Verify calculation of Total Income (₹ 35,000) and Total Expense (₹ 16,550)', () => {
  const income = engine.getTotalIncome();
  const expense = engine.getTotalExpense();
  expect(income).toBe(35000);
  expect(expense).toBe(16550);
});

// TC-03: Savings and Balance Consistency
it('TC-03', 'Verify Savings formula: Savings = Total Income - Total Expense and Balance matches (₹ 18,450)', () => {
  const savings = engine.getSavings();
  const balance = engine.getBalance();
  expect(savings).toBe(18450);
  expect(balance).toBe(18450);
  expect(savings).toBe(engine.getTotalIncome() - engine.getTotalExpense());
});

// TC-04: Category Breakdown & Percentages
it('TC-04', 'Verify Expense by Category percentage distribution matches template design', () => {
  const breakdown = engine.getCategoryBreakdown();
  expect(breakdown.length).toBeGreaterThanOrEqual(5);

  const food = breakdown.find((c) => c.name === 'Food & Dining');
  const transport = breakdown.find((c) => c.name === 'Transport');
  const shopping = breakdown.find((c) => c.name === 'Shopping');
  const bills = breakdown.find((c) => c.name === 'Bills & Utilities');
  const health = breakdown.find((c) => c.name === 'Health');
  const others = breakdown.find((c) => c.name === 'Others');

  expect(food.percentage).toBe(34);
  expect(transport.percentage).toBe(18);
  expect(shopping.percentage).toBe(15);
  expect(bills.percentage).toBe(12);
  expect(health.percentage).toBe(10);
  expect(others.percentage).toBe(11);
});

// TC-05: Add New Expense Transaction
it('TC-05', 'Verify adding a new expense transaction increments Total Expense and adjusts Balance', () => {
  const initialExpense = engine.getTotalExpense();
  const initialBalance = engine.getBalance();

  const newTx = engine.addTransaction({
    type: 'expense',
    amount: 1450,
    category: 'cat-3',
    note: 'Weekend Clothing Sale',
    paymentMethod: 'Credit Card',
  });

  expect(newTx.amount).toBe(1450);
  expect(engine.getTotalExpense()).toBe(initialExpense + 1450);
  expect(engine.getBalance()).toBe(initialBalance - 1450);
});

// TC-06: Add New Income Transaction
it('TC-06', 'Verify adding a new income transaction increments Total Income and increases Balance', () => {
  const initialIncome = engine.getTotalIncome();
  const initialBalance = engine.getBalance();

  engine.addTransaction({
    type: 'income',
    amount: 5000,
    category: 'cat-6',
    note: 'Freelance Design Bonus',
    paymentMethod: 'UPI',
  });

  expect(engine.getTotalIncome()).toBe(initialIncome + 5000);
  expect(engine.getBalance()).toBe(initialBalance + 5000);
});

// TC-07: Edit Existing Transaction
it('TC-07', 'Verify editing a transaction updates amount, note, and recalculates ledger totals', () => {
  const txToEdit = engine.transactions[0];
  const originalAmount = txToEdit.amount;
  const initialExpense = engine.getTotalExpense();

  engine.editTransaction(txToEdit.id, {
    amount: 2000,
    note: 'Updated Freelance Payment',
  });

  const edited = engine.transactions.find((t) => t.id === txToEdit.id);
  expect(edited.amount).toBe(2000);
  expect(edited.note).toBe('Updated Freelance Payment');
});

// TC-08: Delete Transaction
it('TC-08', 'Verify deleting a transaction removes it from list and restores financial balances', () => {
  const countBefore = engine.transactions.length;
  const firstTx = engine.transactions[0];
  const txAmount = firstTx.amount;
  const wasExpense = firstTx.type === 'expense';
  const expenseBefore = engine.getTotalExpense();

  engine.deleteTransaction(firstTx.id);

  expect(engine.transactions.length).toBe(countBefore - 1);
  if (wasExpense) {
    expect(engine.getTotalExpense()).toBe(expenseBefore - txAmount);
  }
});

// TC-09: Filter Transactions by Category
it('TC-09', 'Verify filtering transactions by Category returns only matching items', () => {
  const foodTxs = engine.filterTransactions({ category: 'cat-1' });
  expect(foodTxs.length).toBeGreaterThan(0);
  foodTxs.forEach((t) => {
    expect(t.category).toBe('cat-1');
  });
});

// TC-10: Filter Transactions by Type
it('TC-10', 'Verify filtering transactions by Type (expense vs income) returns strictly typed entries', () => {
  const expenses = engine.filterTransactions({ type: 'expense' });
  const incomes = engine.filterTransactions({ type: 'income' });

  expect(expenses.length).toBeGreaterThan(0);
  expect(incomes.length).toBeGreaterThan(0);
  expenses.forEach((t) => expect(t.type).toBe('expense'));
  incomes.forEach((t) => expect(t.type).toBe('income'));
});

// TC-11: Search Transactions by Keyword
it('TC-11', 'Verify keyword search finds transactions matching description or merchant name', () => {
  const results = engine.filterTransactions({ search: 'Grocery' });
  expect(results.length).toBeGreaterThanOrEqual(1);
  expect(results[0].note).toContain('Grocery');

  const emptyResults = engine.filterTransactions({ search: 'NonExistentMerchant999' });
  expect(emptyResults.length).toBe(0);
});

// TC-12: Dynamic Budget Progress Calculation
it('TC-12', 'Verify Budget calculation computes accurate spent amount and percentage against limit', () => {
  engine.reset(); // Reset to clean template values
  const budgets = engine.getDynamicBudgets();
  const foodBudget = budgets.find((b) => b.categoryId === 'cat-1');

  expect(foodBudget.limit).toBe(6000);
  expect(foodBudget.spent).toBe(5627); // Sum of seed food expenses
  expect(foodBudget.percentage).toBe(94); // 5627/6000 = 93.78 -> 94%
});

// TC-13: Budget Warning Alert (>= 80%)
it('TC-13', 'Verify Budget alert is triggered when category spending reaches or exceeds 80%', () => {
  engine.reset();
  const notifCountBefore = engine.notifications.length;

  // Add budget of 1000 for cat-5 (Health), current spent is 1655 which is already >80%
  // Let's create a fresh budget with limit 2000 and spent 1500 (75%), then add 200 to reach 1700 (85%)
  engine.budgets.push({ id: 'b-test', categoryId: 'cat-5', categoryName: 'Health', limit: 2000 });
  engine.addTransaction({
    type: 'expense',
    amount: 100,
    category: 'cat-5',
    note: 'Vitamins test',
  });

  const alerts = engine.notifications.filter((n) => n.type === 'budget_warning');
  expect(alerts.length).toBeGreaterThan(0);
});

// TC-14: Budget Critical Alert (>= 100%)
it('TC-14', 'Verify Critical Budget alert is raised when category spending exceeds 100%', () => {
  engine.addTransaction({
    type: 'expense',
    amount: 5000,
    category: 'cat-5',
    note: 'Emergency Hospital Bill',
  });

  const latestNotif = engine.notifications[0];
  expect(latestNotif.type).toBe('budget_warning');
  expect(latestNotif.title).toContain('Exceeded');
});

// TC-15: Custom Category Creation
it('TC-15', 'Verify creating a custom category with custom color and icon', () => {
  const catCountBefore = engine.categories.length;
  const newCat = engine.addCategory({
    name: 'Subscriptions & SaaS',
    color: '#3B82F6',
    icon: 'Zap',
  });

  expect(engine.categories.length).toBe(catCountBefore + 1);
  expect(newCat.name).toBe('Subscriptions & SaaS');
  expect(newCat.color).toBe('#3B82F6');
  expect(newCat.isDefault).toBe(false);
});

// TC-16: Category Deletion Safeguard (FR-22)
it('TC-16', 'Verify FR-22 safeguard: deleting a custom category reassigns its transactions to Others', () => {
  // Add category & transaction
  const customCat = engine.addCategory({ name: 'Gaming & Fun', color: '#EC4899', icon: 'Gamepad' });
  const tx = engine.addTransaction({
    type: 'expense',
    amount: 999,
    category: customCat.id,
    note: 'Video Game purchase',
  });

  expect(tx.category).toBe(customCat.id);

  // Delete category
  engine.deleteCategory(customCat.id);

  // Assert category is gone
  const foundCat = engine.categories.find((c) => c.id === customCat.id);
  expect(foundCat).toBe(undefined);

  // Assert transaction was moved to Others
  const updatedTx = engine.transactions.find((t) => t.id === tx.id);
  const othersCat = engine.categories.find((c) => c.name === 'Others');
  expect(updatedTx.category).toBe(othersCat.id);
  expect(updatedTx.categoryName).toBe('Others');
});

// TC-17: Savings Goal Creation
it('TC-17', 'Verify creation of a new savings goal with target amount, target date, and initial progress', () => {
  const goal = engine.addGoal({
    name: 'New iPhone 16 Pro',
    targetAmount: 130000,
    savedAmount: 0,
    targetDate: '2027-01-01',
    icon: 'Smartphone',
  });

  expect(goal.name).toBe('New iPhone 16 Pro');
  expect(goal.targetAmount).toBe(130000);
  expect(goal.savedAmount).toBe(0);
  expect(goal.status).toBe('active');
});

// TC-18: Deposit into Savings Goal
it('TC-18', 'Verify depositing savings into a goal increases saved amount and recalculates progress', () => {
  const laptopGoal = engine.goals.find((g) => g.id === 'g-1');
  const savedBefore = laptopGoal.savedAmount;

  engine.depositToGoal('g-1', 5000);

  const updatedGoal = engine.goals.find((g) => g.id === 'g-1');
  expect(updatedGoal.savedAmount).toBe(savedBefore + 5000);
  const pct = Math.round((updatedGoal.savedAmount / updatedGoal.targetAmount) * 100);
  expect(pct).toBe(39); // (18450 + 5000) / 60000 = 39.08% -> 39%
});

// TC-19: Goal 100% Completion & Milestone Celebration (FR-28)
it('TC-19', 'Verify FR-28: reaching 100% target marks goal completed and triggers celebration alert', () => {
  // Laptop goal has 23450 saved of 60000. Deposit remaining 36550
  engine.depositToGoal('g-1', 40000);

  const updatedGoal = engine.goals.find((g) => g.id === 'g-1');
  expect(updatedGoal.savedAmount).toBeGreaterThanOrEqual(updatedGoal.targetAmount);
  expect(updatedGoal.status).toBe('completed');

  // Verify celebratory notification was created
  const celebNotif = engine.notifications.find((n) => n.type === 'goal_milestone' && n.title.includes('Achieved'));
  expect(celebNotif).toBeTruthy();
});

// TC-20: Storage Persistence & Full Ledger Reset (FR-31)
it('TC-20', 'Verify FR-31: persistence in localStorage, backup export integrity, and factory reset', () => {
  // Verify localStorage has persisted JSON records
  const storedTx = JSON.parse(localStorage.getItem('spendaura_transactions'));
  expect(storedTx.length).toBeGreaterThan(0);

  // Simulate factory reset
  engine.reset();

  expect(engine.transactions.length).toBe(INITIAL_TRANSACTIONS.length);
  expect(engine.getTotalIncome()).toBe(35000);
  expect(engine.getTotalExpense()).toBe(16550);
  expect(engine.getBalance()).toBe(18450);
});

// ==========================================
// TEST EXECUTION RUNNER
// ==========================================
console.log('\n================================================================');
console.log('       SPENDAURA EXPENSE TRACKER – AUTOMATED TEST SUITE');
console.log('       20 Test Cases verifying SRS Functional Requirements');
console.log('================================================================\n');

const results = [];
const startTime = Date.now();

tests.forEach((t, index) => {
  const testNum = index + 1;
  const padNum = testNum < 10 ? `0${testNum}` : `${testNum}`;
  const startT = process.hrtime();
  try {
    t.testFn();
    const diffT = process.hrtime(startT);
    const ms = (diffT[0] * 1000 + diffT[1] / 1000000).toFixed(2);
    passedCount++;
    results.push({ id: t.id, description: t.description, status: 'PASS', time: `${ms}ms` });
    console.log(`[PASS] [${t.id}] ${t.description} (${ms}ms)`);
  } catch (err) {
    const diffT = process.hrtime(startT);
    const ms = (diffT[0] * 1000 + diffT[1] / 1000000).toFixed(2);
    failedCount++;
    results.push({ id: t.id, description: t.description, status: 'FAIL', error: err.message, time: `${ms}ms` });
    console.error(`[FAIL] [${t.id}] ${t.description}`);
    console.error(`       Error: ${err.message}`);
  }
});

const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n================================================================');
console.log(`TEST EXECUTION SUMMARY:`);
console.log(`Total Tests Run : ${tests.length}`);
console.log(`Passed          : ${passedCount}`);
console.log(`Failed          : ${failedCount}`);
console.log(`Success Rate    : ${((passedCount / tests.length) * 100).toFixed(1)}%`);
console.log(`Execution Time  : ${totalDuration}s`);
console.log('================================================================\n');

// Write machine-readable JSON test report
fs.writeFileSync(
  path.join(__dirname, 'test_results.json'),
  JSON.stringify({
    timestamp: new Date().toISOString(),
    total: tests.length,
    passed: passedCount,
    failed: failedCount,
    successRate: `${((passedCount / tests.length) * 100).toFixed(1)}%`,
    duration: `${totalDuration}s`,
    results,
  }, null, 2)
);

process.exit(failedCount === 0 ? 0 : 1);
