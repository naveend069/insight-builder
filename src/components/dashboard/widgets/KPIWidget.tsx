import { useMemo } from 'react';
import { KPIWidgetConfig } from '@/types/dashboard';
import { useDashboardStore } from '@/store/dashboardStore';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIWidgetProps {
  config: KPIWidgetConfig;
}

export const KPIWidget = ({ config }: KPIWidgetProps) => {
  const userOrders = useDashboardStore((state) => 
    state.currentUserId ? (state.userOrders[state.currentUserId] || []) : []
  );
  const dateFilter = useDashboardStore((state) => state.dateFilter);

  const orders = useMemo(() => {
    const now = new Date();
    return userOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      switch (dateFilter) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'last-7-days':
          return now.getTime() - orderDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case 'last-30-days':
          return now.getTime() - orderDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        case 'last-90-days':
          return now.getTime() - orderDate.getTime() <= 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
  }, [userOrders, dateFilter]);

  const value = useMemo(() => {
    if (!config.metric || orders.length === 0) return 0;

    const values = orders.map((order) => {
      const val = order[config.metric];
      return typeof val === 'number' ? val : 0;
    });

    switch (config.aggregation) {
      case 'sum':
        return values.reduce((a, b) => a + b, 0);
      case 'average':
        return values.reduce((a, b) => a + b, 0) / values.length;
      case 'count':
        return orders.length;
      default:
        return 0;
    }
  }, [orders, config.metric, config.aggregation]);

  const formattedValue = config.dataFormat === 'currency'
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: config.decimalPrecision,
        maximumFractionDigits: config.decimalPrecision,
      }).format(value)
    : new Intl.NumberFormat('en-US', {
        minimumFractionDigits: config.decimalPrecision,
        maximumFractionDigits: config.decimalPrecision,
      }).format(value);

  // Simple trend indicator (mock for demo - memoized to prevent re-renders)
  const { trend, trendPercent } = useMemo(() => ({
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'neutral',
    trendPercent: (Math.random() * 20).toFixed(1)
  }), [orders.length]);

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="space-y-2">
        <p className="text-3xl font-bold text-foreground tracking-tight">
          {formattedValue}
        </p>
        
        {config.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {config.description}
          </p>
        )}

        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          trend === 'up' && "text-kpi-positive",
          trend === 'down' && "text-kpi-negative",
          trend === 'neutral' && "text-muted-foreground"
        )}>
          {trend === 'up' && <TrendingUp className="h-4 w-4" />}
          {trend === 'down' && <TrendingDown className="h-4 w-4" />}
          {trend === 'neutral' && <Minus className="h-4 w-4" />}
          <span>{trend === 'neutral' ? 'No change' : `${trendPercent}%`}</span>
        </div>
      </div>
    </div>
  );
};
