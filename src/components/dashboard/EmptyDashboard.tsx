import { useDashboardStore } from '@/store/dashboardStore';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Settings2 } from 'lucide-react';

interface EmptyDashboardProps {
  onConfigure: () => void;
}

export const EmptyDashboard = ({ onConfigure }: EmptyDashboardProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-canvas p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <LayoutDashboard className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Welcome to Your Dashboard
        </h2>
        
        <p className="text-muted-foreground mb-8">
          Your dashboard is empty. Configure it by adding widgets to visualize your customer order data.
        </p>

        <Button size="lg" onClick={onConfigure} className="gap-2">
          <Settings2 className="h-5 w-5" />
          Configure Dashboard
        </Button>
      </div>
    </div>
  );
};
