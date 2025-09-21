// Configuração PostCSS compatível com Vercel
// Este arquivo garante que o PostCSS funcione corretamente no ambiente serverless

module.exports = {
  plugins: {
    // Tailwind CSS - configuração básica
    tailwindcss: {},
    // Autoprefixer - adiciona prefixos CSS automaticamente
    autoprefixer: {},
  },
};