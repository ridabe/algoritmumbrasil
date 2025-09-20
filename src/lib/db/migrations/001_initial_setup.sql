-- Migração inicial para o Sistema Financeiro Algoritmum
-- Esta migração cria todas as tabelas e configurações necessárias

-- Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Cria os enums
CREATE TYPE account_type AS ENUM ('wallet', 'checking', 'savings', 'broker', 'credit');
CREATE TYPE income_source_type AS ENUM ('salary', 'freelance', 'dividends', 'rent', 'other');
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');
CREATE TYPE transaction_status AS ENUM ('confirmed', 'pending');
CREATE TYPE recurring_period AS ENUM ('weekly', 'monthly', 'yearly');
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE audit_action AS ENUM ('insert', 'update', 'delete');

-- Tabela de perfis de usuário
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    avatar_url TEXT,
    theme TEXT DEFAULT 'light' NOT NULL,
    currency TEXT DEFAULT 'BRL' NOT NULL,
    locale TEXT DEFAULT 'pt-BR' NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de contas
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type account_type NOT NULL,
    institution TEXT,
    initial_balance DECIMAL(15,2) DEFAULT 0 NOT NULL,
    reference_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de fontes de renda
CREATE TABLE income_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type income_source_type NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de categorias
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    emoji TEXT,
    parent_id UUID REFERENCES categories(id),
    is_global BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de regras recorrentes
CREATE TABLE recurring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    period recurring_period NOT NULL,
    day_of_month TEXT,
    day_of_week TEXT,
    base_date DATE NOT NULL,
    end_date DATE,
    transaction_template JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de transações
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    income_source_id UUID REFERENCES income_sources(id),
    description TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    status transaction_status DEFAULT 'confirmed' NOT NULL,
    receipt_url TEXT,
    transfer_counterparty_id UUID,
    recurring_rule_id UUID REFERENCES recurring_rules(id),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de orçamentos
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- Formato: YYYY-MM
    budgeted_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de metas
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0 NOT NULL,
    deadline DATE,
    target_account_id UUID REFERENCES accounts(id),
    description TEXT,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de logs de auditoria
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    entity TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action audit_action NOT NULL,
    diff JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Índices para performance
CREATE INDEX profiles_user_id_idx ON profiles(id);
CREATE INDEX accounts_user_id_idx ON accounts(user_id);
CREATE INDEX accounts_type_idx ON accounts(type);
CREATE INDEX income_sources_user_id_idx ON income_sources(user_id);
CREATE INDEX income_sources_type_idx ON income_sources(type);
CREATE INDEX categories_user_id_idx ON categories(user_id);
CREATE INDEX categories_parent_id_idx ON categories(parent_id);
CREATE INDEX categories_global_idx ON categories(is_global);
CREATE INDEX transactions_user_id_idx ON transactions(user_id);
CREATE INDEX transactions_date_idx ON transactions(date);
CREATE INDEX transactions_account_id_idx ON transactions(account_id);
CREATE INDEX transactions_category_id_idx ON transactions(category_id);
CREATE INDEX transactions_type_idx ON transactions(type);
CREATE INDEX transactions_status_idx ON transactions(status);
CREATE INDEX transactions_user_date_idx ON transactions(user_id, date);
CREATE INDEX recurring_rules_user_id_idx ON recurring_rules(user_id);
CREATE INDEX recurring_rules_period_idx ON recurring_rules(period);
CREATE INDEX recurring_rules_active_idx ON recurring_rules(is_active);
CREATE INDEX budgets_user_id_idx ON budgets(user_id);
CREATE INDEX budgets_category_id_idx ON budgets(category_id);
CREATE INDEX budgets_month_idx ON budgets(month);
CREATE INDEX budgets_user_month_idx ON budgets(user_id, month);
CREATE INDEX goals_user_id_idx ON goals(user_id);
CREATE INDEX goals_deadline_idx ON goals(deadline);
CREATE INDEX goals_completed_idx ON goals(is_completed);
CREATE INDEX audit_logs_user_id_idx ON audit_logs(user_id);
CREATE INDEX audit_logs_entity_idx ON audit_logs(entity, entity_id);
CREATE INDEX audit_logs_action_idx ON audit_logs(action);
CREATE INDEX audit_logs_created_at_idx ON audit_logs(created_at);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_income_sources_updated_at BEFORE UPDATE ON income_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_rules_updated_at BEFORE UPDATE ON recurring_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para accounts
CREATE POLICY "Users can view own accounts" ON accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts" ON accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts" ON accounts FOR DELETE USING (auth.uid() = user_id);

-- Políticas para income_sources
CREATE POLICY "Users can view own income sources" ON income_sources FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own income sources" ON income_sources FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own income sources" ON income_sources FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own income sources" ON income_sources FOR DELETE USING (auth.uid() = user_id);

-- Políticas para categories
CREATE POLICY "Users can view own categories" ON categories FOR SELECT USING (auth.uid() = user_id OR is_global = true);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- Políticas para transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- Políticas para recurring_rules
CREATE POLICY "Users can view own recurring rules" ON recurring_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recurring rules" ON recurring_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recurring rules" ON recurring_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recurring rules" ON recurring_rules FOR DELETE USING (auth.uid() = user_id);

-- Políticas para budgets
CREATE POLICY "Users can view own budgets" ON budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON budgets FOR DELETE USING (auth.uid() = user_id);

-- Políticas para goals
CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

-- Políticas para audit_logs
CREATE POLICY "Users can view own audit logs" ON audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- Inserir categorias globais padrão
INSERT INTO categories (id, name, color, emoji, is_global) VALUES
    (uuid_generate_v4(), 'Alimentação', '#ef4444', '🍽️', true),
    (uuid_generate_v4(), 'Transporte', '#f97316', '🚗', true),
    (uuid_generate_v4(), 'Moradia', '#eab308', '🏠', true),
    (uuid_generate_v4(), 'Saúde', '#22c55e', '🏥', true),
    (uuid_generate_v4(), 'Educação', '#3b82f6', '📚', true),
    (uuid_generate_v4(), 'Lazer', '#8b5cf6', '🎮', true),
    (uuid_generate_v4(), 'Compras', '#ec4899', '🛍️', true),
    (uuid_generate_v4(), 'Serviços', '#06b6d4', '🔧', true),
    (uuid_generate_v4(), 'Investimentos', '#10b981', '📈', true),
    (uuid_generate_v4(), 'Outros', '#6b7280', '📦', true);

COMMIT;