import { useDroppable } from '@dnd-kit/core';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetCard } from './WidgetCard';
import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';

export const DashboardCanvas = () => {
  const { getCurrentDashboard, selectedWidgetId, setSelectedWidget } = useDashboardStore();
  const dashboard = getCurrentDashboard();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedWidget(null);
    }
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCanvasClick}
      className={cn(
        "flex-1 p-6 overflow-auto custom-scrollbar bg-canvas min-h-full",
        isOver && "bg-canvas-drop-zone"
      )}
    >
      {!dashboard?.widgets.length ? (
        <div className={cn(
          "h-full min-h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4",
          "transition-colors duration-200",
          isOver ? "border-primary bg-accent/50" : "border-border"
        )}>
          <div className={cn(
            "p-4 rounded-full",
            isOver ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            <LayoutGrid className="h-10 w-10" />
          </div>
          <div className="text-center">
            <p className={cn(
              "text-lg font-medium",
              isOver ? "text-primary" : "text-muted-foreground"
            )}>
              {isOver ? "Drop widget here" : "Drag widgets here to build your dashboard"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Select widgets from the panel on the left
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-dashboard gap-4 auto-rows-[60px]">
          {dashboard.widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              isSelected={selectedWidgetId === widget.id}
              onClick={() => setSelectedWidget(widget.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
