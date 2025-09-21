'use client';

import Link from 'next/link';
import React from 'react';
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
  CheckCircle,
  MessageCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * Landing page institucional da Algoritmum Brasil
 * Apresenta a empresa, sistemas e formulário de contato
 */
export default function Home() {
  // Função para controlar o carrossel
  const initCarousel = () => {
    if (typeof window !== 'undefined') {
      let currentSlide = 0;
      const slides = document.querySelectorAll('.carousel-slide');
      const indicators = document.querySelectorAll('.carousel-indicator');
      const totalSlides = slides.length;
      
      // Função para mostrar slide específico
      const showSlide = (index: number) => {
        slides.forEach((slide, i) => {
          (slide as HTMLElement).style.opacity = i === index ? '1' : '0';
        });
        indicators.forEach((indicator, i) => {
          indicator.classList.toggle('active', i === index);
          (indicator as HTMLElement).style.backgroundColor = i === index ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)';
        });
      };
      
      // Navegação automática
      const autoSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
      };
      
      // Iniciar carrossel automático
      const interval = setInterval(autoSlide, 5000);
      
      // Navegação manual - setas
      const prevBtn = document.querySelector('.carousel-prev');
      const nextBtn = document.querySelector('.carousel-next');
      
      prevBtn?.addEventListener('click', () => {
        clearInterval(interval);
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
        setTimeout(() => setInterval(autoSlide, 5000), 1000);
      });
      
      nextBtn?.addEventListener('click', () => {
        clearInterval(interval);
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
        setTimeout(() => setInterval(autoSlide, 5000), 1000);
      });
      
      // Navegação manual - indicadores
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          clearInterval(interval);
          currentSlide = index;
          showSlide(currentSlide);
          setTimeout(() => setInterval(autoSlide, 5000), 1000);
        });
      });
    }
  };
  
  // Inicializar carrossel quando componente montar
  React.useEffect(() => {
    const timer = setTimeout(initCarousel, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 flex items-center justify-center overflow-hidden min-h-[90vh]">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-secondary/8"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Enhanced Banner Carrossel */}
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-border/20 backdrop-blur-sm">
            <div className="carousel-container relative w-full h-full">
              {/* Slide 1 - Sistemas Próprios */}
              <div className="carousel-slide absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-between px-12 opacity-100 transition-opacity duration-1000">
                <div className="text-white max-w-2xl">
                  <h2 className="text-5xl font-bold mb-6">Sistemas Próprios</h2>
                  <p className="text-xl mb-8 opacity-90">Desenvolvemos soluções completas e personalizadas para otimizar seus processos empresariais com tecnologia de ponta.</p>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                    <Link href="/sistemas">
                      <Building2 className="mr-2 h-5 w-5" />
                      Conheça Nossos Sistemas
                    </Link>
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-96 h-96 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Building2 className="w-48 h-48 text-white/80" />
                  </div>
                </div>
              </div>
              
              {/* Slide 2 - Consultoria */}
              <div className="carousel-slide absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-between px-12 opacity-0 transition-opacity duration-1000">
                <div className="text-white max-w-2xl">
                  <h2 className="text-5xl font-bold mb-6">Consultoria Especializada</h2>
                  <p className="text-xl mb-8 opacity-90">Nossa equipe de especialistas oferece consultoria estratégica para transformar digitalmente seu negócio.</p>
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                    <Link href="/sobre">
                      <Users className="mr-2 h-5 w-5" />
                      Saiba Mais
                    </Link>
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-96 h-96 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-48 h-48 text-white/80" />
                  </div>
                </div>
              </div>
              
              {/* Slide 3 - Inovação */}
              <div className="carousel-slide absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-between px-12 opacity-0 transition-opacity duration-1000">
                <div className="text-white max-w-2xl">
                  <h2 className="text-5xl font-bold mb-6">Inovação & Tecnologia</h2>
                  <p className="text-xl mb-8 opacity-90">Utilizamos as mais modernas tecnologias para criar soluções inovadoras que impulsionam o crescimento.</p>
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    <Zap className="mr-2 h-5 w-5" />
                    Descubra Mais
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-96 h-96 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Zap className="w-48 h-48 text-white/80" />
                  </div>
                </div>
              </div>
              
              {/* Slide 4 - Segurança */}
              <div className="carousel-slide absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-between px-12 opacity-0 transition-opacity duration-1000">
                <div className="text-white max-w-2xl">
                  <h2 className="text-5xl font-bold mb-6">Segurança & Confiabilidade</h2>
                  <p className="text-xl mb-8 opacity-90">Garantimos a máxima segurança dos seus dados com protocolos avançados e infraestrutura robusta.</p>
                  <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                    <Shield className="mr-2 h-5 w-5" />
                    Conheça Nossa Segurança
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-96 h-96 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Shield className="w-48 h-48 text-white/80" />
                  </div>
                </div>
              </div>
              
              {/* Slide 5 - Suporte */}
              <div className="carousel-slide absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-between px-12 opacity-0 transition-opacity duration-1000">
                <div className="text-white max-w-2xl">
                  <h2 className="text-5xl font-bold mb-6">Suporte Especializado</h2>
                  <p className="text-xl mb-8 opacity-90">Oferecemos suporte técnico completo e treinamento para garantir o máximo aproveitamento das nossas soluções.</p>
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Entre em Contato
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-96 h-96 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MessageCircle className="w-48 h-48 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indicadores */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <button className="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300 active" data-slide="0"></button>
              <button className="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300" data-slide="1"></button>
              <button className="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300" data-slide="2"></button>
              <button className="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300" data-slide="3"></button>
              <button className="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300" data-slide="4"></button>
            </div>
            
            {/* Setas de navegação */}
            <button className="carousel-prev absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button className="carousel-next absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Enhanced Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-3">20+</div>
                  <div className="text-muted-foreground font-medium">Anos de Experiência</div>
                  <div className="text-sm text-muted-foreground/80 mt-2">Soluções comprovadas</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent mb-3">100+</div>
                  <div className="text-muted-foreground font-medium">Projetos Entregues</div>
                  <div className="text-sm text-muted-foreground/80 mt-2">Clientes satisfeitos</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-3">24/7</div>
                  <div className="text-muted-foreground font-medium">Suporte Técnico</div>
                  <div className="text-sm text-muted-foreground/80 mt-2">Sempre disponível</div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Sobre a Empresa - Enhanced */}
      <section className="py-32 bg-gradient-to-b from-background via-accent/10 to-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-semibold mb-8 border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                💼 Nossos Serviços
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent leading-tight">
                Transformação Digital
                <br className="hidden md:block" />
                <span className="text-primary">Completa</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed font-light">
                Oferecemos soluções tecnológicas de ponta para impulsionar o crescimento do seu negócio.
                <br className="hidden md:block" />
                <span className="text-primary/80 font-medium">Da concepção à implementação</span>, estamos com você em cada etapa da jornada digital.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Produtos Digitais */}
              <Card className="group p-10 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card hover:to-card/90 hover:-translate-y-3 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:from-blue-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="p-5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl mr-5 group-hover:from-blue-500/30 group-hover:to-blue-600/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Building2 className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">Produtos Digitais</h3>
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    Criamos experiências digitais excepcionais que conectam sua marca aos clientes de forma inovadora e eficiente.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Aplicações Web Responsivas</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Apps Mobile Nativos</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Progressive Web Apps</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">E-commerce Personalizado</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Arquitetura */}
              <Card className="group p-10 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card hover:to-card/90 hover:-translate-y-3 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="p-5 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-3xl mr-5 group-hover:from-purple-500/30 group-hover:to-purple-600/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Database className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">Arquitetura</h3>
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    Projetamos arquiteturas robustas e escaláveis que suportam o crescimento sustentável do seu negócio.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Microserviços Escaláveis</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">APIs RESTful e GraphQL</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Arquitetura Serverless</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Integração de Sistemas</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* RPA */}
              <Card className="group p-10 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card hover:to-card/90 hover:-translate-y-3 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:from-green-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="p-5 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-3xl mr-5 group-hover:from-green-500/30 group-hover:to-green-600/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Bot className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-green-600 transition-colors duration-300">RPA & Automação</h3>
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    Automatizamos processos complexos para maximizar eficiência e liberar sua equipe para atividades estratégicas.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Automação Inteligente</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Integração de Sistemas</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Processamento de Documentos</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Workflows Personalizados</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Data & IA */}
              <Card className="group p-10 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card hover:to-card/90 hover:-translate-y-3 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:from-orange-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="p-5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-3xl mr-5 group-hover:from-orange-500/30 group-hover:to-orange-600/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <BarChart3 className="h-10 w-10 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-orange-600 transition-colors duration-300">Data & IA</h3>
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    Transformamos dados em insights valiosos usando inteligência artificial para decisões mais inteligentes.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Machine Learning Avançado</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Análise Preditiva</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Business Intelligence</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Data Warehousing</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Cloud & DevOps */}
              <Card className="group p-10 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card hover:to-card/90 hover:-translate-y-3 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl group-hover:from-cyan-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="p-5 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-3xl mr-5 group-hover:from-cyan-500/30 group-hover:to-cyan-600/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Shield className="h-10 w-10 text-cyan-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-cyan-600 transition-colors duration-300">Cloud & DevOps</h3>
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    Aceleramos sua transformação digital com infraestrutura em nuvem e práticas DevOps modernas.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">AWS, Azure, Google Cloud</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">CI/CD Pipelines</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Containerização Docker/K8s</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Monitoramento Avançado</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Consultoria */}
              <Card className="group p-10 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card hover:to-card/90 hover:-translate-y-3 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl group-hover:from-indigo-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="p-5 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-3xl mr-5 group-hover:from-indigo-500/30 group-hover:to-indigo-600/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Users className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-indigo-600 transition-colors duration-300">Consultoria</h3>
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    Orientamos sua estratégia tecnológica com expertise comprovada para maximizar o retorno dos investimentos.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Estratégia Digital</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Auditoria Tecnológica</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Gestão de Projetos</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium">Treinamento de Equipes</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Soluções & Sistemas Próprios - Enhanced */}
      <section className="py-32 bg-gradient-to-b from-accent/20 via-background to-primary/5 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary rounded-full text-sm font-semibold mb-8 border border-primary/20 backdrop-blur-sm">
                🎯 Nossos Produtos
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Sistemas Proprietários
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed">
                Desenvolvemos soluções completas e inovadoras que atendem às necessidades específicas do mercado brasileiro, 
                combinando tecnologia de ponta com profundo conhecimento do negócio.
              </p>
            </div>

            <div className="max-w-6xl mx-auto mb-20">
              {/* Monetrix - Featured */}
              <Card className="group p-12 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/90 via-card/70 to-primary/10 backdrop-blur-sm hover:from-card hover:via-card/80 hover:to-primary/20 hover:border-primary/30 hover:-translate-y-2 relative overflow-hidden">
                {/* Enhanced Background decorations */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl group-hover:from-primary/25 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl group-hover:from-secondary/25 transition-all duration-500"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl group-hover:from-green-500/10 transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
                    <div className="flex-shrink-0">
                      <div className="p-8 bg-gradient-to-br from-primary/25 to-primary/35 rounded-3xl group-hover:from-primary/35 group-hover:to-primary/45 group-hover:scale-110 transition-all duration-500 shadow-xl">
                        <img src="/monetrix-icon.svg" alt="Monetrix" className="h-20 w-20" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-6">
                        <h3 className="text-4xl md:text-5xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">Monetrix</h3>
                        <p className="text-primary font-bold text-xl mb-3">Sistema de Gestão Financeira Empresarial</p>
                        <Badge variant="default" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-4 py-2 text-sm">✅ Disponível</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-8 leading-relaxed text-xl">
                        Plataforma completa e intuitiva para gestão financeira empresarial, oferecendo controle total sobre 
                        fluxo de caixa, relatórios gerenciais avançados e integração nativa com os principais bancos brasileiros. 
                        Desenvolvido especificamente para as necessidades do mercado nacional.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:from-primary/15 hover:to-primary/10 hover:border-primary/30 transition-all duration-300 group/tag">
                          <div className="w-3 h-3 bg-gradient-to-r from-primary to-blue-600 rounded-full group-hover/tag:scale-125 transition-transform duration-300"></div>
                          <span className="text-sm font-semibold text-foreground">Gestão Financeira</span>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:from-primary/15 hover:to-primary/10 hover:border-primary/30 transition-all duration-300 group/tag">
                          <div className="w-3 h-3 bg-gradient-to-r from-primary to-blue-600 rounded-full group-hover/tag:scale-125 transition-transform duration-300"></div>
                          <span className="text-sm font-semibold text-foreground">Fluxo de Caixa</span>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:from-primary/15 hover:to-primary/10 hover:border-primary/30 transition-all duration-300 group/tag">
                          <div className="w-3 h-3 bg-gradient-to-r from-primary to-blue-600 rounded-full group-hover/tag:scale-125 transition-transform duration-300"></div>
                          <span className="text-sm font-semibold text-foreground">Relatórios BI</span>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:from-primary/15 hover:to-primary/10 hover:border-primary/30 transition-all duration-300 group/tag">
                          <div className="w-3 h-3 bg-gradient-to-r from-primary to-blue-600 rounded-full group-hover/tag:scale-125 transition-transform duration-300"></div>
                          <span className="text-sm font-semibold text-foreground">Open Banking</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-6">
                        <Button size="lg" className="text-xl px-10 py-7 rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-primary hover:from-primary/90 hover:via-blue-600/90 hover:to-primary/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 font-semibold" asChild>
                          <Link href="/sistemas/financeiro">
                            <Building2 className="mr-4 h-6 w-6" />
                            Conhecer o Sistema
                          </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="text-xl px-10 py-7 rounded-2xl border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 transition-all duration-500 font-semibold" asChild>
                          <Link href="/demo/monetrix">
                            <ArrowRight className="mr-4 h-6 w-6" />
                            Demonstração Online
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Additional features section */}
                  <div className="mt-12 pt-10 border-t border-gradient-to-r from-transparent via-border/50 to-transparent">
                    <h4 className="text-2xl font-bold mb-8 text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Principais Funcionalidades</h4>
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl border border-green-500/20 hover:from-green-500/15 hover:to-green-600/10 hover:border-green-500/30 transition-all duration-300 group/feature">
                        <div className="p-3 bg-gradient-to-br from-green-500/25 to-green-600/25 rounded-xl group-hover/feature:scale-110 transition-transform duration-300">
                          <BarChart3 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h5 className="font-bold text-foreground mb-2 text-lg">Dashboard Executivo</h5>
                          <p className="text-muted-foreground leading-relaxed">Visão completa da saúde financeira em tempo real</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl border border-blue-500/20 hover:from-blue-500/15 hover:to-blue-600/10 hover:border-blue-500/30 transition-all duration-300 group/feature">
                        <div className="p-3 bg-gradient-to-br from-blue-500/25 to-blue-600/25 rounded-xl group-hover/feature:scale-110 transition-transform duration-300">
                          <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-bold text-foreground mb-2 text-lg">Segurança Bancária</h5>
                          <p className="text-muted-foreground leading-relaxed">Criptografia de nível bancário e compliance</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl border border-purple-500/20 hover:from-purple-500/15 hover:to-purple-600/10 hover:border-purple-500/30 transition-all duration-300 group/feature">
                        <div className="p-3 bg-gradient-to-br from-purple-500/25 to-purple-600/25 rounded-xl group-hover/feature:scale-110 transition-transform duration-300">
                          <Zap className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h5 className="font-bold text-foreground mb-2 text-lg">Automação Inteligente</h5>
                          <p className="text-muted-foreground leading-relaxed">Conciliação automática e alertas personalizados</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Other Systems - Enhanced */}
            <div className="grid md:grid-cols-2 gap-10 mb-16">
              {/* RPA Suite */}
              <Card className="group p-10 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:from-card hover:to-card/90 hover:-translate-y-3 hover:border-green-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:from-green-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="p-5 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-3xl mr-5 group-hover:from-green-500/30 group-hover:to-green-600/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Bot className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-green-600 transition-colors duration-300">RPA Suite</h3>
                      <Badge variant="secondary" className="mt-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-500/30 font-semibold">🚧 Em Desenvolvimento</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    Automação de processos robóticos para eliminar tarefas repetitivas, 
                    aumentar produtividade e reduzir erros operacionais.
                  </p>
                </div>
                <Button variant="outline" className="w-full text-lg py-4 rounded-xl border-2 hover:bg-green-500/10 hover:border-green-500/50 hover:scale-105 transition-all duration-300 shadow-lg" disabled>
                  🚀 Em Breve
                </Button>
              </Card>

              {/* Data & IA Workbench */}
              <Card className="group p-10 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:from-card hover:to-card/90 hover:-translate-y-3 hover:border-purple-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="p-5 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-3xl mr-5 group-hover:from-purple-500/30 group-hover:to-purple-600/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Database className="h-10 w-10 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">Data & IA Workbench</h3>
                      <Badge variant="secondary" className="mt-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-500/30 font-semibold">🚧 Em Desenvolvimento</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    Plataforma de análise de dados e inteligência artificial para insights 
                    estratégicos e tomada de decisões baseada em dados.
                  </p>
                </div>
                <Button variant="outline" className="w-full text-lg py-4 rounded-xl border-2 hover:bg-purple-500/10 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 shadow-lg" disabled>
                  🚀 Em Breve
                </Button>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/sistemas">
                <Button variant="outline" size="lg" className="text-xl px-12 py-8 rounded-2xl border-2 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 hover:shadow-2xl transition-all duration-500 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm font-semibold">
                  Ver Todos os Sistemas
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clientes Atendidos - Enhanced */}
      <section className="py-32 bg-gradient-to-b from-muted/20 via-muted/30 to-muted/20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Clientes Atendidos
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed">
              Empresas que confiam em nossas soluções para impulsionar seus negócios.
            </p>
            
            {/* Lista de clientes com nomes específicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Card className="group p-8 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:from-card hover:to-card/90 hover:-translate-y-2 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-center h-20 relative z-10">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-center">Dot Digital Group</h3>
                </div>
              </Card>
              <Card className="group p-8 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:from-card hover:to-card/90 hover:-translate-y-2 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-center h-20 relative z-10">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-center">BNE — Banco Nacional de Emprego</h3>
                </div>
              </Card>
              <Card className="group p-8 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:from-card hover:to-card/90 hover:-translate-y-2 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-center h-20 relative z-10">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-center">Added</h3>
                </div>
              </Card>
              <Card className="group p-8 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:from-card hover:to-card/90 hover:-translate-y-2 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-center h-20 relative z-10">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-center">Grupo Boticário</h3>
                </div>
              </Card>
              <Card className="group p-8 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:from-card hover:to-card/90 hover:-translate-y-2 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-center h-20 relative z-10">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-center">DMCard</h3>
                </div>
              </Card>
              <Card className="group p-8 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:from-card hover:to-card/90 hover:-translate-y-2 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-center h-20 relative z-10">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-center">RDias</h3>
                </div>
              </Card>
              <Card className="group p-8 hover:shadow-2xl transition-all duration-500 border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:from-card hover:to-card/90 hover:-translate-y-2 hover:border-primary/30 relative overflow-hidden md:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-center h-20 relative z-10">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-center">Grupo Júlio Simões</h3>
                </div>
              </Card>
            </div>
            
            <p className="text-lg text-muted-foreground/80 font-medium italic" title="amostra de clientes atendidos no Brasil">
              ✨ Amostra de clientes atendidos no Brasil
            </p>
          </div>
        </div>
      </section>

      {/* Contato - Enhanced */}
      <section id="contato" className="py-32 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Fale Conosco
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Pronto para transformar seu negócio? Entre em contato e descubra como 
                podemos ajudar sua empresa a alcançar novos patamares.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* Informações de Contato */}
              <div className="relative">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-12 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Entre em Contato</h3>
                
                <div className="space-y-8">
                  <div className="group flex items-start space-x-6 p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 hover:from-card hover:to-card/90 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">Email</h4>
                      <p className="text-lg text-muted-foreground mb-1">contato@algoritmumbrasil.com.br</p>
                      <p className="text-lg text-muted-foreground">suporte@algoritmumbrasil.com.br</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-6 p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 hover:from-card hover:to-card/90 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <div className="h-16 w-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-secondary/30 group-hover:to-secondary/20 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Phone className="h-8 w-8 text-secondary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors duration-300">Telefone</h4>
                      <p className="text-lg text-muted-foreground mb-1">+55 (11) 9999-9999</p>
                      <p className="text-base text-muted-foreground/80">Segunda a Sexta, 9h às 18h</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-6 p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 hover:from-card hover:to-card/90 hover:border-accent/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <div className="h-16 w-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-accent/30 group-hover:to-accent/20 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <MapPin className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">Localização</h4>
                      <p className="text-lg text-muted-foreground mb-1">São Paulo, SP - Brasil</p>
                      <p className="text-base text-muted-foreground/80">Atendimento remoto em todo o país</p>
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

      {/* Call to Action Final */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
              🚀 Pronto para Começar?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Transforme Seu Negócio Hoje
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
              Entre em contato conosco e descubra como nossas soluções podem revolucionar 
              a eficiência e os resultados da sua empresa.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:bg-card/80 transition-all duration-300">
              <div className="p-3 bg-primary/20 rounded-xl w-fit mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Consultoria Gratuita</h3>
              <p className="text-muted-foreground">Análise completa das suas necessidades sem compromisso</p>
            </div>
            
            <div className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:bg-card/80 transition-all duration-300">
              <div className="p-3 bg-secondary/20 rounded-xl w-fit mx-auto mb-4">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Implementação Rápida</h3>
              <p className="text-muted-foreground">Soluções prontas para uso em tempo recorde</p>
            </div>
            
            <div className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:bg-card/80 transition-all duration-300">
              <div className="p-3 bg-accent/20 rounded-xl w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Suporte Especializado</h3>
              <p className="text-muted-foreground">Equipe dedicada para garantir seu sucesso</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Button size="lg" className="group relative text-xl font-bold px-12 py-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border-0" asChild>
              <Link href="/contato">
                <Phone className="mr-4 h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                Falar com Especialista
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="group relative text-xl font-bold px-12 py-8 rounded-2xl bg-background/80 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" asChild>
              <Link href="/sobre">
                <Building2 className="mr-4 h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                Conhecer a Empresa
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 pt-12 border-t border-border/30">
            <p className="text-muted-foreground/80 text-xl font-medium italic">
              ✨ <strong className="text-foreground text-2xl">+500</strong> empresas já confiam em nossas soluções • 
              <strong className="text-foreground text-2xl">15+</strong> anos de experiência • 
              <strong className="text-foreground text-2xl">99.9%</strong> de disponibilidade
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
