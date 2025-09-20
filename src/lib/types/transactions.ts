/**
 * Tipos TypeScript para o sistema de transações
 * Define interfaces, enums e constantes para transações financeiras
 */

// Enums para tipos de transação
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer'
}

// Enums para status da transação
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SCHEDULED = 'scheduled'
}

// Enums para métodos de pagamento
export enum PaymentMethod {
  CASH = 'cash',
  DEBIT_CARD = 'debit_card',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  PIX = 'pix',
  CHECK = 'check',
  OTHER = 'other'
}

// Enums para frequência de recorrência
export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

// Interface principal para transações
export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  payment_method: PaymentMethod;
  transaction_date: string; // ISO date string
  due_date?: string; // ISO date string
  notes?: string;
  tags?: string[];
  attachment_url?: string;
  location?: string;
  is_recurring: boolean;
  recurrence_frequency?: RecurrenceFrequency;
  recurrence_end_date?: string;
  parent_transaction_id?: string; // Para transações recorrentes
  transfer_account_id?: string; // Para transferências
  created_at: string;
  updated_at: string;
}

// Interface para criação de transação
export interface CreateTransactionData {
  account_id: string;
  category_id: string;
  description: string;
  amount: number;
  type: TransactionType;
  payment_method: PaymentMethod;
  transaction_date: string;
  due_date?: string;
  notes?: string;
  tags?: string[];
  location?: string;
  is_recurring?: boolean;
  recurrence_frequency?: RecurrenceFrequency;
  recurrence_end_date?: string;
  transfer_account_id?: string;
}

// Interface para atualização de transação
export interface UpdateTransactionData {
  account_id?: string;
  category_id?: string;
  description?: string;
  amount?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  payment_method?: PaymentMethod;
  transaction_date?: string;
  due_date?: string;
  notes?: string;
  tags?: string[];
  location?: string;
  is_recurring?: boolean;
  recurrence_frequency?: RecurrenceFrequency;
  recurrence_end_date?: string;
  transfer_account_id?: string;
}

// Interface para filtros de transação
export interface TransactionFilters {
  type?: TransactionType | 'all';
  status?: TransactionStatus | 'all';
  account_id?: string;
  category_id?: string;
  payment_method?: PaymentMethod;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  search?: string;
  tags?: string[];
  is_recurring?: boolean;
}

// Interface para resumo de transações
export interface TransactionSummary {
  total_income: number;
  total_expense: number;
  net_balance: number;
  transaction_count: number;
  pending_count: number;
  completed_count: number;
  average_transaction: number;
  largest_income: number;
  largest_expense: number;
}

// Interface para transação com dados relacionados
export interface TransactionWithDetails extends Transaction {
  account_name: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  transfer_account_name?: string;
}

// Constantes para categorias padrão
export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salário', icon: 'Briefcase', color: '#10B981' },
  { name: 'Freelance', icon: 'Laptop', color: '#3B82F6' },
  { name: 'Investimentos', icon: 'TrendingUp', color: '#8B5CF6' },
  { name: 'Vendas', icon: 'ShoppingBag', color: '#F59E0B' },
  { name: 'Aluguel Recebido', icon: 'Home', color: '#06B6D4' },
  { name: 'Outros', icon: 'Plus', color: '#6B7280' }
] as const;

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Alimentação', icon: 'Utensils', color: '#EF4444' },
  { name: 'Transporte', icon: 'Car', color: '#F97316' },
  { name: 'Moradia', icon: 'Home', color: '#84CC16' },
  { name: 'Saúde', icon: 'Heart', color: '#EC4899' },
  { name: 'Educação', icon: 'GraduationCap', color: '#8B5CF6' },
  { name: 'Lazer', icon: 'Gamepad2', color: '#06B6D4' },
  { name: 'Compras', icon: 'ShoppingCart', color: '#F59E0B' },
  { name: 'Serviços', icon: 'Settings', color: '#6B7280' },
  { name: 'Impostos', icon: 'FileText', color: '#DC2626' },
  { name: 'Outros', icon: 'MoreHorizontal', color: '#6B7280' }
] as const;

// Constantes para métodos de pagamento
export const PAYMENT_METHOD_LABELS = {
  [PaymentMethod.CASH]: 'Dinheiro',
  [PaymentMethod.DEBIT_CARD]: 'Cartão de Débito',
  [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
  [PaymentMethod.BANK_TRANSFER]: 'Transferência Bancária',
  [PaymentMethod.PIX]: 'PIX',
  [PaymentMethod.CHECK]: 'Cheque',
  [PaymentMethod.OTHER]: 'Outro'
} as const;

// Constantes para status
export const TRANSACTION_STATUS_LABELS = {
  [TransactionStatus.PENDING]: 'Pendente',
  [TransactionStatus.COMPLETED]: 'Concluída',
  [TransactionStatus.CANCELLED]: 'Cancelada',
  [TransactionStatus.SCHEDULED]: 'Agendada'
} as const;

// Constantes para tipos
export const TRANSACTION_TYPE_LABELS = {
  [TransactionType.INCOME]: 'Receita',
  [TransactionType.EXPENSE]: 'Despesa',
  [TransactionType.TRANSFER]: 'Transferência'
} as const;

// Constantes para frequência de recorrência
export const RECURRENCE_FREQUENCY_LABELS = {
  [RecurrenceFrequency.DAILY]: 'Diário',
  [RecurrenceFrequency.WEEKLY]: 'Semanal',
  [RecurrenceFrequency.MONTHLY]: 'Mensal',
  [RecurrenceFrequency.QUARTERLY]: 'Trimestral',
  [RecurrenceFrequency.YEARLY]: 'Anual'
} as const;