import { useDraggable } from '@dnd-kit/core';
import { WidgetType } from '@/types/dashboard';
import { WidgetIcon, WIDGET_LABELS } from './WidgetIcon';
import { cn } from '@/lib/utils';

interface DraggableWidgetItemProps {
  type: WidgetType;
}

export const DraggableWidgetItem = ({ type }: DraggableWidgetItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `widget-${type}`,
    data: { type: 'new-widget', widgetType: type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border border-border bg-card cursor-grab",
        "hover:bg-accent hover:border-primary/30 transition-all duration-200",
        "active:cursor-grabbing active:scale-[0.98]",
        isDragging && "opacity-50 scale-95 shadow-lg"
      )}
    >
      <div className="p-2 rounded-md bg-primary/10 text-primary">
        <WidgetIcon type={type} />
      </div>
      <span className="text-sm font-medium text-foreground">
        {WIDGET_LABELS[type]}
      </span>
    </div>
  );
};
