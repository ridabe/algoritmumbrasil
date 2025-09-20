import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  format?: 'currency' | 'number';
  className?: string;
}

/**
 * Componente de card para exibir KPIs (Key Performance Indicators)
 * Mostra título, valor, ícone e tendência opcional
 */
export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  format = 'currency',
  className 
}: KPICardProps) {
  /**
   * Formata o valor baseado no tipo especificado
   */
  const formatValue = (val: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(val);
    }
    return val.toLocaleString('pt-BR');
  };

  /**
   * Formata a porcentagem de tendência
   */
  const formatTrend = (trendValue: number) => {
    const sign = trendValue > 0 ? '+' : '';
    return `${sign}${trendValue.toFixed(1)}%`;
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(value)}
        </div>
        {trend && (
          <p className={cn(
            "text-xs mt-1",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {formatTrend(trend.value)} em relação ao mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}