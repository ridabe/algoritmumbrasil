/**
 * Hook personalizado para gerenciar contas bancárias
 * Fornece estado e operações CRUD para contas com cache e otimizações
 */

import { useState, useEffect, useCallback } from 'react';
import { accountsService } from '@/lib/services/accounts';
import type {
  Account,
  CreateAccountData,
  UpdateAccountData,
  FinancialSummary,
  AccountFilters,
  AccountSort,
  AccountType
} from '@/lib/types/accounts';

interface UseAccountsState {
  accounts: Account[];
  summary: FinancialSummary | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

interface UseAccountsReturn extends UseAccountsState {
  // Operações CRUD
  fetchAccounts: (filters?: AccountFilters, sort?: AccountSort) => Promise<void>;
  createAccount: (data: CreateAccountData) => Promise<Account | null>;
  updateAccount: (id: string, data: UpdateAccountData) => Promise<Account | null>;
  deleteAccount: (id: string) => Promise<boolean>;
  updateBalance: (id: string, balance: number) => Promise<Account | null>;
  toggleStatus: (id: string) => Promise<Account | null>;
  
  // Operações de busca
  getAccountById: (id: string) => Account | undefined;
  getAccountsByType: (type: AccountType) => Account[];
  
  // Utilitários
  refreshData: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook para gerenciar contas bancárias
 */
export function useAccounts(initialFilters?: AccountFilters): UseAccountsReturn {
  const [state, setState] = useState<UseAccountsState>({
    accounts: [],
    summary: null,
    loading: false,
    error: null,
    totalCount: 0
  });

  /**
   * Atualiza o estado de forma segura
   */
  const updateState = useCallback((updates: Partial<UseAccountsState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Limpa erros
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Busca contas com filtros e ordenação
   */
  const fetchAccounts = useCallback(async (
    filters?: AccountFilters,
    sort?: AccountSort
  ) => {
    try {
      updateState({ loading: true, error: null });
      
      const response = await accountsService.getAccounts(filters, sort);
      
      updateState({
        accounts: response.accounts,
        summary: response.summary,
        totalCount: response.total_count,
        loading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar contas';
      updateState({
        loading: false,
        error: errorMessage
      });
    }
  }, [updateState]);

  /**
   * Cria uma nova conta
   */
  const createAccount = useCallback(async (data: CreateAccountData): Promise<Account | null> => {
    try {
      updateState({ loading: true, error: null });
      
      const newAccount = await accountsService.createAccount(data);
      
      // Atualizar lista local
      updateState({
        accounts: [...state.accounts, newAccount],
        loading: false
      });
      
      // Recalcular resumo
      await refreshData();
      
      return newAccount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      updateState({
        loading: false,
        error: errorMessage
      });
      return null;
    }
  }, [state.accounts, updateState]);

  /**
   * Atualiza uma conta existente
   */
  const updateAccount = useCallback(async (
    id: string,
    data: UpdateAccountData
  ): Promise<Account | null> => {
    try {
      updateState({ loading: true, error: null });
      
      const updatedAccount = await accountsService.updateAccount(id, data);
      
      // Atualizar lista local
      const updatedAccounts = state.accounts.map(account =>
        account.id === id ? updatedAccount : account
      );
      
      updateState({
        accounts: updatedAccounts,
        loading: false
      });
      
      // Recalcular resumo se necessário
      if (data.balance !== undefined) {
        await refreshData();
      }
      
      return updatedAccount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar conta';
      updateState({
        loading: false,
        error: errorMessage
      });
      return null;
    }
  }, [state.accounts, updateState]);

  /**
   * Exclui uma conta
   */
  const deleteAccount = useCallback(async (id: string): Promise<boolean> => {
    try {
      updateState({ loading: true, error: null });
      
      await accountsService.deleteAccount(id);
      
      // Remover da lista local
      const filteredAccounts = state.accounts.filter(account => account.id !== id);
      
      updateState({
        accounts: filteredAccounts,
        totalCount: state.totalCount - 1,
        loading: false
      });
      
      // Recalcular resumo
      await refreshData();
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir conta';
      updateState({
        loading: false,
        error: errorMessage
      });
      return false;
    }
  }, [state.accounts, state.totalCount, updateState]);

  /**
   * Atualiza o saldo de uma conta
   */
  const updateBalance = useCallback(async (
    id: string,
    balance: number
  ): Promise<Account | null> => {
    try {
      updateState({ loading: true, error: null });
      
      const updatedAccount = await accountsService.updateAccountBalance(id, balance);
      
      // Atualizar lista local
      const updatedAccounts = state.accounts.map(account =>
        account.id === id ? updatedAccount : account
      );
      
      updateState({
        accounts: updatedAccounts,
        loading: false
      });
      
      // Recalcular resumo
      await refreshData();
      
      return updatedAccount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar saldo';
      updateState({
        loading: false,
        error: errorMessage
      });
      return null;
    }
  }, [state.accounts, updateState]);

  /**
   * Alterna o status de uma conta (ativa/inativa)
   */
  const toggleStatus = useCallback(async (id: string): Promise<Account | null> => {
    try {
      updateState({ loading: true, error: null });
      
      const updatedAccount = await accountsService.toggleAccountStatus(id);
      
      // Atualizar lista local
      const updatedAccounts = state.accounts.map(account =>
        account.id === id ? updatedAccount : account
      );
      
      updateState({
        accounts: updatedAccounts,
        loading: false
      });
      
      // Recalcular resumo
      await refreshData();
      
      return updatedAccount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar status';
      updateState({
        loading: false,
        error: errorMessage
      });
      return null;
    }
  }, [state.accounts, updateState]);

  /**
   * Busca uma conta por ID na lista local
   */
  const getAccountById = useCallback((id: string): Account | undefined => {
    return state.accounts.find(account => account.id === id);
  }, [state.accounts]);

  /**
   * Filtra contas por tipo
   */
  const getAccountsByType = useCallback((type: AccountType): Account[] => {
    return state.accounts.filter(account => account.type === type);
  }, [state.accounts]);

  /**
   * Recarrega todos os dados
   */
  const refreshData = useCallback(async () => {
    await fetchAccounts(initialFilters);
  }, [fetchAccounts, initialFilters]);

  /**
   * Carrega dados iniciais
   */
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    // Estado
    accounts: state.accounts,
    summary: state.summary,
    loading: state.loading,
    error: state.error,
    totalCount: state.totalCount,
    
    // Operações CRUD
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    updateBalance,
    toggleStatus,
    
    // Operações de busca
    getAccountById,
    getAccountsByType,
    
    // Utilitários
    refreshData,
    clearError
  };
}

/**
 * Hook simplificado para buscar apenas o resumo financeiro
 */
export function useFinancialSummary() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar apenas o resumo através do serviço
      const response = await accountsService.getAccounts();
      setSummary(response.summary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar resumo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary
  };
}