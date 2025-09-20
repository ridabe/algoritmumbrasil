'use client';

/**
 * Contexto de autenticação para gerenciar o estado do usuário
 * Fornece informações do usuário logado e funções de autenticação
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, type AuthUser } from '@/lib/auth';
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

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar usuário atual ao inicializar
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escutar mudanças no estado de autenticação
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.signIn(email, password);
      toast.success('Login realizado com sucesso!');
      router.push('/financas');
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