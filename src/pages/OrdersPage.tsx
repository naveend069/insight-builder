import { AppLayout } from '@/components/layout/AppLayout';
import { CreateOrderDialog } from '@/components/orders/CreateOrderDialog';
import { OrdersTable } from '@/components/orders/OrdersTable';

const OrdersPage = () => {
  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Customer Orders</h1>
            <p className="text-sm text-muted-foreground">Manage your customer orders</p>
          </div>
          <CreateOrderDialog />
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto bg-canvas">
          <OrdersTable />
        </div>
      </div>
    </AppLayout>
  );
};

export default OrdersPage;
