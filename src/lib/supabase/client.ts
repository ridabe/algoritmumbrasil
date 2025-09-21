/**
 * Cliente Supabase para uso no lado do cliente (browser)
 * Utiliza o novo pacote @supabase/ssr para Next.js 15
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Valores padrão para evitar erros durante o build
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Instância singleton do cliente para uso direto
export const supabase = createClient();