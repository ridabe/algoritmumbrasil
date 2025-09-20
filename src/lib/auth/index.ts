/**
 * Serviços de autenticação usando Supabase Auth
 * Gerencia login, registro, logout e verificação de usuários
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * Serviço de autenticação com métodos para gerenciar usuários
 */
export const authService = {
  /**
   * Realiza login com email e senha
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: getErrorMessage(error.message),
        };
      }

      if (data.user) {
        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          fullName: data.user.user_metadata?.full_name,
          avatarUrl: data.user.user_metadata?.avatar_url,
          createdAt: data.user.created_at,
        };

        return {
          success: true,
          user,
        };
      }

      return {
        success: false,
        error: 'Erro desconhecido ao fazer login',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno do servidor',
      };
    }
  },

  /**
   * Registra um novo usuário
   */
  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: getErrorMessage(error.message),
        };
      }

      if (data.user) {
        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          fullName: fullName,
          createdAt: data.user.created_at,
        };

        return {
          success: true,
          user,
        };
      }

      return {
        success: false,
        error: 'Erro desconhecido ao criar conta',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno do servidor',
      };
    }
  },

  /**
   * Realiza logout do usuário atual
   */
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  /**
   * Obtém o usuário atual
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        return {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name,
          avatarUrl: user.user_metadata?.avatar_url,
          createdAt: user.created_at,
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },

  /**
   * Verifica se há um usuário logado
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  },
};

/**
 * Converte mensagens de erro do Supabase para português
 */
function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
    'User already registered': 'Este email já está cadastrado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Invalid email': 'Email inválido',
    'Signup is disabled': 'Cadastro desabilitado temporariamente',
  };

  return errorMessages[error] || 'Erro desconhecido. Tente novamente.';
}