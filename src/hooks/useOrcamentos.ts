'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

/**
 * Interface para definir um orçamento
 */
export interface Orcamento {
  id: string;
  user_id: string;
  categoria: string;
  valor_limite: number;
  valor_gasto: number;
  periodo: 'semanal' | 'mensal' | 'anual';
  mes_referencia: string;
  ano_referencia: number;
  status: 'ativo' | 'excedido' | 'pausado';
  created_at: string;
  updated_at: string;
}

/**
 * Interface para criar um novo orçamento
 */
export interface NovoOrcamentoData {
  categoria: string;
  valor_limite: number;
  periodo: 'semanal' | 'mensal' | 'anual';
  mes_referencia?: string;
  ano_referencia?: number;
}

/**
 * Interface para estatísticas de gastos por categoria
 */
export interface GastoPorCategoria {
  categoria: string;
  valor_gasto: number;
  periodo: string;
}

/**
 * Hook para gerenciar orçamentos
 * Fornece funcionalidades para criar, listar, atualizar e monitorar orçamentos
 */
export function useOrcamentos() {
  const { user } = useAuth();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega todos os orçamentos do usuário
   */
  const carregarOrcamentos = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setOrcamentos(data || []);
    } catch (err) {
      console.error('Erro ao carregar orçamentos:', err);
      setError('Erro ao carregar orçamentos');
      toast.error('Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Cria um novo orçamento
   */
  const criarOrcamento = async (dadosOrcamento: NovoOrcamentoData): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      const agora = new Date();
      const mesAtual = agora.toISOString().slice(0, 7); // YYYY-MM
      const anoAtual = agora.getFullYear();

      const { data, error: supabaseError } = await supabase
        .from('orcamentos')
        .insert({
          ...dadosOrcamento,
          user_id: user.id,
          valor_gasto: 0,
          mes_referencia: dadosOrcamento.mes_referencia || mesAtual,
          ano_referencia: dadosOrcamento.ano_referencia || anoAtual,
          status: 'ativo'
        })
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setOrcamentos(prev => [data, ...prev]);
      toast.success('Orçamento criado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao criar orçamento:', err);
      toast.error('Erro ao criar orçamento');
      return false;
    }
  };

  /**
   * Atualiza o valor gasto de um orçamento
   */
  const atualizarValorGasto = async (orcamentoId: string, novoValor: number): Promise<boolean> => {
    try {
      const orcamento = orcamentos.find(o => o.id === orcamentoId);
      if (!orcamento) return false;

      const novoStatus = novoValor > orcamento.valor_limite ? 'excedido' : 'ativo';

      const { error: supabaseError } = await supabase
        .from('orcamentos')
        .update({ 
          valor_gasto: novoValor,
          status: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orcamentoId)
        .eq('user_id', user?.id);

      if (supabaseError) {
        throw supabaseError;
      }

      setOrcamentos(prev => prev.map(orc => 
        orc.id === orcamentoId 
          ? { ...orc, valor_gasto: novoValor, status: novoStatus }
          : orc
      ));

      if (novoStatus === 'excedido') {
        toast.warning(`Orçamento de ${orcamento.categoria} foi excedido!`);
      }

      return true;
    } catch (err) {
      console.error('Erro ao atualizar valor gasto:', err);
      toast.error('Erro ao atualizar valor gasto');
      return false;
    }
  };

  /**
   * Atualiza o status de um orçamento
   */
  const atualizarStatusOrcamento = async (orcamentoId: string, novoStatus: Orcamento['status']): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('orcamentos')
        .update({ 
          status: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orcamentoId)
        .eq('user_id', user?.id);

      if (supabaseError) {
        throw supabaseError;
      }

      setOrcamentos(prev => prev.map(orc => 
        orc.id === orcamentoId 
          ? { ...orc, status: novoStatus }
          : orc
      ));

      toast.success('Status do orçamento atualizado!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status do orçamento:', err);
      toast.error('Erro ao atualizar status do orçamento');
      return false;
    }
  };

  /**
   * Exclui um orçamento
   */
  const excluirOrcamento = async (orcamentoId: string): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('orcamentos')
        .delete()
        .eq('id', orcamentoId)
        .eq('user_id', user?.id);

      if (supabaseError) {
        throw supabaseError;
      }

      setOrcamentos(prev => prev.filter(orc => orc.id !== orcamentoId));
      toast.success('Orçamento excluído com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao excluir orçamento:', err);
      toast.error('Erro ao excluir orçamento');
      return false;
    }
  };

  /**
   * Calcula a porcentagem de uso do orçamento
   */
  const calcularUsoOrcamento = (orcamento: Orcamento): number => {
    return (orcamento.valor_gasto / orcamento.valor_limite) * 100;
  };

  /**
   * Verifica se um orçamento está próximo do limite (>80%)
   */
  const isProximoLimite = (orcamento: Orcamento): boolean => {
    const uso = calcularUsoOrcamento(orcamento);
    return uso > 80 && uso <= 100;
  };

  /**
   * Verifica se um orçamento foi excedido
   */
  const isOrcamentoExcedido = (orcamento: Orcamento): boolean => {
    return orcamento.valor_gasto > orcamento.valor_limite;
  };

  /**
   * Obtém orçamentos por status
   */
  const getOrcamentosPorStatus = (status: Orcamento['status']): Orcamento[] => {
    return orcamentos.filter(orc => orc.status === status);
  };

  /**
   * Obtém orçamentos do mês atual
   */
  const getOrcamentosMesAtual = (): Orcamento[] => {
    const mesAtual = new Date().toISOString().slice(0, 7);
    return orcamentos.filter(orc => orc.mes_referencia === mesAtual);
  };

  /**
   * Calcula gastos reais por categoria no período
   */
  const calcularGastosReaisPorCategoria = async (categoria: string, periodo: string): Promise<number> => {
    if (!user?.id) return 0;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('category', categoria)
        .eq('type', 'expense')
        .gte('date', `${periodo}-01`)
        .lt('date', `${periodo}-32`); // Aproximação para fim do mês

      if (error) throw error;

      return data?.reduce((total, transaction) => total + Math.abs(transaction.amount), 0) || 0;
    } catch (err) {
      console.error('Erro ao calcular gastos reais:', err);
      return 0;
    }
  };

  /**
   * Sincroniza gastos reais com orçamentos
   */
  const sincronizarGastosReais = async (): Promise<void> => {
    if (!user?.id) return;

    try {
      const orcamentosMesAtual = getOrcamentosMesAtual();
      
      for (const orcamento of orcamentosMesAtual) {
        const gastosReais = await calcularGastosReaisPorCategoria(
          orcamento.categoria, 
          orcamento.mes_referencia
        );
        
        if (gastosReais !== orcamento.valor_gasto) {
          await atualizarValorGasto(orcamento.id, gastosReais);
        }
      }
    } catch (err) {
      console.error('Erro ao sincronizar gastos reais:', err);
    }
  };

  /**
   * Obtém estatísticas dos orçamentos
   */
  const getEstatisticasOrcamentos = () => {
    const totalOrcamentos = orcamentos.length;
    const orcamentosAtivos = orcamentos.filter(o => o.status === 'ativo').length;
    const orcamentosExcedidos = orcamentos.filter(o => o.status === 'excedido').length;
    const valorTotalLimites = orcamentos.reduce((acc, orc) => acc + orc.valor_limite, 0);
    const valorTotalGasto = orcamentos.reduce((acc, orc) => acc + orc.valor_gasto, 0);
    const usoMedio = valorTotalLimites > 0 ? (valorTotalGasto / valorTotalLimites) * 100 : 0;

    return {
      totalOrcamentos,
      orcamentosAtivos,
      orcamentosExcedidos,
      valorTotalLimites,
      valorTotalGasto,
      usoMedio
    };
  };

  // Carrega os orçamentos quando o usuário muda
  useEffect(() => {
    carregarOrcamentos();
  }, [carregarOrcamentos]);

  return {
    orcamentos,
    loading,
    error,
    carregarOrcamentos,
    criarOrcamento,
    atualizarValorGasto,
    atualizarStatusOrcamento,
    excluirOrcamento,
    calcularUsoOrcamento,
    isProximoLimite,
    isOrcamentoExcedido,
    getOrcamentosPorStatus,
    getOrcamentosMesAtual,
    calcularGastosReaisPorCategoria,
    sincronizarGastosReais,
    getEstatisticasOrcamentos
  };
}