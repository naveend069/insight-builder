import { useMemo } from 'react';
import { ChartWidgetConfig, PieChartWidgetConfig } from '@/types/dashboard';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

interface ChartWidgetProps {
  config: ChartWidgetConfig | PieChartWidgetConfig;
}

const COLORS = ['#54bd95', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EF4444', '#10B981', '#6366F1'];

export const ChartWidget = ({ config }: ChartWidgetProps) => {
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

  const data = useMemo(() => {
    if (config.type === 'pie-chart') {
      const pieConfig = config as PieChartWidgetConfig;
      if (!pieConfig.dataField) return [];

      const grouped: Record<string, number> = {};
      orders.forEach((order) => {
        const key = String(order[pieConfig.dataField] || 'Unknown');
        grouped[key] = (grouped[key] || 0) + 1;
      });

      return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    }

    const chartConfig = config as ChartWidgetConfig;
    if (!chartConfig.xAxis || !chartConfig.yAxis) return [];

    const grouped: Record<string, number[]> = {};
    orders.forEach((order) => {
      const xValue = String(order[chartConfig.xAxis] || 'Unknown');
      const yValue = typeof order[chartConfig.yAxis] === 'number' 
        ? order[chartConfig.yAxis] as number 
        : 0;
      
      if (!grouped[xValue]) grouped[xValue] = [];
      grouped[xValue].push(yValue);
    });

    return Object.entries(grouped).map(([name, values]) => ({
      name,
      value: values.reduce((a, b) => a + b, 0) / values.length,
    }));
  }, [orders, config]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        No data available. Add some orders first.
      </div>
    );
  }

  const chartColor = (config as ChartWidgetConfig).chartColor || '#54bd95';
  const showLabels = (config as ChartWidgetConfig).showDataLabels ?? true;

  const renderChart = () => {
    switch (config.type) {
      case 'bar-chart':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} label={showLabels ? { fontSize: 10 } : false} />
          </BarChart>
        );

      case 'line-chart':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor} 
              strokeWidth={2}
              dot={{ fill: chartColor, strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area-chart':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
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
              stroke={chartColor} 
              fill={chartColor}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'scatter-plot':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis type="number" dataKey="value" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Scatter data={data} fill={chartColor} />
          </ScatterChart>
        );

      case 'pie-chart':
        const pieConfig = config as PieChartWidgetConfig;
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={showLabels ? ({ name }) => name : false}
              labelLine={false}
            >
              {data.map((_, index) => (
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
            {pieConfig.showLegend && <Legend />}
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};
