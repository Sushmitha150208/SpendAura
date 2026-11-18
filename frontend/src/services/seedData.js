/**
 * SpendAura Seed Data matching the SRS and UI screenshot
 */

export const INITIAL_USER = {
  id: 'user-1',
  name: 'Sushmitha',
  email: 'sushmitha@spendaura.com',
  currency: '₹',
  theme: 'blush-pink',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
};

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Food & Dining', icon: 'Utensils', color: '#E76F51', isDefault: true },
  { id: 'cat-2', name: 'Transport', icon: 'Car', color: '#F4A261', isDefault: true },
  { id: 'cat-3', name: 'Shopping', icon: 'ShoppingBag', color: '#E9C46A', isDefault: true },
  { id: 'cat-4', name: 'Bills & Utilities', icon: 'Home', color: '#8338EC', isDefault: true },
  { id: 'cat-5', name: 'Health', icon: 'Heart', color: '#FF006E', isDefault: true },
  { id: 'cat-6', name: 'Others', icon: 'MoreHorizontal', color: '#94A3B8', isDefault: true },
];

export const INITIAL_TRANSACTIONS = [
  // Three prominent recent transactions from template
  {
    id: 'tx-1',
    type: 'expense',
    amount: 2350,
    category: 'cat-1',
    categoryName: 'Food & Dining',
    note: 'Grocery',
    paymentMethod: 'UPI',
    dateTime: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // ~1 hr ago today
    receipt: null
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 850,
    category: 'cat-1',
    categoryName: 'Food & Dining',
    note: 'Restaurant',
    paymentMethod: 'Credit Card',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(), // Yesterday evening
    receipt: null
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 120,
    category: 'cat-2',
    categoryName: 'Transport',
    note: 'Transport',
    paymentMethod: 'UPI',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    receipt: null
  },
  // Additional transactions matching category distributions:
  // Food & Dining (total ~5627 = 34%)
  {
    id: 'tx-4',
    type: 'expense',
    amount: 2427,
    category: 'cat-1',
    categoryName: 'Food & Dining',
    note: 'Weekly Organic Mart',
    paymentMethod: 'Credit Card',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    receipt: null
  },
  // Transport (total ~2979 = 18%)
  {
    id: 'tx-5',
    type: 'expense',
    amount: 2859,
    category: 'cat-2',
    categoryName: 'Transport',
    note: 'Monthly Fuel & Metro Pass',
    paymentMethod: 'UPI',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    receipt: null
  },
  // Shopping (total ~2482 = 15%)
  {
    id: 'tx-6',
    type: 'expense',
    amount: 2482,
    category: 'cat-3',
    categoryName: 'Shopping',
    note: 'Books & Apparel',
    paymentMethod: 'Credit Card',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    receipt: null
  },
  // Bills & Utilities (total ~1986 = 12%)
  {
    id: 'tx-7',
    type: 'expense',
    amount: 1986,
    category: 'cat-4',
    categoryName: 'Bills & Utilities',
    note: 'High-speed Fiber & Electricity',
    paymentMethod: 'Net Banking',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    receipt: null
  },
  // Health (total ~1655 = 10%)
  {
    id: 'tx-8',
    type: 'expense',
    amount: 1655,
    category: 'cat-5',
    categoryName: 'Health',
    note: 'Vitamins & Wellness Clinic',
    paymentMethod: 'UPI',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17).toISOString(),
    receipt: null
  },
  // Others (total ~1821 = 11% - adjustment: 1171)
  {
    id: 'tx-9',
    type: 'expense',
    amount: 1821,
    category: 'cat-6',
    categoryName: 'Others',
    note: 'Stationery & Plant potting',
    paymentMethod: 'Cash',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    receipt: null
  },
  // Total Income: ₹ 35,000
  {
    id: 'tx-10',
    type: 'income',
    amount: 35000,
    category: 'cat-6',
    categoryName: 'Income',
    note: 'Monthly Consulting & Salary',
    paymentMethod: 'Net Banking',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    receipt: null
  }
];

export const INITIAL_BUDGETS = [
  {
    id: 'b-1',
    categoryId: 'cat-1',
    categoryName: 'Food & Dining',
    categoryIcon: 'Utensils',
    categoryColor: '#581C38',
    spent: 5200,
    limit: 6000,
    percentage: 87,
    month: 'This Month'
  },
  {
    id: 'b-2',
    categoryId: 'cat-3',
    categoryName: 'Shopping',
    categoryIcon: 'ShoppingBag',
    categoryColor: '#14B8A6',
    spent: 2300,
    limit: 4000,
    percentage: 57,
    month: 'This Month'
  },
  {
    id: 'b-3',
    categoryId: 'cat-4',
    categoryName: 'Bills & Utilities',
    categoryIcon: 'Zap',
    categoryColor: '#F59E0B',
    spent: 1850,
    limit: 2500,
    percentage: 74,
    month: 'This Month'
  }
];

export const INITIAL_GOALS = [
  {
    id: 'g-1',
    name: 'Save for a Laptop',
    targetAmount: 60000,
    savedAmount: 18450,
    targetDate: '2026-12-31',
    status: 'active',
    icon: 'Laptop',
  },
  {
    id: 'g-2',
    name: 'Emergency Fund',
    targetAmount: 100000,
    savedAmount: 45000,
    targetDate: '2027-03-31',
    status: 'active',
    icon: 'Shield',
  },
  {
    id: 'g-3',
    name: 'Goa Vacation',
    targetAmount: 25000,
    savedAmount: 25000,
    targetDate: '2026-11-01',
    status: 'completed',
    icon: 'Palmtree',
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Budget Alert',
    message: 'Food & Dining is at 87% of its monthly limit (₹5,200 of ₹6,000).',
    type: 'budget_warning',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Goal Progress',
    message: 'Great going! You have saved ₹ 18,450 (30.7%) for your Laptop goal.',
    type: 'goal_milestone',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'notif-3',
    title: 'Upcoming Bill',
    message: 'Internet Broadband renewal due in 4 days.',
    type: 'reminder',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  }
];

export const MONTHLY_OVERVIEW_DATA = [
  { month: 'May', income: 30000, expense: 15000 },
  { month: 'Jun', income: 33000, expense: 22000 },
  { month: 'Jul', income: 31000, expense: 19000 },
  { month: 'Aug', income: 36000, expense: 21000 },
  { month: 'Sep', income: 34000, expense: 23000 },
  { month: 'Oct', income: 35000, expense: 16550 },
];
