'use client';

import { useEffect } from 'react';

/**
 * Componente para garantir que CSS seja carregado corretamente
 * Monitora o carregamento do Tailwind CSS sem interferir nos estilos
 */
export function CriticalCSS() {
  useEffect(() => {
    // Verifica se o CSS do Tailwind foi carregado
    const checkTailwindLoaded = () => {
      const testElement = document.createElement('div');
      testElement.className = 'hidden';
      testElement.style.position = 'absolute';
      testElement.style.top = '-9999px';
      document.body.appendChild(testElement);
      
      const isHidden = window.getComputedStyle(testElement).display === 'none';
      document.body.removeChild(testElement);
      
      if (!isHidden) {
        console.warn('Tailwind CSS não foi carregado corretamente');
        // Tenta recarregar o CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/_next/static/css/app/globals.css';
        document.head.appendChild(link);
      } else {
        console.log('Tailwind CSS carregado com sucesso');
      }
    };
    
    // Verifica após um pequeno delay
    setTimeout(checkTailwindLoaded, 500);
  }, []);

  // Não renderiza nenhum CSS inline para evitar conflitos
  return null;
}