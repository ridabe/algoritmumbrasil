import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, PiggyBank, Target, TrendingUp } from "lucide-react";

/**
 * Página inicial (landing page) do Algoritmum
 * Apresenta a plataforma e direciona para login/registro
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Algoritmum</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Começar Agora</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gestão Financeira
            <span className="text-blue-600"> Inteligente</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transforme sua relação com o dinheiro. Controle suas finanças, 
            alcance suas metas e construa um futuro próspero.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <PiggyBank className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Controle Total</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Monitore todas suas contas, cartões e investimentos em um só lugar. 
                Tenha visibilidade completa do seu patrimônio.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Metas Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Defina objetivos financeiros e acompanhe seu progresso. 
                Receba dicas personalizadas para alcançar suas metas.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Análises Avançadas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Relatórios detalhados e insights automáticos sobre seus hábitos. 
                Tome decisões baseadas em dados reais.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Junte-se a milhares de usuários que já estão no controle do seu dinheiro.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-12 py-4">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 Algoritmum. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
