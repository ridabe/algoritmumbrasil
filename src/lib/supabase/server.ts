/**
 * Cliente Supabase para uso no lado do servidor (Server Components, API Routes)
 * Utiliza o novo pacote @supabase/ssr para Next.js 15
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Cliente para uso em middleware
 */
export function createMiddlewareClient(request: Request) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.headers.get('cookie')
            ?.split(';')
            .map(cookie => {
              const [name, value] = cookie.trim().split('=');
              return { name, value };
            }) ?? [];
        },
        setAll(cookiesToSet) {
          // Middleware não pode definir cookies diretamente
          // Isso será tratado pela resposta do middleware
        },
      },
    }
  );
}