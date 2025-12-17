import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useDashboardStore } from '@/store/dashboardStore';
import { ChartWidgetConfig, CustomerOrder, ORDER_FIELDS } from '@/types/dashboard';

interface ScatterPlotWidgetProps {
  config: ChartWidgetConfig;
}

export const ScatterPlotWidget = ({ config }: ScatterPlotWidgetProps) => {
  const { getFilteredOrders } = useDashboardStore();
  const orders = getFilteredOrders();

  const chartData = useMemo(() => {
    if (!config.xAxis || !config.yAxis || orders.length === 0) return [];

    return orders.map((order: CustomerOrder) => ({
      x: Number(order[config.xAxis]) || 0,
      y: Number(order[config.yAxis]) || 0,
      name: `${order.firstName} ${order.lastName}`,
    }));
  }, [orders, config.xAxis, config.yAxis]);

  const xAxisLabel = ORDER_FIELDS.find(f => f.key === config.xAxis)?.label || config.xAxis;
  const yAxisLabel = ORDER_FIELDS.find(f => f.key === config.yAxis)?.label || config.yAxis;

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        <p>No data available. Configure X and Y axis and add orders.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          type="number" 
          dataKey="x" 
          name={xAxisLabel}
          tick={{ fontSize: 12 }}
          label={{ value: xAxisLabel, position: 'bottom', offset: 0 }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name={yAxisLabel}
          tick={{ fontSize: 12 }}
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
          formatter={(value: number, name: string) => [value, name]}
        />
        <Scatter 
          data={chartData} 
          fill={config.chartColor || '#54bd95'}
        >
          {config.showDataLabels && (
            <LabelList dataKey="name" position="top" style={{ fontSize: 10 }} />
          )}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};
