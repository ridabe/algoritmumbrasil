/**
 * Hook personalizado para gerenciar transações
 * Fornece estado e operações CRUD para transações financeiras
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { TransactionService } from '@/lib/services/transactions';
import {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
  TransactionFilters,
  TransactionSummary,
  TransactionWithDetails
} from '@/lib/types/transactions';

interface UseTransactionsReturn {
  // Estado
  transactions: TransactionWithDetails[];
  summary: TransactionSummary | null;
  loading: boolean;
  error: string | null;
  
  // Operações CRUD
  createTransaction: (data: CreateTransactionData) => Promise<Transaction | null>;
  updateTransaction: (id: string, data: UpdateTransactionData) => Promise<Transaction | null>;
  deleteTransaction: (id: string) => Promise<boolean>;
  
  // Busca e filtros
  refreshTransactions: () => Promise<void>;
  applyFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;
  
  // Utilitários
  getTransactionById: (id: string) => TransactionWithDetails | undefined;
  searchTransactions: (query: string) => void;
}

/**
 * Hook principal para gerenciar transações
 */
export function useTransactions(
  initialFilters?: TransactionFilters,
  autoLoad: boolean = true
): UseTransactionsReturn {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters || {});

  /**
   * Carrega transações do servidor
   */
  const loadTransactions = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, summaryData] = await Promise.all([
        TransactionService.getTransactions(user.id, filters),
        TransactionService.getTransactionSummary(user.id, filters)
      ]);
      
      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao carregar transações:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, filters]);

  /**
   * Cria uma nova transação
   */
  const createTransaction = useCallback(async (
    data: CreateTransactionData
  ): Promise<Transaction | null> => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return null;
    }

    try {
      setError(null);
      const newTransaction = await TransactionService.createTransaction(user.id, data);
      
      // Recarregar dados para manter sincronização
      await loadTransactions();
      
      return newTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar transação';
      setError(errorMessage);
      console.error('Erro ao criar transação:', err);
      return null;
    }
  }, [user?.id, loadTransactions]);

  /**
   * Atualiza uma transação existente
   */
  const updateTransaction = useCallback(async (
    id: string,
    data: UpdateTransactionData
  ): Promise<Transaction | null> => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return null;
    }

    try {
      setError(null);
      const updatedTransaction = await TransactionService.updateTransaction(id, user.id, data);
      
      // Recarregar dados para manter sincronização
      await loadTransactions();
      
      return updatedTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar transação';
      setError(errorMessage);
      console.error('Erro ao atualizar transação:', err);
      return null;
    }
  }, [user?.id, loadTransactions]);

  /**
   * Exclui uma transação
   */
  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      setError(null);
      await TransactionService.deleteTransaction(id, user.id);
      
      // Recarregar dados para manter sincronização
      await loadTransactions();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir transação';
      setError(errorMessage);
      console.error('Erro ao excluir transação:', err);
      return false;
    }
  }, [user?.id, loadTransactions]);

  /**
   * Atualiza os filtros e recarrega as transações
   */
  const applyFilters = useCallback((newFilters: TransactionFilters) => {
    setFilters(newFilters);
  }, []);

  /**
   * Limpa todos os filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Força o recarregamento das transações
   */
  const refreshTransactions = useCallback(async () => {
    await loadTransactions();
  }, [loadTransactions]);

  /**
   * Busca uma transação específica por ID
   */
  const getTransactionById = useCallback((id: string): TransactionWithDetails | undefined => {
    return transactions.find(transaction => transaction.id === id);
  }, [transactions]);

  /**
   * Busca transações por texto
   */
  const searchTransactions = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  }, []);

  // Carregar transações quando o usuário ou filtros mudarem
  useEffect(() => {
    if (autoLoad && user?.id) {
      loadTransactions();
    }
  }, [autoLoad, user?.id, loadTransactions]);

  return {
    // Estado
    transactions,
    summary,
    loading,
    error,
    
    // Operações CRUD
    createTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Busca e filtros
    refreshTransactions,
    applyFilters,
    clearFilters,
    
    // Utilitários
    getTransactionById,
    searchTransactions
  };
}

/**
 * Hook simplificado para buscar apenas o resumo de transações
 */
export function useTransactionsSummary(
  filters?: TransactionFilters
): {
  summary: TransactionSummary | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const { user } = useAuth();
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const summaryData = await TransactionService.getTransactionSummary(user.id, filters);
      setSummary(summaryData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar resumo';
      setError(errorMessage);
      console.error('Erro ao carregar resumo:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, filters]);

  useEffect(() => {
    if (user?.id) {
      loadSummary();
    }
  }, [user?.id, loadSummary]);

  return {
    summary,
    loading,
    error,
    refresh: loadSummary
  };
}

/**
 * Hook para buscar transações de uma categoria específica
 */
export function useTransactionsByCategory(
  categoryId: string,
  limit?: number
): {
  transactions: TransactionWithDetails[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!user?.id || !categoryId) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await TransactionService.getTransactionsByCategory(user.id, categoryId, limit);
      setTransactions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao carregar transações por categoria:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, categoryId, limit]);

  useEffect(() => {
    if (user?.id && categoryId) {
      loadTransactions();
    }
  }, [user?.id, categoryId, loadTransactions]);

  return {
    transactions,
    loading,
    error,
    refresh: loadTransactions
  };
}

/**
 * Hook para buscar transações de uma conta específica
 */
export function useTransactionsByAccount(
  accountId: string,
  limit?: number
): {
  transactions: TransactionWithDetails[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!user?.id || !accountId) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await TransactionService.getTransactionsByAccount(user.id, accountId, limit);
      setTransactions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      console.error('Erro ao carregar transações por conta:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, accountId, limit]);

  useEffect(() => {
    if (user?.id && accountId) {
      loadTransactions();
    }
  }, [user?.id, accountId, loadTransactions]);

  return {
    transactions,
    loading,
    error,
    refresh: loadTransactions
  };
}