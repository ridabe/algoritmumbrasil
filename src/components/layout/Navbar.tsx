/**
 * Componente de navegação global
 * Inclui menu principal, dropdown de sistemas e toggle de tema
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Sun, Moon, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

interface NavItem {
  label: string;
  href: string;
  isActive?: (pathname: string) => boolean;
}

interface SystemItem {
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
}

/**
 * Lista de sistemas disponíveis
 */
const systems: SystemItem[] = [
  {
    name: 'Sistema Financeiro',
    slug: 'financeiro',
    description: 'Gestão completa de finanças pessoais e empresariais',
    icon: '💰',
    status: 'active'
  },
  {
    name: 'RPA Suite',
    slug: 'rpa',
    description: 'Automação de processos robóticos',
    icon: '🤖',
    status: 'inactive'
  },
  {
    name: 'Data & IA Workbench',
    slug: 'data-ia',
    description: 'Plataforma de análise de dados e inteligência artificial',
    icon: '📊',
    status: 'inactive'
  }
];

/**
 * Itens do menu principal
 */
const navItems: NavItem[] = [
  {
    label: 'Sobre a Empresa',
    href: '/sobre',
    isActive: (pathname) => pathname === '/sobre'
  },
  {
    label: 'Fale Conosco',
    href: '/#contato',
    isActive: () => false
  }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  /**
   * Verifica se uma rota está ativa
   */
  const isActiveRoute = (item: NavItem): boolean => {
    if (item.isActive) {
      return item.isActive(pathname);
    }
    return pathname === item.href;
  };

  /**
   * Alterna o tema entre claro e escuro
   */
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-foreground">Algoritmum Brasil</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActiveRoute(item)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Dropdown Sistemas */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.startsWith('/sistemas')
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-muted-foreground'
                  }`}
                >
                  Sistemas
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <p className="text-sm text-muted-foreground mb-3">Nossos Sistemas Próprios</p>
                  {systems.map((system) => (
                    <DropdownMenuItem key={system.slug} asChild className="p-0">
                      {system.status === 'active' ? (
                        <Link
                          href={`/sistemas/${system.slug}`}
                          className="flex items-start space-x-3 p-3 rounded-md hover:bg-accent transition-colors"
                        >
                          <span className="text-2xl">{system.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{system.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{system.description}</p>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-start space-x-3 p-3 rounded-md opacity-50 cursor-not-allowed">
                          <span className="text-2xl">{system.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{system.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{system.description}</p>
                            <p className="text-xs text-amber-600 mt-1">Em desenvolvimento</p>
                          </div>
                        </div>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Toggle Tema */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActiveRoute(item)
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground hover:text-primary hover:bg-accent'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Sistemas Mobile */}
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-foreground mb-2">Sistemas</p>
                {systems.map((system) => (
                  system.status === 'active' ? (
                    <Link
                      key={system.slug}
                      href={`/sistemas/${system.slug}`}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{system.icon}</span>
                      <span>{system.name}</span>
                    </Link>
                  ) : (
                    <div
                      key={system.slug}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed"
                    >
                      <span>{system.icon}</span>
                      <span>{system.name}</span>
                      <span className="text-xs text-amber-600">(Em desenvolvimento)</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}