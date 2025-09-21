'use client';

/**
 * Contexto para gerenciar atualizações automáticas de dados
 * Permite que hooks sejam notificados quando dados são modificados
 */

import React, { createContext, useContext, useCallback, useRef } from 'react';

type DataEventType = 'transaction' | 'account' | 'category' | 'budget' | 'goal';
type DataActionType = 'create' | 'update' | 'delete';

interface DataEvent {
  type: DataEventType;
  action: DataActionType;
  id?: string;
  data?: any;
}

type DataListener = (event: DataEvent) => void;

interface DataContextType {
  /**
   * Registra um listener para eventos de dados
   */
  subscribe: (type: DataEventType, listener: DataListener) => () => void;
  
  /**
   * Emite um evento de dados para todos os listeners
   */
  emit: (event: DataEvent) => void;
  
  /**
   * Notifica sobre mudanças em transações
   */
  notifyTransactionChange: (action: DataActionType, id?: string, data?: any) => void;
  
  /**
   * Notifica sobre mudanças em contas
   */
  notifyAccountChange: (action: DataActionType, id?: string, data?: any) => void;
  
  /**
   * Notifica sobre mudanças em categorias
   */
  notifyCategoryChange: (action: DataActionType, id?: string, data?: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const listenersRef = useRef<Map<DataEventType, Set<DataListener>>>(new Map());

  /**
   * Registra um listener para um tipo específico de evento
   */
  const subscribe = useCallback((type: DataEventType, listener: DataListener) => {
    if (!listenersRef.current.has(type)) {
      listenersRef.current.set(type, new Set());
    }
    
    const listeners = listenersRef.current.get(type)!;
    listeners.add(listener);
    
    // Retorna função para cancelar a inscrição
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        listenersRef.current.delete(type);
      }
    };
  }, []);

  /**
   * Emite um evento para todos os listeners do tipo especificado
   */
  const emit = useCallback((event: DataEvent) => {
    const listeners = listenersRef.current.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('Erro ao executar listener de dados:', error);
        }
      });
    }
  }, []);

  /**
   * Notifica sobre mudanças em transações
   */
  const notifyTransactionChange = useCallback((action: DataActionType, id?: string, data?: any) => {
    emit({ type: 'transaction', action, id, data });
    // Também notificar contas, pois transações afetam saldos
    emit({ type: 'account', action: 'update', id: data?.account_id });
    if (data?.transfer_account_id) {
      emit({ type: 'account', action: 'update', id: data.transfer_account_id });
    }
  }, [emit]);

  /**
   * Notifica sobre mudanças em contas
   */
  const notifyAccountChange = useCallback((action: DataActionType, id?: string, data?: any) => {
    emit({ type: 'account', action, id, data });
  }, [emit]);

  /**
   * Notifica sobre mudanças em categorias
   */
  const notifyCategoryChange = useCallback((action: DataActionType, id?: string, data?: any) => {
    emit({ type: 'category', action, id, data });
  }, [emit]);

  const value: DataContextType = {
    subscribe,
    emit,
    notifyTransactionChange,
    notifyAccountChange,
    notifyCategoryChange,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * Hook para usar o contexto de dados
 */
export function useDataContext() {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useDataContext deve ser usado dentro de um DataProvider');
  }
  
  return context;
}

/**
 * Hook para escutar mudanças em um tipo específico de dados
 */
export function useDataListener(type: DataEventType, callback: DataListener) {
  const { subscribe } = useDataContext();
  
  React.useEffect(() => {
    const unsubscribe = subscribe(type, callback);
    return unsubscribe;
  }, [subscribe, type, callback]);
}