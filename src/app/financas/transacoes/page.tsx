/**
 * Página de Transações
 * Lista e gerencia todas as transações financeiras
 */

'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Dados mockados para demonstração
const mockTransactions = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Salário Janeiro',
    category: 'Salário',
    account: 'Conta Corrente',
    type: 'income' as const,
    amount: 5000.00,
    status: 'completed' as const,
  },
  {
    id: '2',
    date: '2024-01-14',
    description: 'Supermercado',
    category: 'Alimentação',
    account: 'Cartão de Crédito',
    type: 'expense' as const,
    amount: 250.80,
    status: 'completed' as const,
  },
  {
    id: '3',
    date: '2024-01-13',
    description: 'Freelance Design',
    category: 'Freelance',
    account: 'Conta Poupança',
    type: 'income' as const,
    amount: 800.00,
    status: 'pending' as const,
  },
  {
    id: '4',
    date: '2024-01-12',
    description: 'Aluguel',
    category: 'Moradia',
    account: 'Conta Corrente',
    type: 'expense' as const,
    amount: 1200.00,
    status: 'completed' as const,
  },
  {
    id: '5',
    date: '2024-01-11',
    description: 'Gasolina',
    category: 'Transporte',
    account: 'Cartão de Débito',
    type: 'expense' as const,
    amount: 120.00,
    status: 'completed' as const,
  },
];

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
 * Formata data para exibição
 */
function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

export default function TransacoesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');

  // Filtrar transações baseado na busca e tipo
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Calcular totais
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpense)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(totalIncome - totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                size="sm"
              >
                Todas
              </Button>
              <Button
                variant={selectedType === 'income' ? 'default' : 'outline'}
                onClick={() => setSelectedType('income')}
                size="sm"
              >
                Receitas
              </Button>
              <Button
                variant={selectedType === 'expense' ? 'default' : 'outline'}
                onClick={() => setSelectedType('expense')}
                size="sm"
              >
                Despesas
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.type === 'income' ? 'default' : 'destructive'}
                    >
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          •••
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}