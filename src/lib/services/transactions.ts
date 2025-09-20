/**
 * Serviço de Transações
 * Gerencia operações CRUD para transações financeiras no Supabase
 */

import { createClient } from '@/lib/supabase/client';
import {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
  TransactionFilters,
  TransactionSummary,
  TransactionWithDetails,
  TransactionType,
  TransactionStatus
} from '@/lib/types/transactions';

const supabase = createClient();

/**
 * Classe para gerenciar operações de transações
 */
export class TransactionService {
  /**
   * Busca todas as transações do usuário com filtros opcionais
   */
  static async getTransactions(
    userId: string,
    filters?: TransactionFilters,
    limit?: number,
    offset?: number
  ): Promise<TransactionWithDetails[]> {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      // Aplicar filtros
      if (filters) {
        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters.account_id) {
          query = query.eq('account_id', filters.account_id);
        }
        if (filters.category_id) {
          query = query.eq('category_id', filters.category_id);
        }
        if (filters.payment_method) {
          query = query.eq('payment_method', filters.payment_method);
        }
        if (filters.date_from) {
          query = query.gte('date', filters.date_from);
        }
        if (filters.date_to) {
          query = query.lte('date', filters.date_to);
        }
        if (filters.amount_min) {
          query = query.gte('amount', filters.amount_min);
        }
        if (filters.amount_max) {
          query = query.lte('amount', filters.amount_max);
        }
        if (filters.search) {
          query = query.or(`description.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
        }
        if (filters.is_recurring !== undefined) {
          query = query.eq('is_recurring', filters.is_recurring);
        }
      }

      // Aplicar paginação
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar transações:', error);
        throw new Error('Falha ao carregar transações');
      }

      // Mapear dados para o formato esperado
      return data.map(transaction => {
        let parsedTags = [];
        try {
          parsedTags = transaction.tags && transaction.tags.trim() !== '' ? JSON.parse(transaction.tags) : [];
        } catch (parseError) {
          console.warn('Erro ao fazer parse das tags da transação:', transaction.id, parseError);
          parsedTags = [];
        }
        
        return {
          ...transaction,
          transaction_date: transaction.date, // Mapear date para transaction_date
          tags: parsedTags
        };
      });
    } catch (error) {
      console.error('Erro no serviço de transações:', error);
      throw error;
    }
  }

  /**
   * Busca uma transação específica por ID
   */
  static async getTransactionById(
    transactionId: string,
    userId: string
  ): Promise<TransactionWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          accounts!inner(name),
          categories!inner(name, color, icon),
          transfer_accounts:accounts!transactions_transfer_account_id_fkey(name)
        `)
        .eq('id', transactionId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Erro ao buscar transação:', error);
        throw new Error('Falha ao carregar transação');
      }

      return {
        ...data,
        account_name: data.accounts.name,
        category_name: data.categories.name,
        category_color: data.categories.color,
        category_icon: data.categories.icon,
        transfer_account_name: data.transfer_accounts?.name
      };
    } catch (error) {
      console.error('Erro no serviço de transações:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova transação
   */
  static async createTransaction(
    userId: string,
    transactionData: CreateTransactionData
  ): Promise<Transaction> {
    try {
      console.log('Criando transação com dados:', transactionData);
      
      // Mapear campos do frontend para o banco de dados
      const dbData = {
        user_id: userId,
        type: transactionData.type,
        amount: transactionData.amount,
        date: transactionData.transaction_date, // Mapear transaction_date para date
        account_id: transactionData.account_id,
        category_id: transactionData.category_id,
        description: transactionData.description,
        tags: transactionData.tags ? JSON.stringify(transactionData.tags) : '[]',
        status: transactionData.status || 'confirmed', // Usar o valor do enum do banco
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Dados mapeados para o banco:', dbData);

      const { data, error } = await supabase
        .from('transactions')
        .insert(dbData)
        .select()
        .single();

      console.log('Resultado da inserção:', { data, error });

      if (error) {
        console.error('Erro ao criar transação:', error);
        throw new Error('Falha ao criar transação');
      }

      // Atualizar saldo da conta se a transação for concluída
      if (data.status === TransactionStatus.CONFIRMED) {
        await this.updateAccountBalance(data.account_id, data.amount, data.type);
        
        // Se for transferência, atualizar conta de destino também
        if (data.type === TransactionType.TRANSFER && data.transfer_account_id) {
          await this.updateAccountBalance(data.transfer_account_id, data.amount, TransactionType.INCOME);
        }
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de transações:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma transação existente
   */
  static async updateTransaction(
    transactionId: string,
    userId: string,
    updateData: UpdateTransactionData
  ): Promise<Transaction> {
    try {
      // Buscar transação atual para comparar valores
      const currentTransaction = await this.getTransactionById(transactionId, userId);
      if (!currentTransaction) {
        throw new Error('Transação não encontrada');
      }

      // Mapear campos do frontend para o banco de dados
      const dbUpdateData: any = {
        updated_at: new Date().toISOString()
      };

      // Mapear apenas os campos que foram fornecidos
      if (updateData.transaction_date !== undefined) {
        dbUpdateData.date = updateData.transaction_date;
      }
      if (updateData.tags !== undefined) {
        dbUpdateData.tags = JSON.stringify(updateData.tags);
      }
      // Copiar outros campos diretamente
      Object.keys(updateData).forEach(key => {
        if (key !== 'transaction_date' && key !== 'tags') {
          dbUpdateData[key] = updateData[key as keyof UpdateTransactionData];
        }
      });

      const { data, error } = await supabase
        .from('transactions')
        .update(dbUpdateData)
        .eq('id', transactionId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar transação:', error);
        throw new Error('Falha ao atualizar transação');
      }

      // Reverter saldo anterior se necessário
      if (currentTransaction.status === TransactionStatus.CONFIRMED) {
        await this.updateAccountBalance(
          currentTransaction.account_id,
          -currentTransaction.amount,
          currentTransaction.type
        );
        
        if (currentTransaction.type === TransactionType.TRANSFER && currentTransaction.transfer_account_id) {
          await this.updateAccountBalance(
            currentTransaction.transfer_account_id,
            -currentTransaction.amount,
            TransactionType.INCOME
          );
        }
      }

      // Aplicar novo saldo se a transação estiver concluída
      if (data.status === TransactionStatus.CONFIRMED) {
        await this.updateAccountBalance(data.account_id, data.amount, data.type);
        
        if (data.type === TransactionType.TRANSFER && data.transfer_account_id) {
          await this.updateAccountBalance(data.transfer_account_id, data.amount, TransactionType.INCOME);
        }
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de transações:', error);
      throw error;
    }
  }

  /**
   * Exclui uma transação
   */
  static async deleteTransaction(transactionId: string, userId: string): Promise<void> {
    try {
      // Buscar transação para reverter saldo
      const transaction = await this.getTransactionById(transactionId, userId);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao excluir transação:', error);
        throw new Error('Falha ao excluir transação');
      }

      // Reverter saldo da conta se a transação estava concluída
      if (transaction.status === TransactionStatus.CONFIRMED) {
        await this.updateAccountBalance(
          transaction.account_id,
          -transaction.amount,
          transaction.type
        );
        
        if (transaction.type === TransactionType.TRANSFER && transaction.transfer_account_id) {
          await this.updateAccountBalance(
            transaction.transfer_account_id,
            -transaction.amount,
            TransactionType.INCOME
          );
        }
      }
    } catch (error) {
      console.error('Erro no serviço de transações:', error);
      throw error;
    }
  }

  /**
   * Calcula resumo das transações
   */
  static async getTransactionSummary(
    userId: string,
    filters?: TransactionFilters
  ): Promise<TransactionSummary> {
    try {
      const transactions = await this.getTransactions(userId, filters);
      
      const completedTransactions = transactions.filter(
        t => t.status === TransactionStatus.CONFIRMED
      );
      
      const incomeTransactions = completedTransactions.filter(
        t => t.type === TransactionType.INCOME
      );
      
      const expenseTransactions = completedTransactions.filter(
        t => t.type === TransactionType.EXPENSE
      );
      
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        total_income: totalIncome,
        total_expense: totalExpense,
        net_balance: totalIncome - totalExpense,
        transaction_count: completedTransactions.length,
        pending_count: transactions.filter(t => t.status === TransactionStatus.PENDING).length,
        completed_count: completedTransactions.length,
        average_transaction: completedTransactions.length > 0 
          ? (totalIncome + totalExpense) / completedTransactions.length 
          : 0,
        largest_income: incomeTransactions.length > 0 
          ? Math.max(...incomeTransactions.map(t => t.amount)) 
          : 0,
        largest_expense: expenseTransactions.length > 0 
          ? Math.max(...expenseTransactions.map(t => t.amount)) 
          : 0
      };
    } catch (error) {
      console.error('Erro no serviço de transações:', error);
      throw error;
    }
  }

  /**
   * Atualiza o saldo de uma conta baseado na transação
   */
  private static async updateAccountBalance(
    accountId: string,
    amount: number,
    type: TransactionType
  ): Promise<void> {
    try {
      // Determinar se deve somar ou subtrair do saldo
      const balanceChange = type === TransactionType.INCOME ? amount : -amount;
      
      const { error } = await supabase.rpc('update_account_balance', {
        account_id: accountId,
        amount_change: balanceChange
      });

      if (error) {
        console.error('Erro ao atualizar saldo da conta:', error);
        throw new Error('Falha ao atualizar saldo da conta');
      }
    } catch (error) {
      console.error('Erro no serviço de transações:', error);
      throw error;
    }
  }

  /**
   * Busca transações por categoria
   */
  static async getTransactionsByCategory(
    userId: string,
    categoryId: string,
    limit?: number
  ): Promise<TransactionWithDetails[]> {
    return this.getTransactions(userId, { category_id: categoryId }, limit);
  }

  /**
   * Busca transações por conta
   */
  static async getTransactionsByAccount(
    userId: string,
    accountId: string,
    limit?: number
  ): Promise<TransactionWithDetails[]> {
    return this.getTransactions(userId, { account_id: accountId }, limit);
  }

  /**
   * Busca transações recorrentes
   */
  static async getRecurringTransactions(
    userId: string
  ): Promise<TransactionWithDetails[]> {
    return this.getTransactions(userId, { is_recurring: true });
  }

  /**
   * Busca transações pendentes
   */
  static async getPendingTransactions(
    userId: string
  ): Promise<TransactionWithDetails[]> {
    return this.getTransactions(userId, { status: TransactionStatus.PENDING });
  }
}