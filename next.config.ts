import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações de ambiente
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Pacotes externos para o servidor
  serverExternalPackages: ['@supabase/supabase-js', '@supabase/ssr'],
  
  // Configurações experimentais para compatibilidade com Vercel
  experimental: {
    // Desabilita otimizações CSS que podem causar problemas no Vercel
    optimizeCss: false,
    // Configurações para Edge Runtime
    serverComponentsExternalPackages: ['@supabase/supabase-js', '@supabase/ssr'],
  },
  
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
  
  // Configuração webpack robusta para Vercel
  webpack: (config, { dev, isServer }) => {
    // Configuração para evitar problemas com PostCSS no Vercel
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      util: false,
    };

    // Configuração específica para PostCSS no ambiente serverless
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'postcss/lib/postcss': 'postcss',
      };
    }

    // Desabilitar completamente lightningcss
    config.resolve.alias = {
      ...config.resolve.alias,
      'lightningcss': false,
    };

    // Ignorar módulos problemáticos no Vercel
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        'lightningcss': 'lightningcss',
        'lightningcss-linux-x64-gnu': 'lightningcss-linux-x64-gnu',
        'lightningcss-linux-x64-musl': 'lightningcss-linux-x64-musl',
        'lightningcss-darwin-x64': 'lightningcss-darwin-x64',
        'lightningcss-darwin-arm64': 'lightningcss-darwin-arm64',
        'lightningcss-win32-x64-msvc': 'lightningcss-win32-x64-msvc',
      });
    }
    
    return config;
  },
};

export default nextConfig;
