import { createBrowserClient } from '@supabase/ssr';

/**
 * Cria um cliente Supabase para uso no lado do cliente (browser)
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variáveis de ambiente do Supabase não configuradas');
    throw new Error('Configuração do Supabase inválida');
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Instância singleton do cliente Supabase
 */
export const supabase = createClient();