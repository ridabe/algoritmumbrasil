import type { Config } from 'tailwindcss';

const config: Config = {
  // Configuração para Tailwind CSS v4
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Configurações específicas para resolver problemas do Vercel
  future: {
    // Desabilitar recursos que podem causar problemas no build
    hoverOnlyWhenSupported: true,
  },
  
  // Configurações de tema (mantendo compatibilidade com CSS variables)
  theme: {
    extend: {
      // Configurações customizadas podem ser adicionadas aqui
    },
  },
  
  // Plugins necessários
  plugins: [],
  
  // Configurações específicas para o ambiente de produção
  ...(process.env.NODE_ENV === 'production' && {
    // Otimizações para produção
    experimental: {
      optimizeUniversalDefaults: true,
    },
  }),
};

export default config;