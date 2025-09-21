/**
 * Exemplo de uso das bibliotecas CDN
 * Demonstra como usar as bibliotecas carregadas via CDN de forma segura
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useDateFns, useDecimal, useClsx, useLucideIcons, useRecharts, useZod, checkCDNAvailability } from '@/lib/cdn-utils';

interface CDNExampleProps {
  className?: string;
}

export function CDNUsageExample({ className }: CDNExampleProps) {
  const [cdnStatus, setCdnStatus] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  const dateFns = useDateFns();
  const decimal = useDecimal();
  const { cn } = useClsx();
  const { getIcon } = useLucideIcons();
  const { getComponent, isAvailable: rechartsAvailable } = useRecharts();
  const { z } = useZod();

  useEffect(() => {
    setMounted(true);
    // Verificar disponibilidade das bibliotecas CDN após o carregamento
    const checkStatus = () => {
      const status = checkCDNAvailability();
      setCdnStatus(status);
    };
    
    // Aguardar um pouco para as bibliotecas CDN carregarem
    const timer = setTimeout(checkStatus, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div>Carregando...</div>;
  }

  // Exemplo de uso do date-fns
  const currentDate = new Date();
  const formattedDate = dateFns.format(currentDate, 'dd/MM/yyyy HH:mm');
  const futureDate = dateFns.addDays(currentDate, 7);
  const daysDifference = dateFns.differenceInDays(futureDate, currentDate);

  // Exemplo de uso do Decimal.js
  const price1 = decimal.create('19.99');
  const price2 = decimal.create('5.01');
  const total = typeof price1.plus === 'function' ? price1.plus('5.01') : Number(price1) + Number(price2);

  // Exemplo de uso do clsx
  const buttonClasses = cn(
    'px-4 py-2 rounded-md transition-colors',
    {
      'bg-blue-500 text-white': true,
      'hover:bg-blue-600': true,
    },
    className
  );

  // Exemplo de uso dos ícones Lucide
  const CalendarIcon = getIcon('Calendar');
  const DollarSignIcon = getIcon('DollarSign');
  const CheckCircleIcon = getIcon('CheckCircle');

  // Exemplo de schema Zod
  const userSchema = z.object ? z.object({
    name: z.string(),
    email: z.string(),
    age: z.number(),
  }) : null;

  // Dados de exemplo para gráfico
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Fev', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Abr', value: 800 },
    { name: 'Mai', value: 500 },
  ];

  // Componentes Recharts
  const LineChart = getComponent('LineChart');
  const Line = getComponent('Line');
  const XAxis = getComponent('XAxis');
  const YAxis = getComponent('YAxis');
  const CartesianGrid = getComponent('CartesianGrid');
  const Tooltip = getComponent('Tooltip');
  const ResponsiveContainer = getComponent('ResponsiveContainer');

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Exemplo de Uso das Bibliotecas CDN
      </h2>

      {/* Status das bibliotecas CDN */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Status das Bibliotecas CDN:</h3>
        {cdnStatus && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {Object.entries(cdnStatus).map(([lib, available]) => (
              <div key={lib} className="flex items-center space-x-2">
                {CheckCircleIcon && (
                  <CheckCircleIcon 
                    size={16} 
                    className={available ? 'text-green-500' : 'text-red-500'} 
                  />
                )}
                <span className={available ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                  {lib}: {available ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exemplo date-fns */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          {CalendarIcon && <CalendarIcon size={20} />}
          <span>Date-fns (Manipulação de Datas)</span>
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
          <p><strong>Data atual:</strong> {formattedDate}</p>
          <p><strong>Data futura (+7 dias):</strong> {dateFns.format(futureDate, 'dd/MM/yyyy')}</p>
          <p><strong>Diferença em dias:</strong> {daysDifference} dias</p>
        </div>
      </div>

      {/* Exemplo Decimal.js */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          {DollarSignIcon && <DollarSignIcon size={20} />}
          <span>Decimal.js (Cálculos Precisos)</span>
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
          <p><strong>Preço 1:</strong> R$ 19,99</p>
          <p><strong>Preço 2:</strong> R$ 5,01</p>
          <p><strong>Total:</strong> R$ {typeof total === 'object' && total.toString ? total.toString() : total}</p>
        </div>
      </div>

      {/* Exemplo clsx */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Clsx (Classes Condicionais)</h3>
        <button className={buttonClasses}>
          Botão com classes dinâmicas
        </button>
      </div>

      {/* Exemplo Zod */}
      {userSchema && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Zod (Validação)</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
            <p>Schema de usuário criado com sucesso!</p>
            <pre className="text-xs mt-2 text-gray-600 dark:text-gray-400">
              {JSON.stringify({ name: 'string', email: 'string', age: 'number' }, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Exemplo Recharts */}
      {rechartsAvailable() && LineChart && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Recharts (Gráficos)</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Fallback para Recharts */}
      {!rechartsAvailable() && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Recharts (Gráficos)</h3>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm text-yellow-800 dark:text-yellow-200">
            Biblioteca Recharts não disponível. Gráfico não pode ser exibido.
          </div>
        </div>
      )}
    </div>
  );
}