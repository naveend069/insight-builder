import { WidgetType } from '@/types/dashboard';
import { DraggableWidgetItem } from './DraggableWidgetItem';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { BarChart3, Table2, Gauge } from 'lucide-react';

const WIDGET_CATEGORIES = [
  {
    id: 'charts',
    label: 'Charts',
    icon: <BarChart3 className="h-4 w-4" />,
    widgets: ['bar-chart', 'line-chart', 'pie-chart', 'area-chart', 'scatter-plot'] as WidgetType[],
  },
  {
    id: 'tables',
    label: 'Tables',
    icon: <Table2 className="h-4 w-4" />,
    widgets: ['table'] as WidgetType[],
  },
  {
    id: 'kpis',
    label: 'KPIs',
    icon: <Gauge className="h-4 w-4" />,
    widgets: ['kpi'] as WidgetType[],
  },
];

export const WidgetPanel = () => {
  return (
    <div className="w-72 bg-card border-r border-border h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Widgets</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Drag widgets onto the canvas
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['charts', 'tables', 'kpis']} className="p-2">
        {WIDGET_CATEGORIES.map((category) => (
          <AccordionItem key={category.id} value={category.id} className="border-none">
            <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline hover:bg-accent rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-primary">{category.icon}</span>
                {category.label}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div className="space-y-2 pl-2">
                {category.widgets.map((widgetType) => (
                  <DraggableWidgetItem key={widgetType} type={widgetType} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
