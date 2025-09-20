/**
 * Dashboard Principal - Página de Finanças
 * Visão geral das finanças pessoais
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Target,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

/**
 * Interface para dados do dashboard
 */
interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  currentSavings: number;
  recentTransactions: Transaction[];
  monthlyBudgets: Budget[];
  upcomingBills: Bill[];
}

/**
 * Interface para transações
 */
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

/**
 * Interface para orçamentos
 */
interface Budget {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  percentage: number;
}

/**
 * Interface para contas a pagar
 */
interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
}

export default function FinancasPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsGoal: 0,
    currentSavings: 0,
    recentTransactions: [],
    monthlyBudgets: [],
    upcomingBills: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  /**
   * Função para carregar dados do dashboard
   * TODO: Implementar quando as tabelas estiverem criadas
   */
  const loadDashboardData = async () => {
    try {
      // Por enquanto, dados mockados
      const mockData: DashboardData = {
        totalBalance: 15750.50,
        monthlyIncome: 8500.00,
        monthlyExpenses: 4200.00,
        savingsGoal: 50000.00,
        currentSavings: 12500.00,
        recentTransactions: [
          {
            id: '1',
            description: 'Salário - Empresa XYZ',
            amount: 8500.00,
            type: 'income',
            category: 'Salário',
            date: '2024-01-15',
          },
          {
            id: '2',
            description: 'Supermercado ABC',
            amount: -350.00,
            type: 'expense',
            category: 'Alimentação',
            date: '2024-01-14',
          },
          {
            id: '3',
            description: 'Conta de Luz',
            amount: -180.00,
            type: 'expense',
            category: 'Utilidades',
            date: '2024-01-13',
          },
          {
            id: '4',
            description: 'Freelance - Projeto Web',
            amount: 1200.00,
            type: 'income',
            category: 'Freelance',
            date: '2024-01-12',
          },
          {
            id: '5',
            description: 'Combustível',
            amount: -120.00,
            type: 'expense',
            category: 'Transporte',
            date: '2024-01-11',
          },
        ],
        monthlyBudgets: [
          {
            id: '1',
            category: 'Alimentação',
            budgeted: 800.00,
            spent: 450.00,
            percentage: 56.25,
          },
          {
            id: '2',
            category: 'Transporte',
            budgeted: 400.00,
            spent: 320.00,
            percentage: 80.00,
          },
          {
            id: '3',
            category: 'Lazer',
            budgeted: 300.00,
            spent: 150.00,
            percentage: 50.00,
          },
          {
            id: '4',
            category: 'Utilidades',
            budgeted: 500.00,
            spent: 480.00,
            percentage: 96.00,
          },
        ],
        upcomingBills: [
          {
            id: '1',
            description: 'Aluguel',
            amount: 1200.00,
            dueDate: '2024-01-20',
            status: 'pending',
          },
          {
            id: '2',
            description: 'Internet',
            amount: 89.90,
            dueDate: '2024-01-18',
            status: 'pending',
          },
          {
            id: '3',
            description: 'Cartão de Crédito',
            amount: 650.00,
            dueDate: '2024-01-16',
            status: 'overdue',
          },
        ],
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Função para formatar valores monetários
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value));
  };

  /**
   * Função para formatar datas
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  /**
   * Função para obter a cor do progresso do orçamento
   */
  const getBudgetColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  /**
   * Função para obter o status da conta
   */
  const getBillStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const savingsPercentage = (dashboardData.currentSavings / dashboardData.savingsGoal) * 100;
  const netIncome = dashboardData.monthlyIncome - dashboardData.monthlyExpenses;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças pessoais
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Todas as contas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(dashboardData.monthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(dashboardData.monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              -5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Líquida</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              netIncome >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Receitas - Despesas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Transações Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Suas últimas movimentações financeiras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meta de Poupança */}
        <Card>
          <CardHeader>
            <CardTitle>Meta de Poupança</CardTitle>
            <CardDescription>
              Progresso da sua meta anual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm text-muted-foreground">
                  {savingsPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={savingsPercentage} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Atual</span>
                <span className="font-medium">
                  {formatCurrency(dashboardData.currentSavings)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Meta</span>
                <span className="font-medium">
                  {formatCurrency(dashboardData.savingsGoal)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Orçamentos do Mês */}
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos do Mês</CardTitle>
            <CardDescription>
              Acompanhe seus gastos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.monthlyBudgets.map((budget) => (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{budget.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.budgeted)}
                    </span>
                  </div>
                  <Progress 
                    value={budget.percentage} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={budget.percentage >= 90 ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {budget.percentage.toFixed(0)}% usado
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Restam {formatCurrency(budget.budgeted - budget.spent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contas a Pagar */}
        <Card>
          <CardHeader>
            <CardTitle>Contas a Pagar</CardTitle>
            <CardDescription>
              Próximos vencimentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{bill.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Vence em {formatDate(bill.dueDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                    <Badge 
                      className={`text-xs ${getBillStatusColor(bill.status)}`}
                      variant="secondary"
                    >
                      {bill.status === 'pending' && 'Pendente'}
                      {bill.status === 'overdue' && 'Vencida'}
                      {bill.status === 'paid' && 'Paga'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}