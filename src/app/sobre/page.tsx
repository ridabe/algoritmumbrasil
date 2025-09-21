import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Users, 
  Target, 
  Award, 
  Lightbulb,
  Heart,
  Zap,
  Globe,
  Code,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

/**
 * Página institucional sobre a Algoritmum Brasil
 * Apresenta história, missão, visão, valores e equipe
 */
export default function SobrePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Sobre a Algoritmum Brasil
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Transformando Ideias em
              <span className="text-primary block">Soluções Digitais</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Somos uma empresa brasileira especializada em desenvolvimento de software, 
              automação de processos e soluções tecnológicas inovadoras para empresas de todos os portes.
            </p>
          </div>

          {/* Nossa História */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center">
                  <Globe className="h-8 w-8 text-primary mr-3" />
                  Nossa História
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Fundada em 2024, a Algoritmum Brasil nasceu da visão de democratizar 
                    o acesso a tecnologias avançadas para empresas brasileiras. Começamos 
                    com o desenvolvimento do Monetrix, uma solução completa 
                    para gestão de finanças pessoais e empresariais.
                  </p>
                  <p>
                    Desde então, expandimos nosso portfólio para incluir automação de processos 
                    (RPA), análise de dados com inteligência artificial e sistemas personalizados 
                    que atendem às necessidades específicas de cada cliente.
                  </p>
                  <p>
                    Nossa jornada é marcada pela constante busca por inovação, qualidade 
                    e excelência no atendimento, sempre com foco em gerar valor real 
                    para nossos clientes e parceiros.
                  </p>
                </div>
              </div>
              <div className="relative">
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">2024</div>
                        <div className="text-sm text-muted-foreground">Fundação</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">100%</div>
                        <div className="text-sm text-muted-foreground">Nacional</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">3+</div>
                        <div className="text-sm text-muted-foreground">Sistemas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">∞</div>
                        <div className="text-sm text-muted-foreground">Possibilidades</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Missão, Visão e Valores */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Nossos Pilares
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Missão */}
              <Card className="text-center group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-600">Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Desenvolver soluções tecnológicas inovadoras e acessíveis que 
                    simplifiquem processos, aumentem a produtividade e impulsionem 
                    o crescimento sustentável dos nossos clientes.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Visão */}
              <Card className="text-center group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Lightbulb className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-green-600">Visão</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Ser reconhecida como a principal referência em soluções 
                    tecnológicas personalizadas no Brasil, transformando a forma 
                    como as empresas operam e crescem.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Valores */}
              <Card className="text-center group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl text-purple-600">Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Inovação constante, transparência total, excelência técnica, 
                    foco no cliente e compromisso com resultados que geram 
                    impacto positivo real.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Nossos Diferenciais */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Por Que Escolher a Algoritmum?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6 hover:shadow-lg transition-all">
                <Code className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Tecnologia de Ponta</h3>
                <p className="text-sm text-muted-foreground">
                  Utilizamos as mais modernas tecnologias e frameworks do mercado
                </p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-lg transition-all">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Agilidade</h3>
                <p className="text-sm text-muted-foreground">
                  Desenvolvimento rápido com metodologias ágeis e entregas frequentes
                </p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-lg transition-all">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Código limpo, testes automatizados e documentação completa
                </p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-lg transition-all">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Escalabilidade</h3>
                <p className="text-sm text-muted-foreground">
                  Soluções que crescem junto com o seu negócio
                </p>
              </Card>
            </div>
          </div>

          {/* Nossa Equipe */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary mr-3" />
              Nossa Equipe
            </h2>
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-12 text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Profissionais Especializados
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                  Nossa equipe é formada por desenvolvedores seniores, arquitetos de software, 
                  especialistas em UX/UI e consultores de negócios, todos unidos pela paixão 
                  por tecnologia e pelo compromisso com a excelência.
                </p>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">5+ Anos</div>
                    <div className="text-sm text-muted-foreground">Experiência Média</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Dedicação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Suporte</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold mb-4">
                  Pronto para Transformar seu Negócio?
                </h3>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                  Entre em contato conosco e descubra como nossas soluções podem 
                  impulsionar o crescimento da sua empresa.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <a href="/#contato">
                      Fale Conosco
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                    <Link href="/sistemas">
                      Conheça Nossos Sistemas
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

/**
 * Metadata para SEO da página sobre
 */
export const metadata = {
  title: 'Sobre Nós | Algoritmum Brasil - Soluções Tecnológicas Inovadoras',
  description: 'Conheça a Algoritmum Brasil, empresa especializada em desenvolvimento de software, automação de processos e soluções tecnológicas personalizadas.',
  keywords: 'sobre algoritmum, empresa tecnologia, desenvolvimento software brasil, automação processos, soluções personalizadas',
  openGraph: {
    title: 'Sobre a Algoritmum Brasil',
    description: 'Transformando ideias em soluções digitais inovadoras',
    type: 'website',
  },
};