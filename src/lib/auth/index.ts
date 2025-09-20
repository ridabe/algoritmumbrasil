/**
 * Serviço de autenticação com Supabase
 * Gerencia login, logout, registro e estado do usuário
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../db';

/**
 * Cliente Supabase para uso no lado do cliente (browser)
 */
export const supabaseClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Cria um cliente Supabase para componentes do cliente
 */
export const createSupabaseClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

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
      await this.createUserProfile(data.user.id, name, email);
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
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) return null;

    // Buscar perfil completo do usuário
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    return {
      id: user.id,
      email: user.email!,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      role: profile.role,
    };
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
  private async createUserProfile(userId: string, name: string, email: string) {
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