/**
 * Schema do banco de dados para o Sistema Financeiro Algoritmum
 * Utiliza Drizzle ORM com PostgreSQL/Supabase
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  decimal,
  date,
  jsonb,
  pgEnum,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const accountTypeEnum = pgEnum('account_type', [
  'wallet',
  'checking',
  'savings',
  'broker',
  'credit',
]);

export const incomeSourceTypeEnum = pgEnum('income_source_type', [
  'salary',
  'freelance',
  'dividends',
  'rent',
  'other',
]);

export const transactionTypeEnum = pgEnum('transaction_type', [
  'income',
  'expense',
  'transfer',
]);

export const transactionStatusEnum = pgEnum('transaction_status', [
  'confirmed',
  'pending',
]);

export const recurringPeriodEnum = pgEnum('recurring_period', [
  'weekly',
  'monthly',
  'yearly',
]);

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const auditActionEnum = pgEnum('audit_action', [
  'insert',
  'update',
  'delete',
]);

// Tabelas

/**
 * Perfis de usuário (estende auth.users do Supabase)
 */
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    avatarUrl: text('avatar_url'),
    theme: text('theme').default('light').notNull(),
    currency: text('currency').default('BRL').notNull(),
    locale: text('locale').default('pt-BR').notNull(),
    role: userRoleEnum('role').default('user').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('profiles_user_id_idx').on(table.id),
  })
);

/**
 * Contas bancárias e carteiras
 */
export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: accountTypeEnum('type').notNull(),
    institution: text('institution'),
    initialBalance: decimal('initial_balance', { precision: 15, scale: 2 })
      .default('0')
      .notNull(),
    referenceDate: date('reference_date').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('accounts_user_id_idx').on(table.userId),
    typeIdx: index('accounts_type_idx').on(table.type),
  })
);

/**
 * Fontes de renda
 */
export const incomeSources = pgTable(
  'income_sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: incomeSourceTypeEnum('type').notNull(),
    description: text('description'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('income_sources_user_id_idx').on(table.userId),
    typeIdx: index('income_sources_type_idx').on(table.type),
  })
);

/**
 * Categorias de transações (estrutura hierárquica)
 */
export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').notNull(),
    emoji: text('emoji'),
    parentId: uuid('parent_id'),
    isGlobal: boolean('is_global').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('categories_user_id_idx').on(table.userId),
    parentIdIdx: index('categories_parent_id_idx').on(table.parentId),
    globalIdx: index('categories_global_idx').on(table.isGlobal),
  })
);

/**
 * Transações financeiras
 */
export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    type: transactionTypeEnum('type').notNull(),
    amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
    date: date('date').notNull(),
    accountId: uuid('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => categories.id),
    incomeSourceId: uuid('income_source_id').references(() => incomeSources.id),
    description: text('description'),
    tags: jsonb('tags').$type<string[]>().default([]),
    status: transactionStatusEnum('status').default('confirmed').notNull(),
    receiptUrl: text('receipt_url'),
    transferCounterpartyId: uuid('transfer_counterparty_id'),
    recurringRuleId: uuid('recurring_rule_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('transactions_user_id_idx').on(table.userId),
    dateIdx: index('transactions_date_idx').on(table.date),
    accountIdIdx: index('transactions_account_id_idx').on(table.accountId),
    categoryIdIdx: index('transactions_category_id_idx').on(table.categoryId),
    typeIdx: index('transactions_type_idx').on(table.type),
    statusIdx: index('transactions_status_idx').on(table.status),
    userDateIdx: index('transactions_user_date_idx').on(table.userId, table.date),
  })
);

/**
 * Regras de recorrência
 */
export const recurringRules = pgTable(
  'recurring_rules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    period: recurringPeriodEnum('period').notNull(),
    dayOfMonth: text('day_of_month'), // Para mensal: "1", "15", "last"
    dayOfWeek: text('day_of_week'), // Para semanal: "monday", "friday"
    baseDate: date('base_date').notNull(),
    endDate: date('end_date'),
    transactionTemplate: jsonb('transaction_template').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('recurring_rules_user_id_idx').on(table.userId),
    periodIdx: index('recurring_rules_period_idx').on(table.period),
    activeIdx: index('recurring_rules_active_idx').on(table.isActive),
  })
);

/**
 * Orçamentos por categoria
 */
export const budgets = pgTable(
  'budgets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    month: text('month').notNull(), // Formato: YYYY-MM
    budgetedAmount: decimal('budgeted_amount', { precision: 15, scale: 2 })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('budgets_user_id_idx').on(table.userId),
    categoryIdIdx: index('budgets_category_id_idx').on(table.categoryId),
    monthIdx: index('budgets_month_idx').on(table.month),
    userMonthIdx: index('budgets_user_month_idx').on(table.userId, table.month),
  })
);

/**
 * Metas financeiras
 */
export const goals = pgTable(
  'goals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    targetAmount: decimal('target_amount', { precision: 15, scale: 2 })
      .notNull(),
    currentAmount: decimal('current_amount', { precision: 15, scale: 2 })
      .default('0')
      .notNull(),
    deadline: date('deadline'),
    targetAccountId: uuid('target_account_id').references(() => accounts.id),
    description: text('description'),
    isCompleted: boolean('is_completed').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('goals_user_id_idx').on(table.userId),
    deadlineIdx: index('goals_deadline_idx').on(table.deadline),
    completedIdx: index('goals_completed_idx').on(table.isCompleted),
  })
);

/**
 * Log de auditoria
 */
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id),
    entity: text('entity').notNull(),
    entityId: uuid('entity_id').notNull(),
    action: auditActionEnum('action').notNull(),
    diff: jsonb('diff'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
    entityIdx: index('audit_logs_entity_idx').on(table.entity, table.entityId),
    actionIdx: index('audit_logs_action_idx').on(table.action),
    createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
  })
);

// Relações
export const profilesRelations = relations(profiles, ({ many }) => ({
  accounts: many(accounts),
  incomeSources: many(incomeSources),
  categories: many(categories),
  transactions: many(transactions),
  recurringRules: many(recurringRules),
  budgets: many(budgets),
  goals: many(goals),
  auditLogs: many(auditLogs),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(profiles, {
    fields: [accounts.userId],
    references: [profiles.id],
  }),
  transactions: many(transactions),
  goals: many(goals),
}));

export const incomeSourcesRelations = relations(incomeSources, ({ one, many }) => ({
  user: one(profiles, {
    fields: [incomeSources.userId],
    references: [profiles.id],
  }),
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(profiles, {
    fields: [categories.userId],
    references: [profiles.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  transactions: many(transactions),
  budgets: many(budgets),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(profiles, {
    fields: [transactions.userId],
    references: [profiles.id],
  }),
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  incomeSource: one(incomeSources, {
    fields: [transactions.incomeSourceId],
    references: [incomeSources.id],
  }),
  recurringRule: one(recurringRules, {
    fields: [transactions.recurringRuleId],
    references: [recurringRules.id],
  }),
}));

export const recurringRulesRelations = relations(recurringRules, ({ one, many }) => ({
  user: one(profiles, {
    fields: [recurringRules.userId],
    references: [profiles.id],
  }),
  transactions: many(transactions),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(profiles, {
    fields: [budgets.userId],
    references: [profiles.id],
  }),
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(profiles, {
    fields: [goals.userId],
    references: [profiles.id],
  }),
  targetAccount: one(accounts, {
    fields: [goals.targetAccountId],
    references: [accounts.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(profiles, {
    fields: [auditLogs.userId],
    references: [profiles.id],
  }),
}));

// Tipos TypeScript inferidos
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type IncomeSource = typeof incomeSources.$inferSelect;
export type NewIncomeSource = typeof incomeSources.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type RecurringRule = typeof recurringRules.$inferSelect;
export type NewRecurringRule = typeof recurringRules.$inferInsert;

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;