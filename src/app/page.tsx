'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ContactForm from '@/components/forms/ContactForm';
import { 
  ArrowRight, 
  Building2, 
  Zap, 
  BarChart3, 
  Bot, 
  Database, 
  Shield, 
  Users, 
  Award,
  Mail,
  Phone,
  MapPin,
  CheckCircle
} from 'lucide-react';

/**
 * Landing page institucional da Algoritmum Brasil
 * Apresenta a empresa, sistemas e formulário de contato
 */
export default function Home() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Algoritmum Brasil
              <span className="text-primary block">Tecnologia, Consultoria, Desenvolvimento de Sistemas e IA</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Há 20 anos impulsionando resultados com software, dados e inteligência artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}>
                Fale Conosco
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/sistemas">
                  Conheça Nossos Sistemas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a Empresa */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Sobre a Algoritmum Brasil
            </h2>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Somos uma empresa 100% focada em tecnologia: ajudamos organizações a conceber, 
              construir e escalar produtos digitais, automatizar processos e aplicar IA de ponta a ponta.
            </p>
            
            <div className="grid md:grid-cols-5 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Produtos Digitais</h3>
                  <p className="text-sm text-muted-foreground">
                    Desenvolvimento de aplicações web e mobile
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Database className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Arquitetura & Escalabilidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Soluções robustas e escaláveis
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Bot className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">RPA</h3>
                  <p className="text-sm text-muted-foreground">
                    Automação de processos robotizados
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <BarChart3 className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Data & IA</h3>
                  <p className="text-sm text-muted-foreground">
                    Inteligência artificial e análise de dados
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Cloud/DevOps</h3>
                  <p className="text-sm text-muted-foreground">
                    Infraestrutura e operações na nuvem
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Soluções & Sistemas Próprios */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Soluções & Sistemas Próprios
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conheça nossas soluções desenvolvidas internamente para atender 
                diferentes necessidades do mercado.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Monetrix */}
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <img src="/monetrix-icon.svg" alt="Monetrix" className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-xl">Monetrix</CardTitle>
                  <Badge variant="default" className="w-fit bg-blue-600 hover:bg-blue-700">Disponível</Badge>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base mb-6">
                    Gestão completa de finanças pessoais e empresariais com análises avançadas, 
                    controle de fluxo de caixa e relatórios inteligentes.
                  </CardDescription>
                  <Link href="/sistemas/financeiro">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors">
                      Acessar Sistema
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* RPA Suite */}
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Bot className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">RPA Suite</CardTitle>
                  <Badge variant="secondary">Em Desenvolvimento</Badge>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base mb-6">
                    Automação de processos robóticos para eliminar tarefas repetitivas, 
                    aumentar produtividade e reduzir erros operacionais.
                  </CardDescription>
                  <Button variant="outline" className="w-full" disabled>
                    Em Breve
                  </Button>
                </CardContent>
              </Card>

              {/* Data & IA Workbench */}
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Database className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Data & IA Workbench</CardTitle>
                  <Badge variant="secondary">Em Desenvolvimento</Badge>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base mb-6">
                    Plataforma de análise de dados e inteligência artificial para insights 
                    estratégicos e tomada de decisões baseada em dados.
                  </CardDescription>
                  <Button variant="outline" className="w-full" disabled>
                    Em Breve
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link href="/sistemas">
                <Button variant="outline" size="lg">
                  Ver Todos os Sistemas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clientes Atendidos */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Clientes Atendidos
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Empresas que confiam em nossas soluções para impulsionar seus negócios.
            </p>
            
            {/* Lista de clientes com nomes específicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-center h-16">
                  <h3 className="text-lg font-semibold text-foreground">Dot Digital Group</h3>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-center h-16">
                  <h3 className="text-lg font-semibold text-foreground">BNE — Banco Nacional de Emprego</h3>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-center h-16">
                  <h3 className="text-lg font-semibold text-foreground">Added</h3>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-center h-16">
                  <h3 className="text-lg font-semibold text-foreground">Grupo Boticário</h3>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-center h-16">
                  <h3 className="text-lg font-semibold text-foreground">DMCard</h3>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-center h-16">
                  <h3 className="text-lg font-semibold text-foreground">RDias</h3>
                </div>
              </Card>
              <Card className="p-6 md:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-center h-16">
                  <h3 className="text-lg font-semibold text-foreground">Grupo Júlio Simões</h3>
                </div>
              </Card>
            </div>
            
            <p className="text-sm text-muted-foreground" title="amostra de clientes atendidos no Brasil">
              Amostra de clientes atendidos no Brasil
            </p>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Fale Conosco
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pronto para transformar seu negócio? Entre em contato e descubra como 
                podemos ajudar sua empresa a alcançar novos patamares.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Informações de Contato */}
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-8">Entre em Contato</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground">contato@algoritmumbrasil.com.br</p>
                      <p className="text-muted-foreground">suporte@algoritmumbrasil.com.br</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Telefone</h4>
                      <p className="text-muted-foreground">+55 (11) 9999-9999</p>
                      <p className="text-sm text-muted-foreground">Segunda a Sexta, 9h às 18h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Localização</h4>
                      <p className="text-muted-foreground">São Paulo, SP - Brasil</p>
                      <p className="text-sm text-muted-foreground">Atendimento remoto em todo o país</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulário de Contato */}
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
