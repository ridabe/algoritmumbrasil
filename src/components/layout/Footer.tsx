/**
 * Componente de rodapé global
 * Inclui informações da empresa, links úteis e redes sociais
 */

'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

/**
 * Seções do rodapé
 */
const footerSections: FooterSection[] = [
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre Nós', href: '/sobre' },
      { label: 'Nossa História', href: '/sobre#historia' },
      { label: 'Missão e Valores', href: '/sobre#missao' },
      { label: 'Equipe', href: '/sobre#equipe' }
    ]
  },
  {
    title: 'Sistemas',
    links: [
      { label: 'Monetrix', href: '/sistemas/financeiro' },
      { label: 'RPA Suite', href: '/sistemas/rpa' },
      { label: 'Data & IA Workbench', href: '/sistemas/data-ia' },
      { label: 'Todos os Sistemas', href: '/sistemas' }
    ]
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de Ajuda', href: '/ajuda' },
      { label: 'Documentação', href: '/docs' },
      { label: 'Fale Conosco', href: '/#contato' },
      { label: 'Status dos Sistemas', href: '/status' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Termos de Uso', href: '/termos' },
      { label: 'Política de Privacidade', href: '/privacidade' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'LGPD', href: '/lgpd' }
    ]
  }
];

/**
 * Redes sociais
 */
const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/algoritmum-brasil',
    icon: Github
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/algoritmum-brasil',
    icon: Linkedin
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/algoritmumbrasil',
    icon: Instagram
  }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Conteúdo Principal */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Informações da Empresa */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center mb-4">
                <img 
                  src="/algoritmum-logo-compact.svg" 
                  alt="Algoritmum Brasil" 
                  className="h-8 w-auto"
                />
              </Link>
              
              <p className="text-muted-foreground text-sm mb-6 max-w-md">
                Desenvolvemos soluções tecnológicas inovadoras para transformar a gestão empresarial. 
                Especialistas em automação, análise de dados e sistemas integrados.
              </p>

              {/* Informações de Contato */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>contato@algoritmumbrasil.com.br</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+55 (11) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="flex items-center space-x-2 mt-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-muted-foreground hover:text-primary"
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Links do Rodapé */}
            {footerSections.map((section) => (
              <div key={section.title} className="lg:col-span-1">
                <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rodapé Inferior */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Algoritmum Brasil. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>CNPJ: 00.000.000/0001-00</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Versão 2.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}