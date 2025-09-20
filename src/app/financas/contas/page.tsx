/**
 * Página de Contas
 * Gerencia contas bancárias, cartões e investimentos
 */

'use client';

import { useState } from 'react';
import { Plus, CreditCard, Building2, PiggyBank, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Dados mockados para demonstração
const mockAccounts = [
  {
    id: '1',
    name: 'Conta Corrente Principal',
    type: 'checking' as const,
    bank: 'Banco do Brasil',
    balance: 2500.75,
    currency: 'BRL',
    isActive: true,
    lastTransaction: '2024-01-15',
  },
  {
    id: '2',
    name: 'Poupança',
    type: 'savings' as const,
    bank: 'Caixa Econômica',
    balance: 15000.00,
    currency: 'BRL',
    isActive: true,
    lastTransaction: '2024-01-10',
  },
  {
    id: '3',
    name: 'Cartão de Crédito Nubank',
    type: 'credit_card' as const,
    bank: 'Nubank',
    balance: -850.30,
    limit: 5000.00,
    currency: 'BRL',
    isActive: true,
    lastTransaction: '2024-01-14',
  },
  {
    id: '4',
    name: 'Investimentos CDB',
    type: 'investment' as const,
    bank: 'XP Investimentos',
    balance: 25000.00,
    currency: 'BRL',
    isActive: true,
    lastTransaction: '2024-01-01',
  },
  {
    id: '5',
    name: 'Conta Antiga',
    type: 'checking' as const,
    bank: 'Banco Antigo',
    balance: 0.00,
    currency: 'BRL',
    isActive: false,
    lastTransaction: '2023-12-15',
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

/**
 * Retorna ícone baseado no tipo de conta
 */
function getAccountIcon(type: string) {
  switch (type) {
    case 'checking':
      return <Building2 className="h-5 w-5" />;
    case 'savings':
      return <PiggyBank className="h-5 w-5" />;
    case 'credit_card':
      return <CreditCard className="h-5 w-5" />;
    case 'investment':
      return <PiggyBank className="h-5 w-5" />;
    default:
      return <Building2 className="h-5 w-5" />;
  }
}

/**
 * Retorna nome amigável do tipo de conta
 */
function getAccountTypeName(type: string): string {
  switch (type) {
    case 'checking':
      return 'Conta Corrente';
    case 'savings':
      return 'Poupança';
    case 'credit_card':
      return 'Cartão de Crédito';
    case 'investment':
      return 'Investimento';
    default:
      return 'Conta';
  }
}

export default function ContasPage() {
  const [showBalances, setShowBalances] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'checking' | 'savings' | 'credit_card' | 'investment'>('all');

  // Filtrar contas por tipo
  const filteredAccounts = mockAccounts.filter(account => {
    if (selectedType === 'all') return true;
    return account.type === selectedType;
  });

  // Calcular totais
  const totalBalance = mockAccounts
    .filter(account => account.isActive && account.type !== 'credit_card')
    .reduce((sum, account) => sum + account.balance, 0);

  const totalDebt = mockAccounts
    .filter(account => account.isActive && account.type === 'credit_card')
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);

  const netWorth = totalBalance - totalDebt;

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
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Conta
          </Button>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {showBalances ? formatCurrency(totalBalance) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as contas ativas
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
              {showBalances ? formatCurrency(totalDebt) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma dos cartões de crédito
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio Líquido</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              netWorth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {showBalances ? formatCurrency(netWorth) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Patrimônio menos dívidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedType('all')}
          size="sm"
        >
          Todas
        </Button>
        <Button
          variant={selectedType === 'checking' ? 'default' : 'outline'}
          onClick={() => setSelectedType('checking')}
          size="sm"
        >
          Conta Corrente
        </Button>
        <Button
          variant={selectedType === 'savings' ? 'default' : 'outline'}
          onClick={() => setSelectedType('savings')}
          size="sm"
        >
          Poupança
        </Button>
        <Button
          variant={selectedType === 'credit_card' ? 'default' : 'outline'}
          onClick={() => setSelectedType('credit_card')}
          size="sm"
        >
          Cartão de Crédito
        </Button>
        <Button
          variant={selectedType === 'investment' ? 'default' : 'outline'}
          onClick={() => setSelectedType('investment')}
          size="sm"
        >
          Investimentos
        </Button>
      </div>

      {/* Lista de Contas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAccounts.map((account) => (
          <Card key={account.id} className={`${!account.isActive ? 'opacity-60' : ''}`}>
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
                    •••
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {getAccountTypeName(account.type)}
                  </Badge>
                  <Badge variant={account.isActive ? 'default' : 'secondary'}>
                    {account.isActive ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${
                    account.type === 'credit_card' 
                      ? account.balance < 0 ? 'text-red-600' : 'text-green-600'
                      : account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {showBalances ? formatCurrency(account.balance) : '••••••'}
                  </div>
                  
                  {account.type === 'credit_card' && account.limit && (
                    <p className="text-xs text-muted-foreground">
                      Limite: {showBalances ? formatCurrency(account.limit) : '••••••'}
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Última movimentação: {formatDate(account.lastTransaction)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card para adicionar nova conta */}
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Plus className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="font-medium text-muted-foreground">Adicionar Nova Conta</h3>
          <p className="text-sm text-muted-foreground text-center">
            Conecte uma nova conta bancária, cartão ou investimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}