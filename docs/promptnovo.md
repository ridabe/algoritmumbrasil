“Home Algoritmum como página inicial + Hub de Sistemas (inclui Sistema Financeiro)”

Objetivo: Reestruturar o projeto para que a página inicial (/) seja a landing page institucional da Algoritmum Brasil. O Sistema Financeiro (que hoje abre na home) deve ser movido para o menu “Sistemas” → “Sistema Financeiro”, carregando sua página inicial dentro dessa rota.

Stack alvo: Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + ícones lucide + framer-motion.
Hospedagem: Vercel. Locale/Moeda: pt-BR, BRL. Timezone: America/Sao_Paulo.

1) Landing Page da Algoritmum (Home /)

Crie uma landing page moderna (estética jovem/tech) com as seções:

Hero (acima da dobra)

Headline: “Algoritmum Brasil — Tecnologia, Consultoria, Desenvolvimento de Sistemas e IA”

Subheadline: “Há 20 anos acelerando negócios com software, dados e inteligência artificial.”

CTA primário: “Fale Conosco” (rola até seção de contato)

CTA secundário: “Conheça Nossos Sistemas” (leva para /sistemas)

Background com gradiente suave + microanimações (framer-motion)

Sobre a Empresa

Texto curto: A Algoritmum Brasil é uma empresa 100% voltada à tecnologia, consultoria, desenvolvimento de sistemas e inteligência artificial, com 20 anos de experiência e atuação em todo o Brasil.

Lista de frentes: Produtos digitais, Arquitetura e Escalabilidade, RPA, Data & IA, Cloud/DevOps.

Clientes Atendidos (prova social)

Grade com logotipos/nome dos clientes (placeholders com alt text):

Dot Digital Group

BNE — Banco Nacional de Emprego

Added

Grupo Boticário

DMCard

RDias

Grupo Júlio Simões

Adicionar tooltip “amostra de clientes atendidos no Brasil”.

Soluções & Sistemas Próprios

Cards listando os sistemas desenvolvidos internamente (gerar a partir de um array).

Primeiro item deve ser “Sistema Financeiro” (linka para /sistemas/financeiro).

Fale Conosco

Formulário (nome, email, empresa, mensagem).

Envio: pode usar uma Route Handler/API local (POST) + envio por email (resend) OU gravar em Supabase (tabela contacts).

Mensagem de sucesso e fallback graceful error.

Footer

Direitos autorais, links rápidos (Sobre, Sistemas, Fale Conosco), redes sociais (placeholders).

SEO/Branding:

Metatags: title, description, OG, favicon.

robots.txt e sitemap.xml.

Acessibilidade (ARIA, contraste AA, foco visível).

Responsivo mobile-first.

2) Menu de Navegação (global)

Itens do menu (top navbar):

Sobre a empresa → /sobre

Sistemas (dropdown) → /sistemas (hub) com subitens:

Sistema Financeiro → /sistemas/financeiro

(deixe placeholders para outros sistemas)

Fale Conosco → âncora da home /#contato ou rota /fale-conosco

Estado “ativo” e realce no hover; tema claro/escuro com toggle persistente.

3) Hub de Sistemas (/sistemas)

Página que lista todos os sistemas próprios da Algoritmum com cards:

Sistema Financeiro (destacado como primeiro): título, breve descrição, CTA “Acessar”.

Outros placeholders (ex.: “RPA Suite”, “Data & IA Workbench”), apenas como cards inativos.

Estrutura baseada em um array de sistemas (nome, slug, descrição, ícone, status).

4) Sistema Financeiro movido para menu “Sistemas”

Mover a página inicial atual do Sistema Financeiro (que hoje abre na home) para a rota /sistemas/financeiro mantendo todo o comportamento original.

Compatibilidade/Redirect: adicionar redirect 301 de /financas → /sistemas/financeiro em next.config.js (ou via Route Handler) para não quebrar links antigos.

Se o módulo tiver auth Supabase, manter o guard ao acessar /sistemas/financeiro (login se não autenticado).

Preservar integrações existentes (Supabase, MCP, etc.), apenas mudando o caminho/rota.

5) Páginas adicionais

/sobre: página institucional expandida (história, abordagem, stack, valores, metodologia ágil, cases).

/fale-conosco (opcional se não usar âncora): mesma seção/validação do formulário da home, reusando componente.

6) Estilo/UI

Tailwind + shadcn/ui, ícones lucide-react, microanimações com framer-motion.

Paleta “tech jovem”: base neutra com acentos vibrantes (azul/roxo/verde suaves).

Cards com bordas arredondadas 2xl, sombras suaves, grid responsivo.

Tipografia legível, headings fortes; empty states simpáticos; loaders discretos.

7) Arquitetura de Rotas (App Router)

/ → Landing Algoritmum (nova home)

/sobre → Institucional

/sistemas → Hub de Sistemas (lista)

/sistemas/financeiro → Sistema Financeiro (página inicial atual movida para cá)

(Opcional) /fale-conosco → Form de contato (se não usar âncora)

Redirect: /financas → /sistemas/financeiro (301)

8) Conteúdo (copiar para textos iniciais)

Headline: “Algoritmum Brasil — Tecnologia, Consultoria, Desenvolvimento de Sistemas e IA”

Subheadline: “Há 20 anos impulsionando resultados com software, dados e inteligência artificial.”

Parágrafo sobre: “Somos uma empresa 100% focada em tecnologia: ajudamos organizações a conceber, construir e escalar produtos digitais, automatizar processos e aplicar IA de ponta a ponta.”

Clientes (nomes exatos): “Dot Digital Group, BNE — Banco Nacional de Emprego, Added, Grupo Boticário, DMCard, RDias, Grupo Júlio Simões.”

9) Implementação técnica

Criar layout root com navbar/footer compartilhados.

Criar componentes: Navbar, Footer, Hero, Clients, SolutionsGrid, ContactForm.

ContactForm com validação Zod + RHF; persistência (Supabase ou email provider).

Adicionar metadata e generateMetadata para SEO nas páginas.

Configurar Vercel Analytics e OG Image.

Garantir i18n pt-BR (datas e moeda).

Não expor chaves sensíveis (service_role) no cliente.

10) Aceite

Ao abrir o domínio, a primeira página é a landing da Algoritmum com menu e seções descritas.

Menu “Sistemas” lista Sistema Financeiro como primeiro item e o link leva a /sistemas/financeiro, carregando a página inicial atual do módulo.

Redirect /financas funcionando (301).

Form de contato envia e confirma.

UI moderna, responsiva, acessível; tema dark/light.

Deploy funcional no Vercel com as mesmas envs já usadas pelo sistema financeiro.

Extras (se já quiser, implemente também)

sitemap.xml, robots.txt

Favicons e OG image customizada “Algoritmum Brasil”

Telemetria básica de cliques nos CTAs e nos cards de sistemas

Importante: Não reescreva o Sistema Financeiro; apenas mova a página inicial dele para /sistemas/financeiro e ajuste o menu. Preserve integrações existentes (Supabase, MCP, etc.).