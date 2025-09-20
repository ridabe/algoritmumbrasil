# Algoritmum - Gestão Financeira Inteligente

Plataforma completa para gestão financeira pessoal e empresarial desenvolvida com Next.js 15, TypeScript e Supabase.

## 🚀 Funcionalidades

- ✅ **Sistema de Autenticação Completo**
  - Login e registro com email/senha
  - Proteção de rotas com middleware
  - Gerenciamento de sessão com Supabase Auth
  - Context API para estado global

- 🎨 **Interface Moderna**
  - Design responsivo com Tailwind CSS
  - Componentes shadcn/ui
  - Tema claro/escuro
  - Ícones Lucide React

- 🔒 **Segurança**
  - Middleware de proteção de rotas
  - Validação de formulários
  - Tratamento de erros
  - Políticas RLS no Supabase

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth + Database)
- **ORM**: Drizzle ORM
- **Validação**: Zod
- **Formulários**: React Hook Form

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ridabe/algoritmumbrasil.git
cd algoritmumbrasil
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

4. Execute o projeto:
```bash
npm run dev
```

## 📋 Configuração do Supabase

Veja o arquivo `SUPABASE_SETUP.md` para instruções detalhadas de configuração do banco de dados.

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── auth/              # Páginas de autenticação
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de registro
│   ├── financas/          # Dashboard financeiro
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   └── ui/               # Componentes shadcn/ui
├── contexts/             # Context API
│   └── auth-context.tsx  # Contexto de autenticação
├── lib/                  # Utilitários e configurações
│   ├── auth/            # Serviços de autenticação
│   ├── db/              # Configuração do banco
│   └── utils.ts         # Funções utilitárias
└── middleware.ts         # Middleware de proteção
```

## 🔐 Autenticação

O sistema de autenticação inclui:

- **Login**: Email e senha com validação
- **Registro**: Criação de conta com perfil
- **Proteção de Rotas**: Middleware automático
- **Gerenciamento de Estado**: Context API
- **Redirecionamentos**: Automáticos baseados no status

## 📱 Páginas

- `/` - Landing page
- `/auth/login` - Página de login
- `/auth/register` - Página de registro
- `/financas` - Dashboard (protegido)

## 🚀 Deploy

O projeto está configurado para deploy na Vercel:

1. Conecte seu repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido por **AlgoritmumBrasil** - Especialistas em desenvolvimento de sistemas e soluções tecnológicas.

---

**Algoritmum** - Transformando sua relação com o dinheiro através da tecnologia.