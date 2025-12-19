import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboardStore } from '@/store/dashboardStore';
import { PieChartWidgetConfig, CustomerOrder, ORDER_FIELDS } from '@/types/dashboard';

interface PieChartWidgetProps {
  config: PieChartWidgetConfig;
}

const COLORS = ['#54bd95', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

export const PieChartWidget = ({ config }: PieChartWidgetProps) => {
  const orders = useDashboardStore((state) => {
    const userOrders = state.currentUserId ? (state.userOrders[state.currentUserId] || []) : [];
    const now = new Date();
    return userOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      switch (state.dateFilter) {
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
  });

  const chartData = useMemo(() => {
    if (!config.dataField || orders.length === 0) return [];

    const groupedData: Record<string, number> = {};

    orders.forEach((order: CustomerOrder) => {
      const value = String(order[config.dataField]);
      groupedData[value] = (groupedData[value] || 0) + 1;
    });

    return Object.entries(groupedData).map(([name, value]) => ({
      name,
      value,
    }));
  }, [orders, config.dataField]);

  const fieldLabel = ORDER_FIELDS.find(f => f.key === config.dataField)?.label || config.dataField;

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        <p>No data available. Configure data field and add orders.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill={config.chartColor || '#54bd95'}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        {config.showLegend && (
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};
