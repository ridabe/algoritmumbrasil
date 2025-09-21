/**
 * Layout da área financeira
 * Inclui sidebar, header e área de conteúdo principal
 */

import { Metadata } from 'next';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'Finanças | Algoritmum',
  description: 'Gerencie suas finanças pessoais de forma inteligente',
};

interface FinancasLayoutProps {
  children: React.ReactNode;
}

export default function FinancasLayout({ children }: FinancasLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Área principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Conteúdo */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}