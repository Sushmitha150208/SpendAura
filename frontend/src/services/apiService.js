/**
 * SpendAura API Service Layer
 * Supports Phase 1 (Local Storage fallback) and Phase 2 (Django REST APIs)
 */

import axios from 'axios';
import { StorageService } from './storageService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('spendaura_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ApiService = {
  // Check if Django backend is available
  async checkBackendHealth() {
    try {
      const res = await api.get('/summary/');
      return res.status === 200;
    } catch {
      return false;
    }
  },

  // Auth
  async login(credentials) {
    try {
      const res = await api.post('/auth/login/', credentials);
      if (res.data.tokens?.access) {
        localStorage.setItem('spendaura_access_token', res.data.tokens.access);
      }
      return { success: true, user: res.data.user };
    } catch {
      // Local fallback
      const user = StorageService.getUser();
      return { success: true, user };
    }
  },

  async register(data) {
    try {
      const res = await api.post('/auth/register/', data);
      return { success: true, user: res.data.user };
    } catch {
      // Local fallback
      const user = { ...StorageService.getUser(), name: data.first_name || data.username, email: data.email };
      StorageService.saveUser(user);
      return { success: true, user };
    }
  },

  // Transactions
  async getTransactions(params = {}) {
    try {
      const res = await api.get('/transactions/', { params });
      return res.data.results || res.data;
    } catch {
      return StorageService.getTransactions();
    }
  },

  async createTransaction(tx) {
    try {
      const res = await api.post('/transactions/', tx);
      return res.data;
    } catch {
      return StorageService.addTransaction(tx);
    }
  },

  async updateTransaction(id, tx) {
    try {
      const res = await api.put(`/transactions/${id}/`, tx);
      return res.data;
    } catch {
      return StorageService.updateTransaction(id, tx);
    }
  },

  async deleteTransaction(id) {
    try {
      await api.delete(`/transactions/${id}/`);
      return true;
    } catch {
      StorageService.deleteTransaction(id);
      return true;
    }
  },

  // Categories
  async getCategories() {
    try {
      const res = await api.get('/categories/');
      return res.data.results || res.data;
    } catch {
      return StorageService.getCategories();
    }
  },

  // Budgets
  async getBudgets() {
    try {
      const res = await api.get('/budgets/');
      return res.data.results || res.data;
    } catch {
      return StorageService.getBudgets();
    }
  },

  // Goals
  async getGoals() {
    try {
      const res = await api.get('/goals/');
      return res.data.results || res.data;
    } catch {
      return StorageService.getGoals();
    }
  },
};
