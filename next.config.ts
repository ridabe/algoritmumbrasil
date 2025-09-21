import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  
  // Configurações experimentais
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Configurações do ESLint para permitir build
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  
  // Configurações do TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configurações específicas para resolver problemas do Vercel com LightningCSS
  webpack: (config, { isServer }) => {
    // Resolver problemas com módulos nativos no Vercel
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        process: false,
        buffer: false,
      };
      
      // Configurar bibliotecas externas via CDN
      config.externals = {
        ...config.externals,
        'date-fns': 'dateFns',
        'decimal.js': 'Decimal',
        'clsx': 'clsx',
        'lucide-react': 'LucideReact',
        'recharts': 'Recharts',
        'zod': 'z',
      };
    }
    
    // Resolver problemas do Supabase com Edge Runtime
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/supabase-js': '@supabase/supabase-js/dist/module/index.js',
    };
    
    // Ignorar módulos nativos do LightningCSS durante o build
    if (!config.externals) config.externals = [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        'lightningcss-linux-x64-gnu': 'lightningcss-linux-x64-gnu',
        'lightningcss-darwin-x64': 'lightningcss-darwin-x64',
        'lightningcss-darwin-arm64': 'lightningcss-darwin-arm64',
        'lightningcss-win32-x64-msvc': 'lightningcss-win32-x64-msvc',
      });
    }
    
    return config;
  },
};

export default nextConfig;
