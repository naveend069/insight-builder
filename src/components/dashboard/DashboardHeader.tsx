import { useDashboardStore } from '@/store/dashboardStore';
import { DateFilterOption } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Settings2, Save, X } from 'lucide-react';

interface DashboardHeaderProps {
  onSave?: () => void;
}

const DATE_FILTER_OPTIONS: { value: DateFilterOption; label: string }[] = [
  { value: 'all-time', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'last-7-days', label: 'Last 7 Days' },
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'last-90-days', label: 'Last 90 Days' },
];

export const DashboardHeader = ({ onSave }: DashboardHeaderProps) => {
  const { 
    getCurrentDashboard, 
    isConfiguring, 
    setConfiguring, 
    dateFilter, 
    setDateFilter 
  } = useDashboardStore();

  const dashboard = getCurrentDashboard();

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          {dashboard?.name || 'Dashboard'}
        </h1>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Show data for:</span>
          <Select value={dateFilter} onValueChange={(value: DateFilterOption) => setDateFilter(value)}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isConfiguring ? (
          <>
            <Button variant="outline" onClick={() => setConfiguring(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => {
              onSave?.();
              setConfiguring(false);
            }}>
              <Save className="h-4 w-4 mr-2" />
              Save Layout
            </Button>
          </>
        ) : (
          <Button onClick={() => setConfiguring(true)}>
            <Settings2 className="h-4 w-4 mr-2" />
            Configure Dashboard
          </Button>
        )}
      </div>
    </header>
  );
};
