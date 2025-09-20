/**
 * Componente Header
 * Cabeçalho da área financeira com informações do usuário
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

/**
 * Interface para dados do usuário
 */
interface UserData {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

/**
 * Interface para resumo financeiro
 */
interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  pendingTransactions: number;
}

export function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    pendingTransactions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  /**
   * Função para carregar dados do usuário
   */
  const loadUserData = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Erro ao carregar usuário:', error);
        return;
      }

      if (user) {
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
          avatar_url: user.user_metadata?.avatar_url,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Função para carregar resumo financeiro real do banco de dados
   */
  const loadFinancialSummary = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Usuário não autenticado:', authError);
        return;
      }

      // Buscar saldo total das contas
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('initial_balance, type')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (accountsError) {
        console.error('Erro ao buscar contas:', accountsError);
        return;
      }

      // Calcular saldo total das contas (excluindo cartões de crédito)
      const totalBalance = (accounts || []).reduce((sum, account) => {
        // Para cartões de crédito, o saldo negativo representa dívida
        if (account.type === 'credit_card') {
          return sum; // Não incluir cartões de crédito no saldo total
        }
        return sum + (account.initial_balance || 0);
      }, 0);

      // Buscar receitas e despesas do mês atual
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
      const { data: receitas } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'income')
        .gte('date', `${currentMonth}-01`)
        .lt('date', `${currentMonth}-32`);

      const { data: despesas } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', `${currentMonth}-01`)
        .lt('date', `${currentMonth}-32`);

      // Contar transações pendentes
      const { count: pendingCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending');

      const monthlyIncome = (receitas || []).reduce((sum, t) => sum + t.amount, 0);
      const monthlyExpenses = (despesas || []).reduce((sum, t) => sum + t.amount, 0);

      setFinancialSummary({
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        pendingTransactions: pendingCount || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar resumo financeiro:', error);
      // Em caso de erro, manter valores zerados
      setFinancialSummary({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        pendingTransactions: 0,
      });
    }
  };

  /**
   * Função para fazer logout
   */
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Erro ao fazer logout', {
          description: error.message,
        });
        return;
      }

      toast.success('Logout realizado com sucesso!');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Erro inesperado', {
        description: 'Tente novamente em alguns instantes.',
      });
    }
  };

  /**
   * Função para obter as iniciais do nome
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Função para formatar valores monetários
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadUserData();
    loadFinancialSummary();
  }, []);

  if (isLoading) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Resumo financeiro */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Saldo Total</p>
              <p className="font-semibold text-lg">
                {formatCurrency(financialSummary.totalBalance)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Receitas do Mês</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(financialSummary.monthlyIncome)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Despesas do Mês</p>
              <p className="font-semibold text-red-600">
                {formatCurrency(financialSummary.monthlyExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Área de ações */}
        <div className="flex items-center space-x-4">
          {/* Busca */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar transações..."
              className="pl-10 w-64"
            />
          </div>

          {/* Notificações */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {financialSummary.pendingTransactions > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {financialSummary.pendingTransactions}
              </Badge>
            )}
          </Button>

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar_url} alt={user?.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/financas/perfil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/financas/configuracoes')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}