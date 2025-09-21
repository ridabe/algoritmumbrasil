/**
 * Componente de navegação global
 * Inclui menu principal, dropdown de sistemas e toggle de tema
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// First install next-themes:
// npm install next-themes
// or
// yarn add next-themes
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

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
    name: 'Monetrix',
    slug: 'financeiro',
    description: 'Gestão completa de finanças pessoais e empresariais',
    icon: '/monetrix-icon.svg',
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
    label: 'Home',
    href: '/',
    isActive: (pathname) => pathname === '/'
  },
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
    <nav className="bg-background border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/algoritmum-logo.svg" 
              alt="Algoritmum Brasil" 
              className="h-10 w-auto" 
            />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-accent/50 ${
                  isActiveRoute(item)
                    ? 'text-primary bg-primary/10 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
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
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-accent/50 ${
                    pathname.startsWith('/sistemas')
                      ? 'text-primary bg-primary/10 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sistemas
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 p-0 shadow-xl border-0 bg-background opacity-100">
                <div className="p-4 border-b border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Nossos Sistemas Próprios</h3>
                  <p className="text-xs text-muted-foreground">Soluções desenvolvidas internamente</p>
                </div>
                <div className="p-2">
                  {systems.map((system) => (
                    <DropdownMenuItem key={system.slug} asChild className="p-0">
                      {system.status === 'active' ? (
                        <Link
                          href={`/sistemas/${system.slug}`}
                          className="flex items-start space-x-3 p-3 rounded-md hover:bg-accent transition-colors"
                        >
                          {typeof system.icon === 'string' && system.icon.startsWith('/') ? (
                              <img src={system.icon} alt={system.name} className="w-6 h-6" />
                            ) : (
                              <span className="text-2xl">{system.icon}</span>
                            )}
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
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alternar tema</span>
              </Button>
            </div>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {isOpen && (
          <div className="md:hidden border-t border-border/50 bg-background">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActiveRoute(item)
                      ? 'text-primary bg-primary/10 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Sistemas Mobile */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <h3 className="px-4 py-2 text-sm font-semibold text-foreground mb-2">Sistemas</h3>
                <div className="space-y-1">
                  {systems.map((system) => (
                    system.status === 'active' ? (
                      <Link
                        key={system.slug}
                        href={`/sistemas/${system.slug}`}
                        className="flex items-center space-x-3 mx-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {typeof system.icon === 'string' && system.icon.startsWith('/') ? (
                          <img src={system.icon} alt={system.name} className="w-5 h-5" />
                        ) : (
                          <span className="text-lg">{system.icon}</span>
                        )}
                        <div className="flex-1">
                          <span className="font-medium">{system.name}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{system.description}</p>
                        </div>
                      </Link>
                    ) : (
                      <div
                        key={system.slug}
                        className="flex items-center space-x-3 mx-2 px-4 py-3 text-sm text-muted-foreground opacity-50 cursor-not-allowed rounded-lg"
                      >
                        <span className="text-lg">{system.icon}</span>
                        <div className="flex-1">
                          <span className="font-medium">{system.name}</span>
                          <p className="text-xs text-amber-600 mt-0.5">Em desenvolvimento</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}