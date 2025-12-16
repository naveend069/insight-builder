import { WidgetType } from '@/types/dashboard';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  AreaChart, 
  ScatterChart, 
  Table2, 
  Gauge 
} from 'lucide-react';

interface WidgetIconProps {
  type: WidgetType;
  className?: string;
}

export const WidgetIcon = ({ type, className = "h-5 w-5" }: WidgetIconProps) => {
  const icons: Record<WidgetType, React.ReactNode> = {
    'bar-chart': <BarChart3 className={className} />,
    'line-chart': <LineChart className={className} />,
    'pie-chart': <PieChart className={className} />,
    'area-chart': <AreaChart className={className} />,
    'scatter-plot': <ScatterChart className={className} />,
    'table': <Table2 className={className} />,
    'kpi': <Gauge className={className} />,
  };

  return <>{icons[type]}</>;
};

export const WIDGET_LABELS: Record<WidgetType, string> = {
  'bar-chart': 'Bar Chart',
  'line-chart': 'Line Chart',
  'pie-chart': 'Pie Chart',
  'area-chart': 'Area Chart',
  'scatter-plot': 'Scatter Plot',
  'table': 'Table',
  'kpi': 'KPI Card',
};
