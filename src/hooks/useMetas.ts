'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

/**
 * Interface para definir uma meta financeira
 */
export interface Meta {
  id: string;
  user_id: string;
  titulo: string;
  descricao?: string;
  valor_objetivo: number;
  valor_atual: number;
  categoria: string;
  data_inicio: string;
  data_fim: string;
  status: 'ativa' | 'concluida' | 'pausada';
  tipo: 'economia' | 'investimento' | 'pagamento';
  created_at: string;
  updated_at: string;
}

/**
 * Interface para criar uma nova meta
 */
export interface NovaMetaData {
  titulo: string;
  descricao?: string;
  valor_objetivo: number;
  categoria: string;
  data_inicio: string;
  data_fim: string;
  tipo: 'economia' | 'investimento' | 'pagamento';
}

/**
 * Hook para gerenciar metas financeiras
 * Fornece funcionalidades para criar, listar, atualizar e excluir metas
 */
export function useMetas() {
  const { user } = useAuth();
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega todas as metas do usuário
   */
  const carregarMetas = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('metas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setMetas(data || []);
    } catch (err) {
      console.error('Erro ao carregar metas:', err);
      setError('Erro ao carregar metas');
      toast.error('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Cria uma nova meta
   */
  const criarMeta = async (dadosMeta: NovaMetaData): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('metas')
        .insert({
          ...dadosMeta,
          user_id: user.id,
          valor_atual: 0,
          status: 'ativa'
        })
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setMetas(prev => [data, ...prev]);
      toast.success('Meta criada com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao criar meta:', err);
      toast.error('Erro ao criar meta');
      return false;
    }
  };

  /**
   * Atualiza o valor atual de uma meta
   */
  const atualizarValorMeta = async (metaId: string, novoValor: number): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('metas')
        .update({ 
          valor_atual: novoValor,
          updated_at: new Date().toISOString()
        })
        .eq('id', metaId)
        .eq('user_id', user?.id);

      if (supabaseError) {
        throw supabaseError;
      }

      setMetas(prev => prev.map(meta => 
        meta.id === metaId 
          ? { ...meta, valor_atual: novoValor }
          : meta
      ));

      toast.success('Valor da meta atualizado!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar valor da meta:', err);
      toast.error('Erro ao atualizar valor da meta');
      return false;
    }
  };

  /**
   * Atualiza o status de uma meta
   */
  const atualizarStatusMeta = async (metaId: string, novoStatus: Meta['status']): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('metas')
        .update({ 
          status: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', metaId)
        .eq('user_id', user?.id);

      if (supabaseError) {
        throw supabaseError;
      }

      setMetas(prev => prev.map(meta => 
        meta.id === metaId 
          ? { ...meta, status: novoStatus }
          : meta
      ));

      toast.success('Status da meta atualizado!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status da meta:', err);
      toast.error('Erro ao atualizar status da meta');
      return false;
    }
  };

  /**
   * Exclui uma meta
   */
  const excluirMeta = async (metaId: string): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('metas')
        .delete()
        .eq('id', metaId)
        .eq('user_id', user?.id);

      if (supabaseError) {
        throw supabaseError;
      }

      setMetas(prev => prev.filter(meta => meta.id !== metaId));
      toast.success('Meta excluída com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao excluir meta:', err);
      toast.error('Erro ao excluir meta');
      return false;
    }
  };

  /**
   * Calcula o progresso de uma meta em porcentagem
   */
  const calcularProgresso = (meta: Meta): number => {
    return Math.min((meta.valor_atual / meta.valor_objetivo) * 100, 100);
  };

  /**
   * Verifica se uma meta foi atingida
   */
  const isMetaAtingida = (meta: Meta): boolean => {
    return meta.valor_atual >= meta.valor_objetivo;
  };

  /**
   * Obtém metas por status
   */
  const getMetasPorStatus = (status: Meta['status']): Meta[] => {
    return metas.filter(meta => meta.status === status);
  };

  /**
   * Obtém estatísticas das metas
   */
  const getEstatisticasMetas = () => {
    const totalMetas = metas.length;
    const metasAtivas = metas.filter(m => m.status === 'ativa').length;
    const metasConcluidas = metas.filter(m => m.status === 'concluida').length;
    const valorTotalObjetivos = metas.reduce((acc, meta) => acc + meta.valor_objetivo, 0);
    const valorTotalAtual = metas.reduce((acc, meta) => acc + meta.valor_atual, 0);
    const progressoGeral = valorTotalObjetivos > 0 ? (valorTotalAtual / valorTotalObjetivos) * 100 : 0;

    return {
      totalMetas,
      metasAtivas,
      metasConcluidas,
      valorTotalObjetivos,
      valorTotalAtual,
      progressoGeral
    };
  };

  // Carrega as metas quando o usuário muda
  useEffect(() => {
    carregarMetas();
  }, [carregarMetas]);

  return {
    metas,
    loading,
    error,
    carregarMetas,
    criarMeta,
    atualizarValorMeta,
    atualizarStatusMeta,
    excluirMeta,
    calcularProgresso,
    isMetaAtingida,
    getMetasPorStatus,
    getEstatisticasMetas
  };
}