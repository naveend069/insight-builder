import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetConfig, ORDER_FIELDS, NUMERIC_FIELDS, CustomerOrder } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WIDGET_LABELS } from './WidgetIcon';

export const ConfigurationPanel = () => {
  const { 
    selectedWidgetId, 
    setSelectedWidget, 
    getCurrentDashboard, 
    updateWidget,
    currentDashboardId 
  } = useDashboardStore();

  const dashboard = getCurrentDashboard();
  const widget = dashboard?.widgets.find((w) => w.id === selectedWidgetId);

  if (!widget) {
    return (
      <div className="w-80 bg-card border-l border-border h-full p-6 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          Select a widget to configure its settings
        </p>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<WidgetConfig>) => {
    if (currentDashboardId && widget) {
      updateWidget(currentDashboardId, widget.id, updates);
    }
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto custom-scrollbar animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
        <h3 className="font-semibold text-foreground">Widget Settings</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedWidget(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Basic</h4>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={widget.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              placeholder="Widget title"
            />
          </div>

          <div className="space-y-2">
            <Label>Widget Type</Label>
            <Input value={WIDGET_LABELS[widget.type]} disabled className="bg-muted" />
          </div>

          {widget.type === 'kpi' && (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={(widget as any).description || ''}
                onChange={(e) => handleUpdate({ description: e.target.value } as any)}
                placeholder="Optional description"
              />
            </div>
          )}
        </div>

        {/* Size Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Size</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (columns)</Label>
              <Input
                id="width"
                type="number"
                min={1}
                max={12}
                value={widget.width}
                onChange={(e) => handleUpdate({ width: Math.max(1, Math.min(12, Number(e.target.value))) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (rows)</Label>
              <Input
                id="height"
                type="number"
                min={1}
                max={10}
                value={widget.height}
                onChange={(e) => handleUpdate({ height: Math.max(1, Number(e.target.value)) })}
              />
            </div>
          </div>
        </div>

        {/* KPI Settings */}
        {widget.type === 'kpi' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">KPI Configuration</h4>
            
            <div className="space-y-2">
              <Label>Metric Field</Label>
              <Select
                value={(widget as any).metric || ''}
                onValueChange={(value) => handleUpdate({ metric: value as keyof CustomerOrder } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {NUMERIC_FIELDS.map((field) => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Aggregation</Label>
              <Select
                value={(widget as any).aggregation || 'sum'}
                onValueChange={(value) => handleUpdate({ aggregation: value } as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Format</Label>
              <Select
                value={(widget as any).dataFormat || 'number'}
                onValueChange={(value) => handleUpdate({ dataFormat: value } as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="currency">Currency ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Decimal Precision: {(widget as any).decimalPrecision || 0}</Label>
              <Slider
                value={[(widget as any).decimalPrecision || 0]}
                min={0}
                max={4}
                step={1}
                onValueChange={([value]) => handleUpdate({ decimalPrecision: value } as any)}
              />
            </div>
          </div>
        )}

        {/* Chart Settings */}
        {['bar-chart', 'line-chart', 'area-chart', 'scatter-plot'].includes(widget.type) && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Chart Configuration</h4>
            
            <div className="space-y-2">
              <Label>X-Axis Field</Label>
              <Select
                value={(widget as any).xAxis || ''}
                onValueChange={(value) => handleUpdate({ xAxis: value as keyof CustomerOrder } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_FIELDS.map((field) => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Y-Axis Field</Label>
              <Select
                value={(widget as any).yAxis || ''}
                onValueChange={(value) => handleUpdate({ yAxis: value as keyof CustomerOrder } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {NUMERIC_FIELDS.map((field) => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Chart Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={(widget as any).chartColor || '#54bd95'}
                  onChange={(e) => handleUpdate({ chartColor: e.target.value } as any)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={(widget as any).chartColor || '#54bd95'}
                  onChange={(e) => handleUpdate({ chartColor: e.target.value } as any)}
                  placeholder="#54bd95"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showLabels">Show Data Labels</Label>
              <Switch
                id="showLabels"
                checked={(widget as any).showDataLabels ?? true}
                onCheckedChange={(checked) => handleUpdate({ showDataLabels: checked } as any)}
              />
            </div>
          </div>
        )}

        {/* Pie Chart Settings */}
        {widget.type === 'pie-chart' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Pie Chart Configuration</h4>
            
            <div className="space-y-2">
              <Label>Data Field</Label>
              <Select
                value={(widget as any).dataField || ''}
                onValueChange={(value) => handleUpdate({ dataField: value as keyof CustomerOrder } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_FIELDS.filter(f => f.type === 'string').map((field) => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showLegend">Show Legend</Label>
              <Switch
                id="showLegend"
                checked={(widget as any).showLegend ?? true}
                onCheckedChange={(checked) => handleUpdate({ showLegend: checked } as any)}
              />
            </div>
          </div>
        )}

        {/* Table Settings */}
        {widget.type === 'table' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Table Configuration</h4>
            
            <div className="space-y-2">
              <Label>Columns to Display</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                {ORDER_FIELDS.map((field) => (
                  <label key={field.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={((widget as any).columns || []).includes(field.key)}
                      onChange={(e) => {
                        const cols = (widget as any).columns || [];
                        if (e.target.checked) {
                          handleUpdate({ columns: [...cols, field.key] } as any);
                        } else {
                          handleUpdate({ columns: cols.filter((c: string) => c !== field.key) } as any);
                        }
                      }}
                      className="rounded border-border"
                    />
                    {field.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={(widget as any).sortField || ''}
                onValueChange={(value) => handleUpdate({ sortField: value as keyof CustomerOrder } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_FIELDS.map((field) => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort Direction</Label>
              <Select
                value={(widget as any).sortDirection || 'asc'}
                onValueChange={(value) => handleUpdate({ sortDirection: value } as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rows per Page</Label>
              <Select
                value={String((widget as any).pageSize || 10)}
                onValueChange={(value) => handleUpdate({ pageSize: Number(value) } as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Size: {(widget as any).fontSize || 14}px</Label>
              <Slider
                value={[(widget as any).fontSize || 14]}
                min={12}
                max={18}
                step={1}
                onValueChange={([value]) => handleUpdate({ fontSize: value } as any)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Header Background
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={(widget as any).headerBgColor || '#54bd95'}
                  onChange={(e) => handleUpdate({ headerBgColor: e.target.value } as any)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={(widget as any).headerBgColor || '#54bd95'}
                  onChange={(e) => handleUpdate({ headerBgColor: e.target.value } as any)}
                  placeholder="#54bd95"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
