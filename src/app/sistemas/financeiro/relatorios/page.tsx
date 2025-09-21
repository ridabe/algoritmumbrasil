/**
 * Página de Relatórios
 * Exibe gráficos e análises financeiras detalhadas
 */

'use client';

import { useState } from 'react';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Dados mockados para demonstração
const mockData = {
  monthlyTrend: [
    { month: 'Jan', income: 5000, expense: 3500 },
    { month: 'Fev', income: 5200, expense: 3800 },
    { month: 'Mar', income: 4800, expense: 3200 },
    { month: 'Abr', income: 5500, expense: 4100 },
    { month: 'Mai', income: 5300, expense: 3900 },
    { month: 'Jun', income: 5800, expense: 4200 },
  ],
  categoryExpenses: [
    { category: 'Alimentação', amount: 1200, percentage: 30 },
    { category: 'Moradia', amount: 1000, percentage: 25 },
    { category: 'Transporte', amount: 600, percentage: 15 },
    { category: 'Lazer', amount: 400, percentage: 10 },
    { category: 'Saúde', amount: 300, percentage: 7.5 },
    { category: 'Outros', amount: 500, percentage: 12.5 },
  ],
  topTransactions: [
    { description: 'Salário', amount: 5000, type: 'income' },
    { description: 'Aluguel', amount: -1200, type: 'expense' },
    { description: 'Freelance', amount: 800, type: 'income' },
    { description: 'Supermercado', amount: -450, type: 'expense' },
    { description: 'Gasolina', amount: -200, type: 'expense' },
  ],
};

/**
 * Formata valor monetário para exibição
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Componente de gráfico de barras simples
 */
function SimpleBarChart({ data }: { data: Array<{ month: string; income: number; expense: number }> }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expense)));
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.month}</span>
            <div className="flex gap-4">
              <span className="text-green-600">{formatCurrency(item.income)}</span>
              <span className="text-red-600">{formatCurrency(item.expense)}</span>
            </div>
          </div>
          <div className="flex gap-1 h-6">
            <div 
              className="bg-green-500 rounded-sm"
              style={{ width: `${(item.income / maxValue) * 100}%` }}
            />
            <div 
              className="bg-red-500 rounded-sm"
              style={{ width: `${(item.expense / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Componente de gráfico de pizza simples
 */
function SimplePieChart({ data }: { data: Array<{ category: string; amount: number; percentage: number }> }) {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-gray-500'];
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
            <span className="text-sm font-medium">{item.category}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{formatCurrency(item.amount)}</div>
            <div className="text-xs text-muted-foreground">{item.percentage}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Calcular métricas
  const totalIncome = mockData.monthlyTrend.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = mockData.monthlyTrend.reduce((sum, item) => sum + item.expense, 0);
  const netIncome = totalIncome - totalExpense;
  const avgMonthlyIncome = totalIncome / mockData.monthlyTrend.length;
  const avgMonthlyExpense = totalExpense / mockData.monthlyTrend.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise detalhada das suas finanças
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mês</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Média: {formatCurrency(avgMonthlyIncome)}/mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground">
              Média: {formatCurrency(avgMonthlyExpense)}/mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              netIncome >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((netIncome / totalIncome) * 100).toFixed(1)}% da receita
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Poupança</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((netIncome / totalIncome) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Meta recomendada: 20%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tendência Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendência Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Receitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>Despesas</span>
                </div>
              </div>
              <SimpleBarChart data={mockData.monthlyTrend} />
            </div>
          </CardContent>
        </Card>

        {/* Gastos por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={mockData.categoryExpenses} />
          </CardContent>
        </Card>
      </div>

      {/* Transações Principais */}
      <Card>
        <CardHeader>
          <CardTitle>Principais Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.topTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium">{transaction.description}</span>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Ponto Positivo</span>
              </div>
              <p className="text-sm text-green-700">
                Sua taxa de poupança está em {((netIncome / totalIncome) * 100).toFixed(1)}%, 
                o que está acima da média nacional de 15%.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Oportunidade</span>
              </div>
              <p className="text-sm text-yellow-700">
                Seus gastos com alimentação representam 30% do orçamento. 
                Considere revisar este categoria para otimizar seus gastos.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Dica</span>
              </div>
              <p className="text-sm text-blue-700">
                Com base no seu padrão de gastos, você pode economizar até R$ 300/mês 
                otimizando as categorias de maior impacto.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}