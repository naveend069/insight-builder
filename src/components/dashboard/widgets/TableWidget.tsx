import { useState, useMemo } from 'react';
import { TableWidgetConfig, CustomerOrder } from '@/types/dashboard';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableWidgetProps {
  config: TableWidgetConfig;
}

const COLUMN_LABELS: Record<keyof CustomerOrder, string> = {
  id: 'ID',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  phone: 'Phone',
  streetAddress: 'Address',
  city: 'City',
  state: 'State',
  postalCode: 'Postal Code',
  country: 'Country',
  product: 'Product',
  quantity: 'Qty',
  unitPrice: 'Unit Price',
  totalAmount: 'Total',
  status: 'Status',
  createdBy: 'Created By',
  createdAt: 'Created At',
};

export const TableWidget = ({ config }: TableWidgetProps) => {
  const orders = useDashboardStore((state) => {
    const userOrders = state.currentUserId ? (state.userOrders[state.currentUserId] || []) : [];
    const now = new Date();
    return userOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      switch (state.dateFilter) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'last-7-days':
          return now.getTime() - orderDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case 'last-30-days':
          return now.getTime() - orderDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        case 'last-90-days':
          return now.getTime() - orderDate.getTime() <= 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Apply filters only if enableFilters is true
    if (config.enableFilters && config.filters?.length) {
      config.filters.forEach((filter) => {
        if (!filter.field || !filter.value) return;
        
        result = result.filter((order) => {
          const value = String(order[filter.field] || '').toLowerCase();
          const filterValue = filter.value.toLowerCase();

          switch (filter.operator) {
            case 'equals':
              return value === filterValue;
            case 'contains':
              return value.includes(filterValue);
            case 'greater':
              return Number(order[filter.field]) > Number(filter.value);
            case 'less':
              return Number(order[filter.field]) < Number(filter.value);
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (config.sortField) {
      result.sort((a, b) => {
        const aVal = a[config.sortField!];
        const bVal = b[config.sortField!];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return config.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal || '');
        const bStr = String(bVal || '');
        return config.sortDirection === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [orders, config.enableFilters, config.filters, config.sortField, config.sortDirection]);

  const totalPages = Math.ceil(filteredOrders.length / config.pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * config.pageSize,
    currentPage * config.pageSize
  );

  const columns = config.columns?.length ? config.columns : ['firstName', 'lastName', 'product', 'totalAmount', 'status'] as (keyof CustomerOrder)[];

  const formatCellValue = (order: CustomerOrder, column: keyof CustomerOrder) => {
    const value = order[column];

    if (column === 'status') {
      return (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium",
          value === 'Pending' && "bg-yellow-100 text-yellow-800",
          value === 'In Progress' && "bg-blue-100 text-blue-800",
          value === 'Completed' && "bg-emerald-100 text-emerald-800"
        )}>
          {String(value)}
        </span>
      );
    }

    if (column === 'totalAmount' || column === 'unitPrice') {
      return `$${(value as number).toFixed(2)}`;
    }

    if (column === 'createdAt') {
      const date = value instanceof Date ? value : new Date(value as string);
      return date.toLocaleDateString();
    }

    return String(value ?? '—');
  };

  if (filteredOrders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        No data available. Add some orders first.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ fontSize: config.fontSize || 14 }}>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead 
                  key={col} 
                  className="text-primary-foreground whitespace-nowrap"
                  style={{ backgroundColor: config.headerBgColor || '#54bd95' }}
                >
                  {COLUMN_LABELS[col]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                {columns.map((col) => (
                  <TableCell key={col} className="whitespace-nowrap">
                    {formatCellValue(order, col)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
