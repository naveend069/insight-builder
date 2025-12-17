export type WidgetType = 
  | 'bar-chart' 
  | 'line-chart' 
  | 'pie-chart' 
  | 'area-chart' 
  | 'scatter-plot' 
  | 'table' 
  | 'kpi';

export type OrderStatus = 'Pending' | 'In Progress' | 'Completed';

export type DateFilterOption = 
  | 'all-time' 
  | 'today' 
  | 'last-7-days' 
  | 'last-30-days' 
  | 'last-90-days';

export type AggregationType = 'sum' | 'average' | 'count';

export type DataFormat = 'number' | 'currency';

export interface CustomerOrder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: 'United States' | 'Canada' | 'Australia' | 'Singapore' | 'Hong Kong';
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: OrderStatus;
  createdBy: string;
  createdAt: Date;
}

export interface BaseWidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface KPIWidgetConfig extends BaseWidgetConfig {
  type: 'kpi';
  metric: keyof CustomerOrder;
  aggregation: AggregationType;
  dataFormat: DataFormat;
  decimalPrecision: number;
}

export interface ChartWidgetConfig extends BaseWidgetConfig {
  type: 'bar-chart' | 'line-chart' | 'area-chart' | 'scatter-plot';
  xAxis: keyof CustomerOrder;
  yAxis: keyof CustomerOrder;
  chartColor: string;
  showDataLabels: boolean;
}

export interface PieChartWidgetConfig extends BaseWidgetConfig {
  type: 'pie-chart';
  dataField: keyof CustomerOrder;
  showLegend: boolean;
  chartColor: string;
}

export interface TableWidgetConfig extends BaseWidgetConfig {
  type: 'table';
  columns: (keyof CustomerOrder)[];
  sortField?: keyof CustomerOrder;
  sortDirection: 'asc' | 'desc';
  pageSize: 5 | 10 | 15;
  filters: TableFilter[];
  enableFilters: boolean;
  fontSize: number;
  headerBgColor: string;
}

export interface TableFilter {
  field: keyof CustomerOrder;
  operator: 'equals' | 'contains' | 'greater' | 'less';
  value: string;
}

export type WidgetConfig = 
  | KPIWidgetConfig 
  | ChartWidgetConfig 
  | PieChartWidgetConfig 
  | TableWidgetConfig;

export interface Dashboard {
  id: string;
  userId?: string;
  name: string;
  widgets: WidgetConfig[];
  dateFilter: DateFilterOption;
  createdAt: Date;
  updatedAt: Date;
}

export interface DragItem {
  type: 'widget' | 'placed-widget';
  widgetType: WidgetType;
  id?: string;
}

export const WIDGET_DEFAULTS: Record<WidgetType, Partial<WidgetConfig>> = {
  'bar-chart': { width: 5, height: 5, chartColor: '#54bd95', showDataLabels: true },
  'line-chart': { width: 5, height: 5, chartColor: '#54bd95', showDataLabels: true },
  'pie-chart': { width: 4, height: 4, showLegend: true, chartColor: '#54bd95' },
  'area-chart': { width: 5, height: 5, chartColor: '#54bd95', showDataLabels: true },
  'scatter-plot': { width: 5, height: 5, chartColor: '#54bd95', showDataLabels: false },
  'table': { width: 6, height: 4, pageSize: 10, fontSize: 14, headerBgColor: '#54bd95', columns: ['firstName', 'lastName', 'product', 'totalAmount', 'status'], filters: [], sortDirection: 'asc', enableFilters: false },
  'kpi': { width: 3, height: 2, aggregation: 'sum', dataFormat: 'number', decimalPrecision: 0 },
};

// Updated products per requirements
export const PRODUCTS = [
  'Fiber Internet 300 Mbps',
  '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps',
  'Business Internet 500 Mbps',
  'VoIP Corporate Package',
];

// Updated users per requirements
export const USERS = [
  'Michael Harris',
  'Ryan Cooper',
  'Olivia Carter',
  'Lucas Martin',
];

// Updated countries per requirements
export const COUNTRIES = [
  'United States',
  'Canada',
  'Australia',
  'Singapore',
  'Hong Kong',
] as const;

export const ORDER_FIELDS: { key: keyof CustomerOrder; label: string; type: 'string' | 'number' | 'date' }[] = [
  { key: 'firstName', label: 'First Name', type: 'string' },
  { key: 'lastName', label: 'Last Name', type: 'string' },
  { key: 'email', label: 'Email', type: 'string' },
  { key: 'phone', label: 'Phone', type: 'string' },
  { key: 'city', label: 'City', type: 'string' },
  { key: 'state', label: 'State', type: 'string' },
  { key: 'country', label: 'Country', type: 'string' },
  { key: 'product', label: 'Product', type: 'string' },
  { key: 'quantity', label: 'Quantity', type: 'number' },
  { key: 'unitPrice', label: 'Unit Price', type: 'number' },
  { key: 'totalAmount', label: 'Total Amount', type: 'number' },
  { key: 'status', label: 'Status', type: 'string' },
  { key: 'createdBy', label: 'Created By', type: 'string' },
  { key: 'createdAt', label: 'Created At', type: 'date' },
];

export const NUMERIC_FIELDS = ORDER_FIELDS.filter(f => f.type === 'number');
export const STRING_FIELDS = ORDER_FIELDS.filter(f => f.type === 'string');
