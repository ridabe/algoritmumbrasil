/**
 * Dashboard Principal - Página de Finanças
 * Visão geral das finanças pessoais com gráficos e KPIs
 */

'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { KPICard } from '@/components/dashboard/KPICard';
import { MonthlyEvolutionChart } from '@/components/dashboard/MonthlyEvolutionChart';
import { CategoryDistributionChart } from '@/components/dashboard/CategoryDistributionChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, Suspense } from 'react';

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const { data, loading, error, refetch } = useDashboard();

  // Debug: verificar estado da autenticação
  useEffect(() => {
    console.log('Auth state:', { user, authLoading });
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Nenhum dado disponível</p>
          <Link href="/sistemas/financeiro/transacoes">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeira Transação
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { kpis, monthlyEvolution, expensesByCategory, revenuesByCategory } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças pessoais
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Link href="/sistemas/financeiro/transacoes/nova">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Receitas do Mês"
          value={kpis.totalReceitas}
          icon={TrendingUp}
          format="currency"
          className="text-green-600"
        />
        <KPICard
          title="Despesas do Mês"
          value={kpis.totalDespesas}
          icon={TrendingDown}
          format="currency"
          className="text-red-600"
        />
        <KPICard
          title="Saldo Atual"
          value={kpis.saldoAtual}
          icon={DollarSign}
          format="currency"
          className={kpis.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <KPICard
          title="Transações"
          value={kpis.transacoesDoMes}
          icon={CreditCard}
          format="number"
          className="text-blue-600"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyEvolutionChart data={monthlyEvolution} />
          </CardContent>
        </Card>

        {/* Distribuição por Categoria */}
         <CategoryDistributionChart 
           data={expensesByCategory} 
           title="Despesas por Categoria"
           type="expense"
         />
       </div>

       {/* Receitas por Categoria */}
       <CategoryDistributionChart 
         data={revenuesByCategory} 
         title="Receitas por Categoria"
         type="income"
       />

      {/* Links Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/sistemas/financeiro/transacoes">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Ver Transações
              </Button>
            </Link>
            <Link href="/sistemas/financeiro/contas">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Gerenciar Contas
              </Button>
            </Link>
            <Link href="/sistemas/financeiro/relatorios">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Relatórios
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    </div>
  );
}

export default function FinancasPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardContent />
    </Suspense>
  );
}