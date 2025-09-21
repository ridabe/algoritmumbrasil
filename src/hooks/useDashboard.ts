import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';

export interface DashboardKPIs {
  totalReceitas: number;
  totalDespesas: number;
  saldoAtual: number;
  transacoesDoMes: number;
}

export interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface CategoryData {
  category: string;
  value: number;
  percentage: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  monthlyEvolution: MonthlyData[];
  expensesByCategory: CategoryData[];
  revenuesByCategory: CategoryData[];
}

/**
 * Hook personalizado para gerenciar dados do dashboard
 * Busca KPIs, evolução mensal e distribuição por categorias
 */
export function useDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca os KPIs principais do dashboard
   */
  const fetchKPIs = async (): Promise<DashboardKPIs> => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Buscar receitas do mês atual
    const { data: receitas } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user?.id)
      .eq('type', 'income')
      .gte('date', `${currentMonth}-01`)
      .lt('date', `${currentMonth}-32`);

    // Buscar despesas do mês atual
    const { data: despesas } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user?.id)
      .eq('type', 'expense')
      .gte('date', `${currentMonth}-01`)
      .lt('date', `${currentMonth}-32`);

    // Contar transações do mês
    const { count: transacoesCount } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id)
      .gte('date', `${currentMonth}-01`)
      .lt('date', `${currentMonth}-32`);

    const totalReceitas = receitas?.reduce((sum, t) => sum + t.amount, 0) || 0;
    const totalDespesas = despesas?.reduce((sum, t) => sum + t.amount, 0) || 0;
    const saldoAtual = totalReceitas - totalDespesas;

    return {
      totalReceitas,
      totalDespesas,
      saldoAtual,
      transacoesDoMes: transacoesCount || 0
    };
  };

  /**
   * Busca dados de evolução mensal dos últimos 6 meses
   */
  const fetchMonthlyEvolution = async (): Promise<MonthlyData[]> => {
    const months: MonthlyData[] = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

      // Buscar receitas do mês
      const { data: receitas } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user?.id)
        .eq('type', 'income')
        .gte('date', `${monthStr}-01`)
        .lt('date', `${monthStr}-32`);

      // Buscar despesas do mês
      const { data: despesas } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user?.id)
        .eq('type', 'expense')
        .gte('date', `${monthStr}-01`)
        .lt('date', `${monthStr}-32`);

      const totalReceitas = receitas?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalDespesas = despesas?.reduce((sum, t) => sum + t.amount, 0) || 0;

      months.push({
        month: monthName,
        receitas: totalReceitas,
        despesas: totalDespesas,
        saldo: totalReceitas - totalDespesas
      });
    }

    return months;
  };

  /**
   * Busca distribuição por categorias
   */
  const fetchCategoryDistribution = async (type: 'income' | 'expense'): Promise<CategoryData[]> => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, category')
      .eq('user_id', user?.id)
      .eq('type', type)
      .gte('date', `${currentMonth}-01`)
      .lt('date', `${currentMonth}-32`);

    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Agrupar por categoria
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Outros';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);

    return Object.entries(categoryTotals)
      .map(([category, value]) => ({
        category,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);
  };

  /**
   * Carrega todos os dados do dashboard
   */
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const [kpis, monthlyEvolution, expensesByCategory, revenuesByCategory] = await Promise.all([
        fetchKPIs(),
        fetchMonthlyEvolution(),
        fetchCategoryDistribution('expense'),
        fetchCategoryDistribution('income')
      ]);

      setData({
        kpis,
        monthlyEvolution,
        expensesByCategory,
        revenuesByCategory
      });
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // Só carrega dados se a autenticação estiver completa e o usuário estiver logado
    if (!authLoading && user) {
      loadDashboardData();
    } else if (!authLoading && !user) {
      // Se não há usuário logado, define loading como false
      setLoading(false);
      setError('Usuário não autenticado');
    }
  }, [loadDashboardData, authLoading, user]);

  return {
    data,
    loading,
    error,
    refetch: loadDashboardData
  };
}