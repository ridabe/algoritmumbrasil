import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações de ambiente
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Pacotes externos para o servidor
  serverExternalPackages: ['@supabase/supabase-js', '@supabase/ssr'],
  
  // Configurações experimentais removidas para compatibilidade
  // experimental: {},
  
  // Força o uso do PostCSS tradicional
  compiler: {
    // Remove console.log em produção
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configuração CSS para compatibilidade com Vercel
  sassOptions: {
    includePaths: [],
  },
  // Configurações de redirect para manter compatibilidade com URLs antigas
  async redirects() {
    return [
      {
        source: '/financas',
        destination: '/sistemas/financeiro',
        permanent: true, // 301 redirect
      },
      {
        source: '/financas/:path*',
        destination: '/sistemas/financeiro/:path*',
        permanent: true, // 301 redirect
      },
    ];
  },
  
  // Configurações de imagem otimizada
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  },
  
  // Configurações experimentais removidas para compatibilidade com Vercel
  
  // Configurações do ESLint para permitir build
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  
  // Configurações do TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Headers básicos de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
  
  // Configuração webpack mínima
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
};

export default nextConfig;
