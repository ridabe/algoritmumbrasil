'use client';

/**
 * Contexto de autenticação para gerenciar o estado do usuário
 * Fornece informações do usuário logado e funções de autenticação
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, type AuthUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<AuthUser, 'name' | 'avatarUrl'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Estado para verificar se está no cliente
let isClient = false;
if (typeof window !== 'undefined') {
  isClient = true;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Verificar se o componente foi montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Inicializar autenticação apenas no cliente
  useEffect(() => {
    if (!mounted || !isClient) return;

    // Verificar usuário atual ao inicializar
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Inicializando autenticação...');
        
        // Primeiro, verificar se há uma sessão ativa
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.log('AuthContext: Erro ao obter sessão:', sessionError.message);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.log('AuthContext: Nenhuma sessão ativa encontrada');
          setUser(null);
          setLoading(false);
          return;
        }
        
        console.log('AuthContext: Sessão ativa encontrada, obtendo dados do usuário...');
        const currentUser = await authService.getCurrentUser();
        console.log('AuthContext: Usuário atual obtido:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('AuthContext: Erro ao inicializar autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escutar mudanças no estado de autenticação
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      console.log('Mudança no estado de auth:', user);
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [mounted]);

  // Renderizar loading durante a hidratação
  if (!mounted) {
    return <div>Carregando...</div>;
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.signIn(email, password);
      toast.success('Login realizado com sucesso!');
      router.push('/sistemas/financeiro');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await authService.signUp(email, password, name);
      toast.success('Conta criada com sucesso! Verifique seu email.');
      router.push('/auth/verify-email');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      // Aguardar um pouco para o listener atualizar o estado
      await new Promise(resolve => setTimeout(resolve, 100));
      setUser(null); // Garantir que o usuário seja limpo
      toast.success('Logout realizado com sucesso!');
      router.push('/auth/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer logout';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Pick<AuthUser, 'name' | 'avatarUrl'>>) => {
    try {
      await authService.updateProfile(updates);
      
      // Atualizar estado local
      if (user) {
        setUser({ ...user, ...updates });
      }
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      toast.error(message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

// Hook para verificar se o usuário está autenticado
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  return { user, loading };
}