'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, TrendingUp, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMetas, type NovaMetaData } from '@/hooks/useMetas';
import { useOrcamentos, type NovoOrcamentoData } from '@/hooks/useOrcamentos';
import { useRequireAuth } from '@/contexts/auth-context';

/**
 * Página de Metas e Orçamentos
 * Permite ao usuário definir metas financeiras e controlar orçamentos por categoria
 */
export default function MetasPage() {
  // Proteção de autenticação
  useRequireAuth();

  // Hooks para gerenciar metas e orçamentos
  const {
    metas,
    loading: loadingMetas,
    criarMeta,
    calcularProgresso,
    isMetaAtingida
  } = useMetas();

  const {
    orcamentos,
    loading: loadingOrcamentos,
    criarOrcamento,
    calcularUsoOrcamento,
    isProximoLimite,
    isOrcamentoExcedido
  } = useOrcamentos();

  // Estados para controlar os dialogs
  const [novaMetaOpen, setNovaMetaOpen] = useState(false);
  const [novoOrcamentoOpen, setNovoOrcamentoOpen] = useState(false);
  
  // Estados para os formulários
  const [formMeta, setFormMeta] = useState<NovaMetaData>({
    titulo: '',
    descricao: '',
    valor_objetivo: 0,
    categoria: '',
    data_inicio: '',
    data_fim: '',
    tipo: 'economia'
  });

  const [formOrcamento, setFormOrcamento] = useState<NovoOrcamentoData>({
    categoria: '',
    valor_limite: 0,
    periodo: 'mensal'
  });

  const [submittingMeta, setSubmittingMeta] = useState(false);
  const [submittingOrcamento, setSubmittingOrcamento] = useState(false);

  /**
   * Formata valor monetário para exibição
   */
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  /**
   * Retorna a cor do badge baseado no status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'concluida':
        return 'bg-blue-100 text-blue-800';
      case 'excedido':
        return 'bg-red-100 text-red-800';
      case 'pausada':
      case 'pausado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Adiciona uma nova meta
   */
  const adicionarMeta = async () => {
    if (!formMeta.titulo || !formMeta.valor_objetivo || !formMeta.categoria) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setSubmittingMeta(true);
    const sucesso = await criarMeta(formMeta);
    
    if (sucesso) {
      setFormMeta({
        titulo: '',
        descricao: '',
        valor_objetivo: 0,
        categoria: '',
        data_inicio: '',
        data_fim: '',
        tipo: 'economia'
      });
      setNovaMetaOpen(false);
    }
    setSubmittingMeta(false);
  };

  /**
   * Adiciona um novo orçamento
   */
  const adicionarOrcamento = async () => {
    if (!formOrcamento.categoria || !formOrcamento.valor_limite) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setSubmittingOrcamento(true);
    const sucesso = await criarOrcamento(formOrcamento);
    
    if (sucesso) {
      setFormOrcamento({
        categoria: '',
        valor_limite: 0,
        periodo: 'mensal'
      });
      setNovoOrcamentoOpen(false);
    }
    setSubmittingOrcamento(false);
  };

  // Loading state
  if (loadingMetas || loadingOrcamentos) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas e Orçamentos</h1>
          <p className="text-muted-foreground">
            Defina suas metas financeiras e controle seus gastos por categoria
          </p>
        </div>
      </div>

      <Tabs defaultValue="metas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metas" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Metas
          </TabsTrigger>
          <TabsTrigger value="orcamentos" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Orçamentos
          </TabsTrigger>
        </TabsList>

        {/* Aba de Metas */}
        <TabsContent value="metas" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Suas Metas Financeiras</h2>
            <Dialog open={novaMetaOpen} onOpenChange={setNovaMetaOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Meta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Meta</DialogTitle>
                  <DialogDescription>
                    Defina uma nova meta financeira para acompanhar seu progresso
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="titulo">Título da Meta</Label>
                    <Input 
                      id="titulo" 
                      placeholder="Ex: Reserva de Emergência"
                      value={formMeta.titulo}
                      onChange={(e) => setFormMeta(prev => ({ ...prev, titulo: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="descricao">Descrição (opcional)</Label>
                    <Input 
                      id="descricao" 
                      placeholder="Descrição da meta"
                      value={formMeta.descricao}
                      onChange={(e) => setFormMeta(prev => ({ ...prev, descricao: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="valor-objetivo">Valor Objetivo</Label>
                    <Input 
                      id="valor-objetivo" 
                      type="number" 
                      placeholder="0,00"
                      value={formMeta.valor_objetivo || ''}
                      onChange={(e) => setFormMeta(prev => ({ ...prev, valor_objetivo: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={formMeta.categoria} onValueChange={(value) => setFormMeta(prev => ({ ...prev, categoria: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Reserva">Reserva</SelectItem>
                        <SelectItem value="Investimento">Investimento</SelectItem>
                        <SelectItem value="Lazer">Lazer</SelectItem>
                        <SelectItem value="Educação">Educação</SelectItem>
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="Saúde">Saúde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={formMeta.tipo} onValueChange={(value: 'economia' | 'investimento' | 'pagamento') => setFormMeta(prev => ({ ...prev, tipo: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economia">Economia</SelectItem>
                        <SelectItem value="investimento">Investimento</SelectItem>
                        <SelectItem value="pagamento">Pagamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="data-inicio">Data Início</Label>
                      <Input 
                        id="data-inicio" 
                        type="date"
                        value={formMeta.data_inicio}
                        onChange={(e) => setFormMeta(prev => ({ ...prev, data_inicio: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="data-fim">Data Fim</Label>
                      <Input 
                        id="data-fim" 
                        type="date"
                        value={formMeta.data_fim}
                        onChange={(e) => setFormMeta(prev => ({ ...prev, data_fim: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNovaMetaOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={adicionarMeta}>Criar Meta</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {metas.map((meta) => {
                const progresso = calcularProgresso(meta);
              return (
                <Card key={meta.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{meta.titulo}</CardTitle>
                      <Badge className={getStatusColor(meta.status)}>
                        {meta.status === 'ativa' ? 'Ativa' : 
                         meta.status === 'concluida' ? 'Concluída' : 'Pausada'}
                      </Badge>
                    </div>
                    {meta.descricao && (
                      <CardDescription>{meta.descricao}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{progresso.toFixed(1)}%</span>
                      </div>
                      <Progress value={progresso} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Atual</p>
                        <p className="font-semibold">{formatarMoeda(meta.valor_atual)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Objetivo</p>
                        <p className="font-semibold">{formatarMoeda(meta.valor_objetivo)}</p>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Início: {new Date(meta.data_inicio).toLocaleDateString('pt-BR')}</span>
                      <span>Fim: {new Date(meta.data_fim).toLocaleDateString('pt-BR')}</span>
                    </div>

                    {progresso >= 100 && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Meta atingida!
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Aba de Orçamentos */}
        <TabsContent value="orcamentos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Controle de Orçamentos</h2>
            <Dialog open={novoOrcamentoOpen} onOpenChange={setNovoOrcamentoOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Orçamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Orçamento</DialogTitle>
                  <DialogDescription>
                    Defina um limite de gastos para uma categoria
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="categoria-orcamento">Categoria</Label>
                    <Select 
                      value={formOrcamento.categoria} 
                      onValueChange={(value) => setFormOrcamento(prev => ({ ...prev, categoria: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="transporte">Transporte</SelectItem>
                        <SelectItem value="lazer">Lazer</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="valor-limite">Valor Limite</Label>
                    <Input 
                      id="valor-limite" 
                      type="number" 
                      placeholder="0,00" 
                      value={formOrcamento.valor_limite || ''}
                      onChange={(e) => setFormOrcamento(prev => ({ ...prev, valor_limite: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="periodo">Período</Label>
                    <Select 
                      value={formOrcamento.periodo} 
                      onValueChange={(value: 'semanal' | 'mensal' | 'anual') => setFormOrcamento(prev => ({ ...prev, periodo: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNovoOrcamentoOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={adicionarOrcamento} disabled={submittingOrcamento}>
                    {submittingOrcamento && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Criar Orçamento
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {orcamentos.map((orcamento) => {
                const uso = calcularUsoOrcamento(orcamento);
              const isExcedido = uso > 100;
              const isProximoLimite = uso > 80 && uso <= 100;
              
              return (
                <Card key={orcamento.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{orcamento.categoria}</h3>
                        <p className="text-sm text-muted-foreground">
                          Período: {orcamento.periodo}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExcedido && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge className={getStatusColor(orcamento.status)}>
                          {orcamento.status === 'ativo' ? 'Ativo' : 
                           orcamento.status === 'excedido' ? 'Excedido' : 'Pausado'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Gasto</span>
                        <span className={isExcedido ? 'text-red-600 font-semibold' : ''}>
                          {uso.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(uso, 100)} 
                        className={`h-2 ${isExcedido ? '[&>div]:bg-red-500' : 
                                          isProximoLimite ? '[&>div]:bg-yellow-500' : ''}`} 
                      />
                      {isExcedido && (
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            Orçamento excedido em {formatarMoeda(orcamento.valor_gasto - orcamento.valor_limite)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Gasto</p>
                        <p className="font-semibold">{formatarMoeda(orcamento.valor_gasto)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Limite</p>
                        <p className="font-semibold">{formatarMoeda(orcamento.valor_limite)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}