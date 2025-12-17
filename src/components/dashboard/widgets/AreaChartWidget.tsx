import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useDashboardStore } from '@/store/dashboardStore';
import { ChartWidgetConfig, CustomerOrder, ORDER_FIELDS } from '@/types/dashboard';

interface AreaChartWidgetProps {
  config: ChartWidgetConfig;
}

export const AreaChartWidget = ({ config }: AreaChartWidgetProps) => {
  const { getFilteredOrders } = useDashboardStore();
  const orders = getFilteredOrders();

  const chartData = useMemo(() => {
    if (!config.xAxis || !config.yAxis || orders.length === 0) return [];

    const groupedData: Record<string, number[]> = {};

    orders.forEach((order: CustomerOrder) => {
      const xValue = String(order[config.xAxis]);
      const yValue = Number(order[config.yAxis]) || 0;

      if (!groupedData[xValue]) {
        groupedData[xValue] = [];
      }
      groupedData[xValue].push(yValue);
    });

    return Object.entries(groupedData).map(([name, values]) => ({
      name,
      value: values.reduce((sum, v) => sum + v, 0),
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
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          label={{ value: xAxisLabel, position: 'bottom', offset: 0 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          fill={config.chartColor || '#54bd95'} 
          stroke={config.chartColor || '#54bd95'}
          fillOpacity={0.3}
        >
          {config.showDataLabels && (
            <LabelList dataKey="value" position="top" style={{ fontSize: 11 }} />
          )}
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
};
