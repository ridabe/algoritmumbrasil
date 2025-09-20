/**
 * Route Handler para callback de autenticação do Supabase
 * Processa o retorno da autenticação OAuth e redireciona o usuário
 */

import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/financas';

  if (code) {
    const cookieStore = cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // O cookie pode não ser definido em alguns casos
              console.error('Erro ao definir cookie:', error);
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // O cookie pode não ser removido em alguns casos
              console.error('Erro ao remover cookie:', error);
            }
          },
        },
      }
    );

    try {
      // Trocar o código por uma sessão
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        // Redirecionar para a página de destino
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      }
    } catch (error) {
      console.error('Erro no callback de autenticação:', error);
    }
  }

  // Retornar para a página de login em caso de erro
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}