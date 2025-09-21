/**
 * Utilitários para usar bibliotecas CDN de forma segura
 * Fornece fallbacks e verificações de disponibilidade
 */

import { getCDNLibrary } from '@/types/cdn';

/**
 * Hook personalizado para usar date-fns via CDN
 * Fornece as funções mais comuns com fallbacks
 */
export const useDateFns = () => {
  const formatDate = (date: Date | string, format: string = 'dd/MM/yyyy'): string => {
    try {
      const dateFns = getCDNLibrary.dateFns();
      const dateObj = typeof date === 'string' ? dateFns.parseISO(date) : date;
      return dateFns.format(dateObj, format);
    } catch {
      // Fallback para formatação básica
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('pt-BR');
    }
  };

  const parseDate = (dateString: string): Date => {
    try {
      const dateFns = getCDNLibrary.dateFns();
      return dateFns.parseISO(dateString);
    } catch {
      return new Date(dateString);
    }
  };

  const addDays = (date: Date, days: number): Date => {
    try {
      const dateFns = getCDNLibrary.dateFns();
      return dateFns.addDays(date, days);
    } catch {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
  };

  const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
    try {
      const dateFns = getCDNLibrary.dateFns();
      return dateFns.differenceInDays(dateLeft, dateRight);
    } catch {
      const diffTime = Math.abs(dateLeft.getTime() - dateRight.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  };

  return {
    format: formatDate,
    parseISO: parseDate,
    addDays,
    differenceInDays,
  };
};

/**
 * Utilitário para cálculos decimais precisos via CDN
 */
export const useDecimal = () => {
  const create = (value: string | number) => {
    try {
      const Decimal = getCDNLibrary.Decimal();
      return new Decimal(value);
    } catch {
      // Fallback para Number (menos preciso)
      return {
        plus: (val: string | number) => Number(value) + Number(val),
        minus: (val: string | number) => Number(value) - Number(val),
        mul: (val: string | number) => Number(value) * Number(val),
        div: (val: string | number) => Number(value) / Number(val),
        toNumber: () => Number(value),
        toString: () => String(value),
      };
    }
  };

  return { create };
};

/**
 * Utilitário para classes CSS condicionais via CDN
 */
export const useClsx = () => {
  const cn = (...args: any[]): string => {
    try {
      const clsx = getCDNLibrary.clsx();
      return clsx(...args);
    } catch {
      // Fallback simples para concatenação de classes
      return args
        .filter(Boolean)
        .map(arg => {
          if (typeof arg === 'string') return arg;
          if (typeof arg === 'object' && arg !== null) {
            return Object.entries(arg)
              .filter(([, value]) => Boolean(value))
              .map(([key]) => key)
              .join(' ');
          }
          return '';
        })
        .join(' ')
        .trim();
    }
  };

  return { cn };
};

/**
 * Utilitário para ícones Lucide via CDN
 */
export const useLucideIcons = () => {
  const getIcon = (iconName: string) => {
    try {
      const LucideReact = getCDNLibrary.LucideReact();
      return LucideReact[iconName] || null;
    } catch {
      // Fallback para um componente vazio
      return null;
    }
  };

  return { getIcon };
};

/**
 * Utilitário para validação com Zod via CDN
 */
export const useZod = () => {
  const createSchema = () => {
    try {
      return getCDNLibrary.zod();
    } catch {
      // Fallback básico sem validação
      return {
        string: () => ({ parse: (val: any) => String(val) }),
        number: () => ({ parse: (val: any) => Number(val) }),
        boolean: () => ({ parse: (val: any) => Boolean(val) }),
        object: () => ({ parse: (val: any) => val }),
        array: () => ({ parse: (val: any) => Array.isArray(val) ? val : [] }),
      };
    }
  };

  return { z: createSchema() };
};

/**
 * Utilitário para gráficos Recharts via CDN
 */
export const useRecharts = () => {
  const getComponent = (componentName: string) => {
    try {
      const Recharts = getCDNLibrary.Recharts();
      return Recharts[componentName] || null;
    } catch {
      // Fallback para componente vazio
      return null;
    }
  };

  const isAvailable = (): boolean => {
    try {
      getCDNLibrary.Recharts();
      return true;
    } catch {
      return false;
    }
  };

  return { getComponent, isAvailable };
};

/**
 * Verificador geral de disponibilidade das bibliotecas CDN
 */
export const checkCDNAvailability = () => {
  const libraries = {
    dateFns: false,
    decimal: false,
    clsx: false,
    lucideReact: false,
    recharts: false,
    zod: false,
  };

  try {
    getCDNLibrary.dateFns();
    libraries.dateFns = true;
  } catch {}

  try {
    getCDNLibrary.Decimal();
    libraries.decimal = true;
  } catch {}

  try {
    getCDNLibrary.clsx();
    libraries.clsx = true;
  } catch {}

  try {
    getCDNLibrary.LucideReact();
    libraries.lucideReact = true;
  } catch {}

  try {
    getCDNLibrary.Recharts();
    libraries.recharts = true;
  } catch {}

  try {
    getCDNLibrary.zod();
    libraries.zod = true;
  } catch {}

  return libraries;
};