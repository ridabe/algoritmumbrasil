/**
 * Página de Contas
 * Gerencia contas bancárias, cartões e investimentos
 */

'use client';

import { useState } from 'react';
import { Plus, CreditCard, Building2, PiggyBank, Eye, EyeOff, Edit, Trash2, AlertCircle, Search, MoreHorizontal, Wallet, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccounts } from '@/hooks/useAccounts';
import { AccountType, AccountStatus, Currency } from '@/lib/types/accounts';
import { AccountModal } from '@/components/modals/AccountModal';
import { toast } from 'sonner';
import type { AccountFilters } from '@/lib/types/accounts';

// Dados mockados para cartões (temporário até implementar no Supabase)
const mockCards = [
  {
    id: '1',
    name: 'Cartão Visa Gold',
    bank: 'Banco do Brasil',
    limit: 5000.00,
    used: 1250.75,
    available: 3749.25,
    dueDate: '2024-02-10',
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Cartão Mastercard Black',
    bank: 'Itaú',
    limit: 15000.00,
    used: 3200.50,
    available: 11799.50,
    dueDate: '2024-02-15',
    status: 'active' as const
  }
];

const mockInvestments = [
  {
    id: '1',
    name: 'Tesouro Selic 2029',
    type: 'Renda Fixa',
    value: 15000.00,
    profitability: 12.5,
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Fundo Multimercado',
    type: 'Fundo',
    value: 30000.00,
    profitability: 18.2,
    status: 'active' as const
  }
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

/**
 * Retorna ícone baseado no tipo de conta
 */
function getAccountIcon(type: AccountType) {
  switch (type) {
    case AccountType.CHECKING:
      return <Building2 className="h-5 w-5 text-blue-600" />;
    case AccountType.SAVINGS:
      return <Wallet className="h-5 w-5 text-green-600" />;
    case AccountType.CREDIT_CARD:
      return <CreditCard className="h-5 w-5 text-red-600" />;
    case AccountType.INVESTMENT:
      return <TrendingUp className="h-5 w-5 text-purple-600" />;
    default:
      return <Building2 className="h-5 w-5 text-gray-600" />;
  }
}

/**
 * Retorna nome amigável do tipo de conta
 */
function getAccountTypeName(type: AccountType): string {
  switch (type) {
    case AccountType.CHECKING:
      return 'Conta Corrente';
    case AccountType.SAVINGS:
      return 'Poupança';
    case AccountType.CREDIT_CARD:
      return 'Cartão de Crédito';
    case AccountType.INVESTMENT:
      return 'Investimento';
    default:
      return 'Conta';
  }
}

/**
 * Retorna label do status da conta
 */
function getStatusLabel(status: AccountStatus): string {
  switch (status) {
    case AccountStatus.ACTIVE:
      return 'Ativa';
    case AccountStatus.INACTIVE:
      return 'Inativa';
    case AccountStatus.BLOCKED:
      return 'Bloqueada';
    default:
      return 'Desconhecido';
  }
}

export default function ContasPage() {
  const [showBalances, setShowBalances] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | AccountType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  // Simular usuário logado para teste
  const mockUser = { id: 'test-user', email: 'test@example.com' };

  // Hook para gerenciar contas
  const {
    accounts,
    summary,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    clearError
  } = useAccounts();

  // Handlers para o modal
  const handleCreateAccount = () => {
    setEditingAccount(null);
    setIsAccountModalOpen(true);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        await deleteAccount(accountId);
        toast.success('Conta excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir conta');
      }
    }
  };



  // Filtrar contas por tipo e busca
  const filteredAccounts = accounts.filter(account => {
    const matchesType = selectedType === 'all' || account.type === selectedType;
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bank.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Usar dados do resumo financeiro ou calcular localmente
  const totalBalance = summary?.total_assets || 0;
  const totalDebt = summary?.total_debts || 0;
  const netWorth = summary?.net_worth || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas bancárias, cartões e investimentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center gap-2"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBalances ? 'Ocultar Saldos' : 'Mostrar Saldos'}
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleCreateAccount}
          >
            <Plus className="h-4 w-4" />
            Nova Conta
          </Button>
        </div>
      </div>

      {/* Exibir erro se houver */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio Líquido</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              netWorth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {loading ? '...' : showBalances ? formatCurrency(netWorth) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Ativos - Passivos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Contas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? '...' : showBalances ? formatCurrency(totalBalance) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Conta corrente + Poupança + Investimentos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dívidas Totais</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loading ? '...' : showBalances ? formatCurrency(totalDebt) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Cartões de crédito
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : summary?.active_accounts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              de {accounts.length} contas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar contas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedType} onValueChange={(value) => setSelectedType(value as 'all' | AccountType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as contas</SelectItem>
            <SelectItem value={AccountType.CHECKING}>Conta Corrente</SelectItem>
            <SelectItem value={AccountType.SAVINGS}>Poupança</SelectItem>
            <SelectItem value={AccountType.CREDIT_CARD}>Cartão de Crédito</SelectItem>
            <SelectItem value={AccountType.INVESTMENT}>Investimentos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Contas */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Carregando contas...</div>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              {searchTerm ? 'Nenhuma conta encontrada com os filtros aplicados.' : 'Nenhuma conta cadastrada.'}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className={`${account.status !== AccountStatus.ACTIVE ? 'opacity-60' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    {getAccountIcon(account.type)}
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {account.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {account.bank}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditAccount(account)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {getAccountTypeName(account.type)}
                      </Badge>
                      <Badge variant={account.status === AccountStatus.ACTIVE ? 'default' : 'secondary'}>
                        {getStatusLabel(account.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className={`text-2xl font-bold ${
                        account.type === AccountType.CREDIT_CARD 
                          ? account.balance < 0 ? 'text-red-600' : 'text-green-600'
                          : account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {showBalances ? formatCurrency(account.balance) : '••••••'}
                      </div>
                      
                      {account.type === AccountType.CREDIT_CARD && account.limit && (
                        <p className="text-xs text-muted-foreground">
                          Limite: {showBalances ? formatCurrency(account.limit) : '••••••'}
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Última movimentação: {account.last_transaction_date ? formatDate(account.last_transaction_date) : 'Sem transações'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Card para adicionar nova conta */}
      <Card 
        className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={handleCreateAccount}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Plus className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="font-medium text-muted-foreground">Adicionar Nova Conta</h3>
          <p className="text-sm text-muted-foreground text-center">
            Conecte uma nova conta bancária, cartão ou investimento
          </p>
        </CardContent>
      </Card>

      {/* Modal de Conta */}
       <AccountModal
         open={isAccountModalOpen}
         onOpenChange={(open) => {
           setIsAccountModalOpen(open);
           if (!open) {
             setEditingAccount(null);
           }
         }}
         account={editingAccount}
       />
    </div>
  );
}