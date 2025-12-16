import { WidgetConfig } from '@/types/dashboard';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetIcon, WIDGET_LABELS } from './WidgetIcon';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KPIWidget } from './widgets/KPIWidget';
import { ChartWidget } from './widgets/ChartWidget';
import { TableWidget } from './widgets/TableWidget';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface WidgetCardProps {
  widget: WidgetConfig;
  isSelected: boolean;
  onClick: () => void;
}

export const WidgetCard = ({ widget, isSelected, onClick }: WidgetCardProps) => {
  const { removeWidget, currentDashboardId, setSelectedWidget, isConfiguring } = useDashboardStore();

  const handleDelete = () => {
    if (currentDashboardId) {
      removeWidget(currentDashboardId, widget.id);
    }
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWidget(widget.id);
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'kpi':
        return <KPIWidget config={widget as any} />;
      case 'bar-chart':
      case 'line-chart':
      case 'area-chart':
      case 'scatter-plot':
        return <ChartWidget config={widget as any} />;
      case 'pie-chart':
        return <ChartWidget config={widget as any} />;
      case 'table':
        return <TableWidget config={widget as any} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Configure this widget
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "widget-card group relative overflow-hidden animate-scale-in",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isConfiguring && "cursor-pointer"
      )}
      style={{
        gridColumn: `span ${Math.min(widget.width, 12)}`,
        gridRow: `span ${widget.height}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 min-w-0">
          {isConfiguring && (
            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 cursor-grab" />
          )}
          <div className="p-1.5 rounded bg-primary/10 text-primary flex-shrink-0">
            <WidgetIcon type={widget.type} className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-medium text-foreground truncate">
            {widget.title || WIDGET_LABELS[widget.type]}
          </span>
        </div>

        {isConfiguring && (
          <div className={cn(
            "flex items-center gap-1 transition-opacity",
            "opacity-0 group-hover:opacity-100"
          )}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={handleSettings}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Widget</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this widget? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 h-[calc(100%-52px)] overflow-hidden">
        {renderWidgetContent()}
      </div>
    </div>
  );
};
