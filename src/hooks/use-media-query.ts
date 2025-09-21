/**
 * Hook para detectar media queries
 * Útil para componentes responsivos
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Hook que monitora uma media query e retorna se ela está ativa
 * @param query - A media query para monitorar (ex: '(min-width: 768px)')
 * @returns boolean indicando se a media query está ativa
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Verifica se estamos no cliente (não no servidor)
    if (typeof window === 'undefined' || !mounted) {
      return;
    }

    const media = window.matchMedia(query);
    
    // Define o estado inicial
    setMatches(media.matches);

    // Função para atualizar o estado quando a media query muda
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adiciona o listener
    media.addEventListener('change', listener);

    // Cleanup: remove o listener quando o componente é desmontado
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query, mounted]);

  // Retorna false durante a hidratação para evitar mismatch
  if (!mounted) {
    return false;
  }

  return matches;
}

export default useMediaQuery;