'use client';

/**
 * Context de autenticação para gerenciar o estado do usuário logado
 * Fornece funções de login, logout, registro e verificação de autenticação
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, type AuthUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook para acessar o contexto de autenticação
 * Deve ser usado dentro de um AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider do contexto de autenticação
 * Gerencia o estado global de autenticação da aplicação
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Carrega o usuário atual ao inicializar o componente
   */
  useEffect(() => {
    loadUser();
  }, []);

  /**
   * Carrega os dados do usuário atual
   */
  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza o login do usuário
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await authService.signIn(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        router.push('/financas');
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Erro ao fazer login' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza o registro de um novo usuário
   */
  const register = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const result = await authService.signUp(email, password, fullName);
      
      if (result.success) {
        // Após o registro, fazer login automaticamente
        const loginResult = await authService.signIn(email, password);
        if (loginResult.success && loginResult.user) {
          setUser(loginResult.user);
          router.push('/financas');
        }
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Erro ao criar conta' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza o logout do usuário
   */
  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  /**
   * Atualiza os dados do usuário atual
   */
  const refreshUser = async () => {
    await loadUser();
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}