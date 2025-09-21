import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  BarChart3, 
  Bot, 
  Database, 
  Building2,
  Zap,
  Shield
} from 'lucide-react';

/**
 * Hub de Sistemas da Algoritmum Brasil
 * Lista todos os sistemas disponíveis e em desenvolvimento
 */
export default function SistemasPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Nossos Sistemas
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore nossa suíte completa de soluções empresariais. Sistemas integrados 
              desenvolvidos para otimizar processos e impulsionar resultados.
            </p>
          </div>

          {/* Sistemas Disponíveis */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-8 flex items-center">
              <Zap className="h-6 w-6 text-green-600 mr-3" />
              Sistemas Disponíveis
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Monetrix */}
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <img src="/monetrix-icon.svg" alt="Monetrix" className="h-12 w-12" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">Monetrix</CardTitle>
                    <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                      Ativo
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    Gestão completa de finanças pessoais e empresariais com controle de contas, 
                    transações, metas financeiras e relatórios avançados.
                  </CardDescription>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 mr-2 text-blue-600" />
                      Controle de Contas e Transações
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 mr-2 text-blue-600" />
                      Metas e Planejamento Financeiro
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 mr-2 text-blue-600" />
                      Relatórios e Análises Detalhadas
                    </div>
                  </div>
                  
                  <Link href="/sistemas/financeiro">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group-hover:scale-105 transition-all">
                      Acessar Sistema
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sistemas em Desenvolvimento */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-8 flex items-center">
              <Building2 className="h-6 w-6 text-blue-600 mr-3" />
              Em Desenvolvimento
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* RPA Suite */}
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 opacity-75">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                <CardHeader className="relative">
                  <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                    <Bot className="h-10 w-10 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">RPA Suite</CardTitle>
                    <Badge variant="secondary">
                      Em Breve
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    Automação de processos robóticos para eliminar tarefas repetitivas, 
                    aumentar produtividade e reduzir erros operacionais.
                  </CardDescription>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Bot className="h-4 w-4 mr-2 text-blue-600" />
                      Automação de Processos
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Bot className="h-4 w-4 mr-2 text-blue-600" />
                      Integração com Sistemas Legados
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Bot className="h-4 w-4 mr-2 text-blue-600" />
                      Monitoramento em Tempo Real
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" disabled>
                    Aguarde o Lançamento
                  </Button>
                </CardContent>
              </Card>

              {/* Data & IA Workbench */}
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 opacity-75">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                <CardHeader className="relative">
                  <div className="h-20 w-20 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                    <Database className="h-10 w-10 text-purple-600" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">Data & IA Workbench</CardTitle>
                    <Badge variant="secondary">
                      Em Breve
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    Plataforma de análise de dados e inteligência artificial para insights 
                    estratégicos e tomada de decisões baseada em dados.
                  </CardDescription>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Database className="h-4 w-4 mr-2 text-purple-600" />
                      Análise Avançada de Dados
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Database className="h-4 w-4 mr-2 text-purple-600" />
                      Machine Learning Integrado
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Database className="h-4 w-4 mr-2 text-purple-600" />
                      Dashboards Interativos
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" disabled>
                    Aguarde o Lançamento
                  </Button>
                </CardContent>
              </Card>

              {/* Sistema CRM */}
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 opacity-75">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
                <CardHeader className="relative">
                  <div className="h-20 w-20 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6">
                    <Building2 className="h-10 w-10 text-orange-600" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">Sistema CRM</CardTitle>
                    <Badge variant="secondary">
                      Planejado
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    Gestão completa de relacionamento com clientes, vendas, 
                    pipeline comercial e automação de marketing.
                  </CardDescription>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4 mr-2 text-orange-600" />
                      Gestão de Leads e Oportunidades
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4 mr-2 text-orange-600" />
                      Automação de Marketing
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4 mr-2 text-orange-600" />
                      Relatórios de Vendas
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" disabled>
                    Em Planejamento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Precisa de uma Solução Personalizada?
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Nossa equipe desenvolve sistemas sob medida para atender às necessidades 
                  específicas do seu negócio. Entre em contato e vamos conversar!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" asChild>
                    <a href="/#contato">
                      Solicitar Orçamento
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/">
                      Voltar ao Início
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}