/**
 * Página de Transações
 * Lista e gerencia todas as transações financeiras
 */

'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, ArrowUpDown, TrendingUp, TrendingDown, DollarSign, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionModal } from '@/components/modals/TransactionModal';
import { useTransactions, useTransactionsSummary } from '@/hooks/useTransactions';
import {
  Transaction,
  TransactionType,
  PaymentMethod,
  TRANSACTION_TYPE_LABELS,
  PAYMENT_METHOD_LABELS
} from '@/lib/types/transactions';

/**
 * Formata valor monetário
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata data
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

/**
 * Obtém cor da badge baseada no tipo
 */
const getTypeColor = (type: TransactionType) => {
  switch (type) {
    case TransactionType.INCOME:
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case TransactionType.EXPENSE:
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case TransactionType.TRANSFER:
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

/**
 * Obtém cor do valor baseada no tipo
 */
const getAmountColor = (type: TransactionType) => {
  switch (type) {
    case TransactionType.INCOME:
      return 'text-green-600 font-semibold';
    case TransactionType.EXPENSE:
      return 'text-red-600 font-semibold';
    case TransactionType.TRANSFER:
      return 'text-blue-600 font-semibold';
    default:
      return 'text-gray-600';
  }
};

export default function TransacoesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  // Hooks para dados
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const { data: summary } = useTransactionsSummary();

  // Filtrar transações baseado na busca e filtro
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  // Usar dados do resumo ou calcular localmente
  const totalIncome = summary?.total_income || 0;
  const totalExpenses = summary?.total_expenses || 0;
  const balance = totalIncome - totalExpenses;

  /**
   * Abre modal para nova transação
   */
  const handleNewTransaction = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  /**
   * Abre modal para editar transação
   */
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  /**
   * Exclui uma transação
   */
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction.mutateAsync(id);
      toast.success('Transação excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação. Tente novamente.');
    }
  };

  /**
   * Fecha o modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando transações...</p>
          </div>
        </div>
      </div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas, despesas e transferências
          </p>
        </div>
        <Button onClick={handleNewTransaction} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de receitas do período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de despesas do período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo atual do período
            </p>
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
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                Todas
              </Button>
              <Button
                variant={filterType === TransactionType.INCOME ? 'default' : 'outline'}
                onClick={() => setFilterType(TransactionType.INCOME)}
                size="sm"
              >
                Receitas
              </Button>
              <Button
                variant={filterType === TransactionType.EXPENSE ? 'default' : 'outline'}
                onClick={() => setFilterType(TransactionType.EXPENSE)}
                size="sm"
              >
                Despesas
              </Button>
              <Button
                variant={filterType === TransactionType.TRANSFER ? 'default' : 'outline'}
                onClick={() => setFilterType(TransactionType.TRANSFER)}
                size="sm"
              >
                Transferências
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.transaction_date)}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category_id}</TableCell>
                  <TableCell>{transaction.account_id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {PAYMENT_METHOD_LABELS[transaction.payment_method]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={getTypeColor(transaction.type)}
                    >
                      {TRANSACTION_TYPE_LABELS[transaction.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getAmountColor(transaction.type)}`}>
                    {transaction.type === TransactionType.EXPENSE ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Transação */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={editingTransaction}
      />
    </div>
  );
}