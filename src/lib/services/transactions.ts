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
   * Utilitário para serializar objetos em logs sem quebrar com BigInt/ciclos
   */
  private static safeJson(value: any): string {
    const seen = new WeakSet();
    try {
      return JSON.stringify(value, (_key, val) => {
        if (typeof val === 'bigint') return val.toString();
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) return '[Circular]';
          seen.add(val);
        }
        return val;
      });
    } catch {
      try { return String(value); } catch { return '[Unserializable]'; }
    }
  }

  /**
   * Verifica se uma string é um UUID válido (v1-v5)
   */
  private static isValidUUID(value: any): boolean {
    return (
      typeof value === 'string' &&
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value)
    );
  }
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
        .select(`
          *,
          accounts(name),
          categories(name, color)
        `)
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
        console.error('Erro ao buscar transações:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
        throw new Error('Falha ao carregar transações');
      }

      // Mapear dados para o formato esperado
      return data.map(transaction => {
        // Tratar tags vindas do banco:
        // - Se já for array (jsonb parseado), usa diretamente
        // - Se vier como string JSON, tenta fazer parse
        // - Caso contrário, usa array vazio
        let normalizedTags: string[] = [];
        const rawTags = (transaction as any).tags;
        try {
          if (Array.isArray(rawTags)) {
            normalizedTags = rawTags;
          } else if (typeof rawTags === 'string') {
            const trimmed = rawTags.trim();
            normalizedTags = trimmed ? JSON.parse(trimmed) : [];
          } else if (rawTags == null) {
            normalizedTags = [];
          }
        } catch (parseError) {
          console.warn('Erro ao normalizar tags da transação:', (transaction as any).id, parseError);
          normalizedTags = [];
        }
        
        return {
          ...transaction,
          transaction_date: (transaction as any).date, // Mapear date para transaction_date
          tags: normalizedTags,
          account_name: (transaction as any).accounts?.name || 'Conta não encontrada',
          category_name: (transaction as any).categories?.name || 'Categoria não encontrada',
          category_color: (transaction as any).categories?.color || '#6B7280',
          category_icon: null // Campo não existe na tabela
        } as any;
      });
    } catch (error) {
      console.error('Erro no serviço de transações:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        // transactionId is not defined in this context, removing it
        userId
      });
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
          categories!inner(name, color)
        `)
        .eq('id', transactionId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Erro ao buscar transação:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw new Error('Falha ao carregar transação');
      }

      // Se for uma transferência, buscar o nome da conta de destino separadamente
      let transfer_account_name = undefined;
      const transferId = (data as any).transfer_counterparty_id ?? (data as any).transfer_account_id;
      if (transferId) {
        const { data: transferAccount } = await supabase
          .from('accounts')
          .select('name')
          .eq('id', transferId)
          .single();
        transfer_account_name = transferAccount?.name;
      }
      
      return {
        ...data,
        account_name: data.accounts.name,
        category_name: data.categories.name,
        category_color: data.categories.color,
        category_icon: null, // Campo não existe na tabela
        transfer_account_name,
        // Alias para compatibilidade com o resto do app
        transfer_account_id: (data as any).transfer_counterparty_id ?? (data as any).transfer_account_id
      };
    } catch (error) {
      console.error('Erro no serviço de transações (getTransactionById):', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId
      });
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
      console.log('=== INÍCIO createTransaction ===');
      console.log('UserId:', userId);
      console.log('TransactionData recebido:', TransactionService.safeJson(transactionData));
      
      // Validar dados obrigatórios
      if (!userId) {
        throw new Error('UserId é obrigatório');
      }
      if (!transactionData.account_id) {
        throw new Error('account_id é obrigatório');
      }
      if (!transactionData.type) {
        throw new Error('type é obrigatório');
      }
      // Normalizar amount (suportar string com vírgula/ponto)
      const normalizedAmount = typeof (transactionData as any).amount === 'string'
        ? parseFloat(((transactionData as any).amount as string).replace(/\./g, '').replace(',', '.'))
        : transactionData.amount;
      if (!normalizedAmount || isNaN(normalizedAmount) || normalizedAmount <= 0) {
        throw new Error('amount deve ser maior que zero');
      }
      if (!transactionData.transaction_date && !transactionData.date) {
        throw new Error('Data da transação é obrigatória');
      }
      
      // Normalizar data para formato YYYY-MM-DD
      const rawDate = transactionData.transaction_date || transactionData.date;
      const normalizedDate = rawDate
        ? (rawDate.length > 10 ? new Date(rawDate).toISOString().split('T')[0] : rawDate)
        : undefined;
      
      // Normalizar status para enum do banco ('confirmed' | 'pending')
      let normalizedStatus = ((transactionData.status as any) || 'confirmed').toString().toLowerCase();
      if (normalizedStatus !== 'confirmed' && normalizedStatus !== 'pending') {
        normalizedStatus = 'confirmed';
      }

      // Validar campos UUID essenciais
      if (!TransactionService.isValidUUID(transactionData.account_id)) {
        console.error('account_id inválido (esperado UUID):', { account_id: transactionData.account_id });
        throw new Error('account_id inválido: valor deve ser um UUID');
      }

      // Normalizar/validar categoria (permitir nulo se inválida)
      const normalizedCategoryId = transactionData.category_id && TransactionService.isValidUUID(transactionData.category_id)
        ? transactionData.category_id
        : null;
      if (transactionData.category_id && !normalizedCategoryId) {
        console.warn('category_id não é UUID válido, será definido como null:', { category_id: transactionData.category_id });
      }
      
      // Mapear campos do frontend para o banco de dados
      const dbData: any = {
        user_id: userId,
        type: transactionData.type,
        amount: normalizedAmount,
        date: normalizedDate, // Aceitar ambos os formatos e normalizar
        account_id: transactionData.account_id,
        category_id: normalizedCategoryId,
        description: transactionData.description || '',
        // Enviar tags como JSON (array), não string
        tags: Array.isArray(transactionData.tags)
          ? transactionData.tags
          : (typeof transactionData.tags === 'string' && (transactionData.tags as string).trim()
              ? (transactionData.tags as string).split(',').map((t) => t.trim()).filter(Boolean)
              : []),
        status: normalizedStatus // Usar o valor do enum do banco
      };
      
      // Mapear conta de destino para transferências (se fornecida)
      const transferInput = (transactionData as any).transfer_account_id;
      if (transferInput) {
        if (transactionData.type === TransactionType.TRANSFER && !TransactionService.isValidUUID(transferInput)) {
          console.error('transfer_account_id inválido (esperado UUID) para transferência:', { transfer_account_id: transferInput });
          throw new Error('transfer_account_id inválido: valor deve ser um UUID em transações de transferência');
        }
        if (TransactionService.isValidUUID(transferInput)) {
          dbData.transfer_counterparty_id = transferInput;
        } else {
          console.warn('transfer_account_id informado não é UUID válido, ignorando campo:', { transfer_account_id: transferInput });
        }
      }
      // Removidos campos que não existem na tabela: due_date, notes, location, etc.
      
      console.log('Dados mapeados para o banco:', TransactionService.safeJson(dbData));
  
      const { data, error } = await supabase
        .from('transactions')
        .insert(dbData)
        .select()
        .maybeSingle();
  
      console.log('Resultado da inserção:', { data, error });
  
      if (error) {
        console.error('Erro ao criar transação:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
        // Propagar a mensagem original para facilitar o diagnóstico no frontend
        throw new Error(`Falha ao criar transação: ${error.message}${error.code ? ` (code: ${error.code})` : ''}`);
      }
  
      // Criar alias compatível para consumo no app
      const baseCreated: any = data ?? dbData; // fallback quando retorno é suprimido por RLS
      const created: any = { ...baseCreated, transfer_account_id: (baseCreated as any).transfer_counterparty_id ?? (baseCreated as any).transfer_account_id };
  
      // Atualizar saldo da conta se a transação for concluída
      if (created.status === TransactionStatus.CONFIRMED) {
        await this.updateAccountBalance(created.account_id, created.amount, created.type);
        
        // Se for transferência, atualizar conta de destino também
        if (created.type === TransactionType.TRANSFER && created.transfer_account_id) {
          await this.updateAccountBalance(created.transfer_account_id, created.amount, TransactionType.INCOME);
        }
      }
  
      return created;
    } catch (error) {
      // Log como string para evitar '{}' no console do navegador
      console.error(`Erro no serviço de transações (createTransaction): ${error instanceof Error ? error.message : String(error)}`);
      // Log estruturado com detalhes
      console.error('Erro no serviço de transações (createTransaction):', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        transactionData: TransactionService.safeJson(transactionData)
      });
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
        // Normalizar data de atualização
        dbUpdateData.date = updateData.transaction_date
          ? (updateData.transaction_date.length > 10
              ? new Date(updateData.transaction_date).toISOString().split('T')[0]
              : updateData.transaction_date)
          : undefined;
      }
      if (updateData.tags !== undefined) {
        // Garantir que tags seja um array JSON
        dbUpdateData.tags = Array.isArray(updateData.tags)
          ? updateData.tags
          : (typeof updateData.tags === 'string' && (updateData.tags as string).trim()
              ? (updateData.tags as string).split(',').map((t) => t.trim()).filter(Boolean)
              : []);
      }
      // Normalizar amount se enviado
      if (updateData.amount !== undefined) {
        dbUpdateData.amount = typeof (updateData as any).amount === 'string'
          ? parseFloat(((updateData as any).amount as string).replace(/\./g, '').replace(',', '.'))
          : updateData.amount;
      }
      // Normalizar status se enviado
      if (updateData.status !== undefined) {
        const st = (updateData.status as any).toString().toLowerCase();
        dbUpdateData.status = (st === 'confirmed' || st === 'pending') ? st : 'confirmed';
      }
      // Validar/mudar account_id se enviado
      if (updateData.account_id !== undefined) {
        if (!TransactionService.isValidUUID(updateData.account_id)) {
          console.error('account_id inválido (esperado UUID) ao atualizar:', { account_id: updateData.account_id });
          throw new Error('account_id inválido: valor deve ser um UUID');
        }
        dbUpdateData.account_id = updateData.account_id;
      }
      // Normalizar categoria (permitir nulo)
      if (updateData.category_id !== undefined) {
        if (updateData.category_id && !TransactionService.isValidUUID(updateData.category_id)) {
          console.warn('category_id inválido ao atualizar; será definido como null:', { category_id: updateData.category_id });
          dbUpdateData.category_id = null;
        } else {
          dbUpdateData.category_id = updateData.category_id || null;
        }
      }
      // Mapear conta de destino de transferência, se fornecida
      if ((updateData as any).transfer_account_id !== undefined) {
        const transferVal = (updateData as any).transfer_account_id;
        const effectiveType = updateData.type ?? currentTransaction.type;
        if (transferVal) {
          if (!TransactionService.isValidUUID(transferVal)) {
            if (effectiveType === TransactionType.TRANSFER) {
              console.error('transfer_account_id inválido (esperado UUID) ao atualizar transferência:', { transfer_account_id: transferVal });
              throw new Error('transfer_account_id inválido: valor deve ser um UUID em transações de transferência');
            } else {
              console.warn('transfer_account_id inválido para tipo não-transferência; será ignorado:', { transfer_account_id: transferVal, effectiveType });
            }
          } else {
            dbUpdateData.transfer_counterparty_id = transferVal;
          }
        } else {
          // Limpeza explícita
          dbUpdateData.transfer_counterparty_id = null;
        }
      }
      // Copiar outros campos diretamente, evitando sobrescrever os já normalizados
      Object.keys(updateData).forEach(key => {
        if (!['transaction_date', 'tags', 'amount', 'status', 'category_id', 'transfer_account_id', 'account_id', 'type'].includes(key)) {
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
        console.error('Erro ao atualizar transação:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
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
      console.error('Erro no serviço de transações (updateAccountBalance):', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        transactionId,
        updateData: TransactionService.safeJson(updateData)
      });
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
        console.error('Erro ao excluir transação:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
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
      console.error('Erro no serviço de transações (deleteTransaction):', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        transactionId,
        userId
      });
      throw error;
    }
  }

  /**
   * Calcula estatísticas das transações
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
      console.error('Erro no serviço de transações (updateTransaction):', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
userId, // Removed transactionId since it's not defined in this scope
        filters: JSON.stringify(filters)
      });
      throw error;
    }
  }

  /**
   * Atualiza o saldo de uma conta baseado na transação
   * Torna-se público para permitir uso interno/externo quando necessário (ex.: testes)
   */
  static async updateAccountBalance(
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
        // Não interromper o fluxo caso a RPC não exista ou falhe
        console.warn('Aviso: falha ao atualizar saldo via RPC update_account_balance. A transação foi criada/atualizada, mas o saldo não foi ajustado automaticamente.', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          accountId,
          balanceChange
        });
        return; // Evitar throw para não quebrar fluxo principal
      }
    } catch (error) {
      // Capturar erros inesperados sem quebrar o fluxo
      console.warn('Aviso: exceção inesperada ao chamar update_account_balance. Prosseguindo sem ajuste automático de saldo.', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        accountId,
        amount,
        type
      });
      return;
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