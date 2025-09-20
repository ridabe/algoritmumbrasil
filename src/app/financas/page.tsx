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

export default function FinancasPage() {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) {
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
          <Link href="/financas/transacoes">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeira Transação
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
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
          <Link href="/financas/transacoes">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Receitas do Mês"
          value={data.kpis.totalReceitas}
          icon={TrendingUp}
          format="currency"
          className="border-green-200 bg-green-50/50"
        />
        <KPICard
          title="Despesas do Mês"
          value={data.kpis.totalDespesas}
          icon={TrendingDown}
          format="currency"
          className="border-red-200 bg-red-50/50"
        />
        <KPICard
          title="Saldo Atual"
          value={data.kpis.saldoAtual}
          icon={DollarSign}
          format="currency"
          className={data.kpis.saldoAtual >= 0 ? "border-blue-200 bg-blue-50/50" : "border-red-200 bg-red-50/50"}
        />
        <KPICard
          title="Transações do Mês"
          value={data.kpis.transacoesDoMes}
          icon={CreditCard}
          format="number"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Evolution Chart */}
        <div className="lg:col-span-2">
          <MonthlyEvolutionChart data={data.monthlyEvolution} />
        </div>
        
        {/* Category Distribution Charts */}
        <CategoryDistributionChart
          data={data.expensesByCategory}
          title="Despesas por Categoria"
          type="expense"
        />
        <CategoryDistributionChart
          data={data.revenuesByCategory}
          title="Receitas por Categoria"
          type="income"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/financas/transacoes">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </Link>
            <Link href="/financas/contas">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Gerenciar Contas
              </Button>
            </Link>
            <Link href="/financas/relatorios">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Ver Relatórios
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}