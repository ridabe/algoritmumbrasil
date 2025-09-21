/**
 * Tipos TypeScript para bibliotecas carregadas via CDN
 * Permite usar as bibliotecas externas com type safety
 */

declare global {
  interface Window {
    // Date manipulation library
    dateFns: {
      format: (date: Date | number, formatStr: string) => string;
      parseISO: (dateString: string) => Date;
      addDays: (date: Date, amount: number) => Date;
      subDays: (date: Date, amount: number) => Date;
      startOfMonth: (date: Date) => Date;
      endOfMonth: (date: Date) => Date;
      isAfter: (date: Date, dateToCompare: Date) => boolean;
      isBefore: (date: Date, dateToCompare: Date) => boolean;
      differenceInDays: (dateLeft: Date, dateRight: Date) => number;
      [key: string]: any;
    };
    
    // Decimal.js for precise calculations
    Decimal: {
      new (value: string | number): {
        plus: (value: string | number) => any;
        minus: (value: string | number) => any;
        mul: (value: string | number) => any;
        div: (value: string | number) => any;
        toNumber: () => number;
        toString: () => string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    
    // Class name utility
    clsx: (...args: any[]) => string;
    
    // Lucide React icons
    LucideReact: {
      [iconName: string]: React.ComponentType<{
        size?: number | string;
        color?: string;
        strokeWidth?: number;
        className?: string;
        [key: string]: any;
      }>;
    };
    
    // Recharts library
    Recharts: {
      LineChart: React.ComponentType<any>;
      BarChart: React.ComponentType<any>;
      PieChart: React.ComponentType<any>;
      AreaChart: React.ComponentType<any>;
      XAxis: React.ComponentType<any>;
      YAxis: React.ComponentType<any>;
      CartesianGrid: React.ComponentType<any>;
      Tooltip: React.ComponentType<any>;
      Legend: React.ComponentType<any>;
      Line: React.ComponentType<any>;
      Bar: React.ComponentType<any>;
      Area: React.ComponentType<any>;
      Pie: React.ComponentType<any>;
      Cell: React.ComponentType<any>;
      ResponsiveContainer: React.ComponentType<any>;
      [key: string]: any;
    };
    
    // Zod validation library
    z: {
      string: () => any;
      number: () => any;
      boolean: () => any;
      object: (shape: any) => any;
      array: (schema: any) => any;
      optional: (schema: any) => any;
      nullable: (schema: any) => any;
      enum: (values: any[]) => any;
      union: (schemas: any[]) => any;
      literal: (value: any) => any;
      [key: string]: any;
    };
  }
}

// Helper functions to safely access CDN libraries
export const getCDNLibrary = {
  dateFns: () => {
    if (typeof window !== 'undefined' && window.dateFns) {
      return window.dateFns;
    }
    throw new Error('date-fns CDN library not loaded');
  },
  
  Decimal: () => {
    if (typeof window !== 'undefined' && window.Decimal) {
      return window.Decimal;
    }
    throw new Error('Decimal.js CDN library not loaded');
  },
  
  clsx: () => {
    if (typeof window !== 'undefined' && window.clsx) {
      return window.clsx;
    }
    throw new Error('clsx CDN library not loaded');
  },
  
  LucideReact: () => {
    if (typeof window !== 'undefined' && window.LucideReact) {
      return window.LucideReact;
    }
    throw new Error('lucide-react CDN library not loaded');
  },
  
  Recharts: () => {
    if (typeof window !== 'undefined' && window.Recharts) {
      return window.Recharts;
    }
    throw new Error('recharts CDN library not loaded');
  },
  
  zod: () => {
    if (typeof window !== 'undefined' && window.z) {
      return window.z;
    }
    throw new Error('zod CDN library not loaded');
  },
};

export {};