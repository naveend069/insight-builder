import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetType } from '@/types/dashboard';
import { DashboardHeader } from './DashboardHeader';
import { WidgetPanel } from './WidgetPanel';
import { DashboardCanvas } from './DashboardCanvas';
import { ConfigurationPanel } from './ConfigurationPanel';
import { WidgetIcon, WIDGET_LABELS } from './WidgetIcon';
import { useToast } from '@/hooks/use-toast';

export const DashboardBuilder = () => {
  const { 
    isConfiguring, 
    currentDashboardId, 
    addWidget,
    selectedWidgetId 
  } = useDashboardStore();
  const [activeWidget, setActiveWidget] = useState<WidgetType | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'new-widget') {
      setActiveWidget(active.data.current.widgetType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveWidget(null);

    if (over?.id === 'canvas' && active.data.current?.type === 'new-widget' && currentDashboardId) {
      const widgetType = active.data.current.widgetType as WidgetType;
      addWidget(currentDashboardId, widgetType, 0, 0);
      toast({
        title: 'Widget Added',
        description: `${WIDGET_LABELS[widgetType]} has been added to your dashboard.`,
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-background">
        <DashboardHeader />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Widgets */}
          {isConfiguring && <WidgetPanel />}

          {/* Main Canvas */}
          <DashboardCanvas />

          {/* Right Panel - Configuration */}
          {isConfiguring && selectedWidgetId && <ConfigurationPanel />}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeWidget && (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-card shadow-xl">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <WidgetIcon type={activeWidget} />
            </div>
            <span className="text-sm font-medium">
              {WIDGET_LABELS[activeWidget]}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
