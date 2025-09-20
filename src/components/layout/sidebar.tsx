/**
 * Componente Sidebar
 * Navegação lateral da área financeira
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Target,
  Settings,
  PiggyBank,
  Receipt,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Interface para itens de navegação
 */
interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

/**
 * Itens de navegação da sidebar
 */
const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/financas',
    icon: LayoutDashboard,
    description: 'Visão geral das finanças',
  },
  {
    title: 'Transações',
    href: '/financas/transacoes',
    icon: Receipt,
    description: 'Receitas e despesas',
  },
  {
    title: 'Contas',
    href: '/financas/contas',
    icon: CreditCard,
    description: 'Contas bancárias e cartões',
  },
  {
    title: 'Relatórios',
    href: '/financas/relatorios',
    icon: BarChart3,
    description: 'Análises e gráficos',
  },
  {
    title: 'Orçamentos',
    href: '/financas/orcamentos',
    icon: PiggyBank,
    description: 'Planejamento financeiro',
  },
  {
    title: 'Metas',
    href: '/financas/metas',
    icon: Target,
    description: 'Objetivos financeiros',
  },
  {
    title: 'Configurações',
    href: '/financas/configuracoes',
    icon: Settings,
    description: 'Preferências do sistema',
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  /**
   * Função para verificar se o item está ativo
   */
  const isActiveItem = (href: string) => {
    if (href === '/financas') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  /**
   * Componente do item de navegação
   */
  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = isActiveItem(item.href);
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-gray-100 hover:text-gray-900',
          isActive
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-600',
          isCollapsed && 'justify-center px-2'
        )}
        onClick={() => setIsMobileOpen(false)}
      >
        <Icon className={cn('h-5 w-5', isActive && 'text-blue-700')} />
        {!isCollapsed && (
          <span className="truncate">{item.title}</span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
          'lg:static lg:translate-x-0',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header da sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-gray-900">Algoritmum</span>
            </Link>
          )}
          
          {/* Botão de colapsar (desktop) */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          {/* Botão de fechar (mobile) */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </nav>

        {/* Footer da sidebar */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2024 Algoritmum
            </div>
          </div>
        )}
      </div>

      {/* Botão de menu mobile */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}