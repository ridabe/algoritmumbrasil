import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, DollarSign, PieChart, Shield, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-blue-600" />
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
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Gestão Financeira <span className="text-blue-600">Inteligente</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transforme sua relação com o dinheiro. Controle suas finanças, 
          acompanhe investimentos e alcance seus objetivos financeiros.
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
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Funcionalidades Poderosas
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Dashboard Intuitivo</CardTitle>
              <CardDescription>
                Visualize todas suas finanças em um só lugar com gráficos e relatórios detalhados.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <PieChart className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Controle de Gastos</CardTitle>
              <CardDescription>
                Categorize e monitore seus gastos para identificar onde seu dinheiro está indo.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Metas Financeiras</CardTitle>
              <CardDescription>
                Defina objetivos e acompanhe seu progresso rumo à independência financeira.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Segurança Total</CardTitle>
              <CardDescription>
                Seus dados estão protegidos com criptografia de ponta e backup automático.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Gestão Familiar</CardTitle>
              <CardDescription>
                Compartilhe e gerencie as finanças da família de forma colaborativa.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Múltiplas Contas</CardTitle>
              <CardDescription>
                Conecte todas suas contas bancárias e cartões em uma única plataforma.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de pessoas que já estão no controle do seu dinheiro.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <DollarSign className="h-6 w-6" />
            <span className="text-xl font-bold">Algoritmum</span>
          </div>
          <p className="text-gray-400">
            © 2024 Algoritmum. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}