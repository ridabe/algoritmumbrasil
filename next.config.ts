import type { NextConfig } from "next";

/**
 * Validação das variáveis de ambiente obrigatórias
 * Previne erros de deploy por falta de configuração do Supabase
 */
function validateEnvironmentVariables() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias não configuradas:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n📖 Consulte o arquivo DEPLOY.md para instruções de configuração.');
    console.error('🔗 Obtenha suas credenciais em: https://supabase.com/dashboard/project/_/settings/api');
    
    // Em desenvolvimento, apenas avisa. Em produção, falha o build
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Variáveis de ambiente do Supabase não configuradas!');
    }
  }
}

// Executa validação durante o build
validateEnvironmentVariables();

const nextConfig: NextConfig = {
  // Configurações para melhor performance e compatibilidade
  serverExternalPackages: ['@supabase/ssr'],
  
  // Configuração de imagens para Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
