/**
 * Serviço de autenticação com Supabase
 * Gerencia login, logout, registro e estado do usuário
 */

import { createBrowserClient } from '@supabase/ssr';
import { supabase } from '../supabase/client';

/**
 * Cliente Supabase para uso no lado do cliente (browser)
 */
export const supabaseClient = supabase;

/**
 * Cria um cliente Supabase para componentes do cliente
 */
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas');
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Tipos de usuário
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
}

// Serviço de autenticação
export class AuthService {
  private supabase;

  constructor() {
    this.supabase = createSupabaseClient();
  }

  /**
   * Faz login com email e senha
   */
  async signIn(email: string, password: string) {
    console.log('AuthService: Tentando fazer login com:', email);
    
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('AuthService: Resultado do login:', { data, error });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Registra um novo usuário
   */
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Criar perfil do usuário
    if (data.user) {
      await this.createUserProfile(data.user.id, name);
    }

    return data;
  }

  /**
   * Faz logout
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Obtém o usuário atual
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      console.log('AuthService: Verificando usuário atual...');
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        console.error('AuthService: Erro ao obter usuário:', error);
        return null;
      }
      
      if (!user) {
        console.log('AuthService: Nenhum usuário encontrado');
        return null;
      }

      console.log('AuthService: Usuário encontrado:', user.email);

      // Tentar buscar perfil completo do usuário
      try {
        const { data: profile, error: profileError } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.warn('AuthService: Erro ao buscar perfil, usando dados básicos:', profileError);
          // Retornar dados básicos se não conseguir buscar o perfil
          return {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.email?.split('@')[0],
            avatarUrl: undefined,
            role: 'user',
          };
        }

        return {
          id: user.id,
          email: user.email!,
          name: profile.name || user.user_metadata?.name || user.email?.split('@')[0],
          avatarUrl: profile.avatar_url || undefined,
          role: profile.role as 'user' | 'admin',
        };
      } catch (profileError) {
        console.warn('AuthService: Falha ao buscar perfil, usando dados básicos:', profileError);
        // Retornar dados básicos se houver erro na busca do perfil
        return {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          avatarUrl: undefined,
          role: 'user',
        };
      }
    } catch (error) {
      console.error('AuthService: Erro geral ao verificar usuário:', error);
      return null;
    }
  }

  /**
   * Obtém a sessão atual
   */
  async getSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session;
  }

  /**
   * Redefine a senha
   */
  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Atualiza a senha
   */
  async updatePassword(password: string) {
    const { error } = await this.supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Atualiza o perfil do usuário
   */
  async updateProfile(updates: Partial<Pick<AuthUser, 'name' | 'avatarUrl'>>) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await this.supabase
      .from('profiles')
      .update({
        name: updates.name,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Cria o perfil do usuário após o registro
   */
  private async createUserProfile(userId: string, name: string) {
    const { error } = await this.supabase
      .from('profiles')
      .insert({
        id: userId,
        name,
        theme: 'light',
        currency: 'BRL',
        locale: 'pt-BR',
        role: 'user',
      });

    if (error) {
      console.error('Erro ao criar perfil:', error);
      throw new Error('Erro ao criar perfil do usuário');
    }
  }

  /**
   * Escuta mudanças no estado de autenticação
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

// Instância do serviço
export const authService = new AuthService();