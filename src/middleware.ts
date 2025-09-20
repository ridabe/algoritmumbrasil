import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware para autenticação e proteção de rotas
 * Verifica se o usuário está autenticado e redireciona conforme necessário
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Verifica se as variáveis de ambiente do Supabase estão configuradas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let user = null

  // Só tenta autenticar se as variáveis estão configuradas
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    try {
      // Obtém o usuário atual
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch (error) {
      console.warn('Erro ao verificar autenticação:', error)
      // Continua sem usuário se houver erro
    }
  }

  const { pathname } = request.nextUrl
  
  // Rotas protegidas que precisam de autenticação
  const protectedRoutes = ['/financas']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Se usuário não está logado e tenta acessar rota protegida
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Se usuário está logado e tenta acessar páginas de auth, redireciona para dashboard
  if (user && (pathname === '/auth/login' || pathname === '/auth/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/financas'
    return NextResponse.redirect(url)
  }

  // Se usuário está logado e acessa a página inicial, redireciona para dashboard
  if (user && pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/financas'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}