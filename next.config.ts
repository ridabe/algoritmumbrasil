import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações essenciais para Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuração de imagens para Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  }
};

export default nextConfig;
