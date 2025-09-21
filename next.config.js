/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;