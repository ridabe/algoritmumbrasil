/**
 * Cliente Supabase para uso no lado do cliente (browser)
 * Utiliza o novo pacote @supabase/ssr para Next.js 15
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Instância singleton do cliente para uso direto
export const supabase = createClient();