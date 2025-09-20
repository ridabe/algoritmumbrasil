/**
 * Serviço de Contas Bancárias
 * Gerencia operações CRUD para contas, cartões e investimentos no Supabase
 */

import { supabase } from '@/lib/supabase/client';
import type {
  Account,
  CreateAccountData,
  UpdateAccountData,
  FinancialSummary,
  AccountFilters,
  AccountsResponse,
  AccountSort,
  AccountType,
  AccountStatus,
  Currency
} from '@/lib/types/accounts';

/**
 * Classe para gerenciar operações de contas bancárias
 */
export class AccountsService {
  /**
   * Busca todas as contas do usuário autenticado
   */
  static async getAccounts(
    filters?: AccountFilters,
    sort?: AccountSort,
    limit?: number,
    offset?: number
  ): Promise<AccountsResponse> {
    try {
      // Verificar se o usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      // Construir query base
      let query = supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);

      // Aplicar filtros
      if (filters) {
        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters.bank) {
          query = query.ilike('bank', `%${filters.bank}%`);
        }
        if (filters.currency) {
          query = query.eq('currency', filters.currency);
        }
      }

      // Aplicar ordenação
      if (sort) {
        query = query.order(sort.field, { ascending: sort.order === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Aplicar paginação
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data: accounts, error } = await query;

      if (error) {
        throw new Error(`Erro ao buscar contas: ${error.message}`);
      }

      // Calcular resumo financeiro
      const summary = await this.calculateFinancialSummary(user.id);

      return {
        accounts: accounts || [],
        summary,
        total_count: accounts?.length || 0
      };
    } catch (error) {
      console.error('Erro no serviço de contas:', error);
      throw error;
    }
  }

  /**
   * Busca uma conta específica por ID
   */
  static async getAccountById(id: string): Promise<Account | null> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: account, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Conta não encontrada
        }
        throw new Error(`Erro ao buscar conta: ${error.message}`);
      }

      return account;
    } catch (error) {
      console.error('Erro ao buscar conta por ID:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova conta
   */
  static async createAccount(accountData: CreateAccountData): Promise<Account> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const newAccount = {
        ...accountData,
        user_id: user.id,
        currency: accountData.currency || Currency.BRL,
        status: AccountStatus.ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: account, error } = await supabase
        .from('accounts')
        .insert([newAccount])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar conta: ${error.message}`);
      }

      return account;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma conta existente
   */
  static async updateAccount(id: string, updateData: UpdateAccountData): Promise<Account> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const updatedData = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      const { data: account, error } = await supabase
        .from('accounts')
        .update(updatedData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar conta: ${error.message}`);
      }

      return account;
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      throw error;
    }
  }

  /**
   * Exclui uma conta
   */
  static async deleteAccount(id: string): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`Erro ao excluir conta: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      throw error;
    }
  }

  /**
   * Atualiza o saldo de uma conta
   */
  static async updateAccountBalance(id: string, newBalance: number): Promise<Account> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: account, error } = await supabase
        .from('accounts')
        .update({
          balance: newBalance,
          updated_at: new Date().toISOString(),
          last_transaction_date: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar saldo: ${error.message}`);
      }

      return account;
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      throw error;
    }
  }

  /**
   * Calcula o resumo financeiro do usuário
   */
  static async calculateFinancialSummary(userId: string): Promise<FinancialSummary> {
    try {
      const { data: accounts, error } = await supabase
        .from('accounts')
        .select('type, balance, status')
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Erro ao calcular resumo: ${error.message}`);
      }

      const activeAccounts = accounts?.filter(acc => acc.status === AccountStatus.ACTIVE) || [];
      const inactiveAccounts = accounts?.filter(acc => acc.status !== AccountStatus.ACTIVE) || [];

      // Calcular totais por tipo
      const totalChecking = activeAccounts
        .filter(acc => acc.type === AccountType.CHECKING)
        .reduce((sum, acc) => sum + acc.balance, 0);

      const totalSavings = activeAccounts
        .filter(acc => acc.type === AccountType.SAVINGS)
        .reduce((sum, acc) => sum + acc.balance, 0);

      const totalInvestments = activeAccounts
        .filter(acc => acc.type === AccountType.INVESTMENT)
        .reduce((sum, acc) => sum + acc.balance, 0);

      const totalCreditCards = activeAccounts
        .filter(acc => acc.type === AccountType.CREDIT_CARD)
        .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

      // Calcular patrimônio total (excluindo cartões de crédito)
      const totalAssets = activeAccounts
        .filter(acc => acc.type !== AccountType.CREDIT_CARD)
        .reduce((sum, acc) => sum + acc.balance, 0);

      const totalDebts = totalCreditCards;
      const netWorth = totalAssets - totalDebts;

      return {
        total_assets: totalAssets,
        total_debts: totalDebts,
        net_worth: netWorth,
        total_checking: totalChecking,
        total_savings: totalSavings,
        total_investments: totalInvestments,
        total_credit_cards: totalCreditCards,
        active_accounts: activeAccounts.length,
        inactive_accounts: inactiveAccounts.length
      };
    } catch (error) {
      console.error('Erro ao calcular resumo financeiro:', error);
      throw error;
    }
  }

  /**
   * Busca contas por tipo
   */
  static async getAccountsByType(type: AccountType): Promise<Account[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: accounts, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .eq('status', AccountStatus.ACTIVE)
        .order('name');

      if (error) {
        throw new Error(`Erro ao buscar contas por tipo: ${error.message}`);
      }

      return accounts || [];
    } catch (error) {
      console.error('Erro ao buscar contas por tipo:', error);
      throw error;
    }
  }

  /**
   * Ativa ou desativa uma conta
   */
  static async toggleAccountStatus(id: string): Promise<Account> {
    try {
      const account = await this.getAccountById(id);
      if (!account) {
        throw new Error('Conta não encontrada');
      }

      const newStatus = account.status === AccountStatus.ACTIVE 
        ? AccountStatus.INACTIVE 
        : AccountStatus.ACTIVE;

      return await this.updateAccount(id, { status: newStatus });
    } catch (error) {
      console.error('Erro ao alterar status da conta:', error);
      throw error;
    }
  }
}

// Exportar instância padrão
export const accountsService = AccountsService;