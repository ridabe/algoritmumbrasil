/**
 * Tipos TypeScript para o módulo de contas bancárias
 * Define interfaces e enums para contas, cartões e investimentos
 */

// Enum para tipos de conta
export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT_CARD = 'credit_card',
  INVESTMENT = 'investment',
  DEBIT_CARD = 'debit_card'
}

// Enum para status da conta
export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  CLOSED = 'closed'
}

// Enum para moedas suportadas
export enum Currency {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR'
}

// Interface principal para contas
export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  bank: string;
  balance: number; // Campo calculado para compatibilidade
  initial_balance: number; // Campo real do banco
  currency: Currency;
  status: AccountStatus;
  is_active: boolean; // Campo real do banco
  limit?: number; // Para cartões de crédito
  interest_rate?: number; // Para poupança e investimentos
  account_number?: string;
  agency?: string;
  created_at: string;
  updated_at: string;
  last_transaction_date?: string;
  description?: string;
  color?: string; // Para personalização visual
}

// Interface para criação de nova conta
export interface CreateAccountData {
  name: string;
  type: AccountType;
  bank: string;
  balance: number; // Será mapeado para initial_balance
  currency?: Currency;
  limit?: number;
  interest_rate?: number;
  account_number?: string;
  agency?: string;
  description?: string;
  color?: string;
}

// Interface para atualização de conta
export interface UpdateAccountData {
  name?: string;
  bank?: string;
  balance?: number; // Será mapeado para initial_balance
  limit?: number;
  interest_rate?: number;
  account_number?: string;
  agency?: string;
  description?: string;
  color?: string;
  status?: AccountStatus;
  is_active?: boolean;
}

// Interface para resumo financeiro
export interface FinancialSummary {
  total_assets: number;
  total_debts: number;
  net_worth: number;
  total_checking: number;
  total_savings: number;
  total_investments: number;
  total_credit_cards: number;
  active_accounts: number;
  inactive_accounts: number;
}

// Interface para filtros de conta
export interface AccountFilters {
  type?: AccountType | 'all';
  status?: AccountStatus | 'all';
  bank?: string;
  currency?: Currency;
}

// Interface para resposta da API
export interface AccountsResponse {
  accounts: Account[];
  summary: FinancialSummary;
  total_count: number;
}

// Tipo para ordenação
export type AccountSortBy = 'name' | 'balance' | 'bank' | 'created_at' | 'last_transaction_date';
export type SortOrder = 'asc' | 'desc';

export interface AccountSort {
  field: AccountSortBy;
  order: SortOrder;
}

// Constantes úteis
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.CHECKING]: 'Conta Corrente',
  [AccountType.SAVINGS]: 'Poupança',
  [AccountType.CREDIT_CARD]: 'Cartão de Crédito',
  [AccountType.INVESTMENT]: 'Investimento',
  [AccountType.DEBIT_CARD]: 'Cartão de Débito'
};

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  [AccountStatus.ACTIVE]: 'Ativa',
  [AccountStatus.INACTIVE]: 'Inativa',
  [AccountStatus.BLOCKED]: 'Bloqueada',
  [AccountStatus.CLOSED]: 'Encerrada'
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.BRL]: 'R$',
  [Currency.USD]: '$',
  [Currency.EUR]: '€'
};

// Cores padrão para tipos de conta
export const ACCOUNT_TYPE_COLORS: Record<AccountType, string> = {
  [AccountType.CHECKING]: '#3B82F6', // Azul
  [AccountType.SAVINGS]: '#10B981', // Verde
  [AccountType.CREDIT_CARD]: '#EF4444', // Vermelho
  [AccountType.INVESTMENT]: '#8B5CF6', // Roxo
  [AccountType.DEBIT_CARD]: '#F59E0B' // Amarelo
};