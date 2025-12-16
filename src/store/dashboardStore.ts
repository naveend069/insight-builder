import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Dashboard, 
  WidgetConfig, 
  CustomerOrder, 
  DateFilterOption,
  WIDGET_DEFAULTS,
  WidgetType
} from '@/types/dashboard';

interface DashboardState {
  dashboards: Dashboard[];
  currentDashboardId: string | null;
  orders: CustomerOrder[];
  isConfiguring: boolean;
  selectedWidgetId: string | null;
  dateFilter: DateFilterOption;
  
  // Dashboard actions
  createDashboard: (name: string) => string;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => void;
  deleteDashboard: (id: string) => void;
  setCurrentDashboard: (id: string | null) => void;
  
  // Widget actions
  addWidget: (dashboardId: string, type: WidgetType, x: number, y: number) => void;
  updateWidget: (dashboardId: string, widgetId: string, updates: Partial<WidgetConfig>) => void;
  removeWidget: (dashboardId: string, widgetId: string) => void;
  moveWidget: (dashboardId: string, widgetId: string, x: number, y: number) => void;
  
  // Order actions
  addOrder: (order: Omit<CustomerOrder, 'id' | 'createdAt' | 'totalAmount'>) => void;
  updateOrder: (id: string, updates: Partial<CustomerOrder>) => void;
  deleteOrder: (id: string) => void;
  
  // UI state
  setConfiguring: (isConfiguring: boolean) => void;
  setSelectedWidget: (widgetId: string | null) => void;
  setDateFilter: (filter: DateFilterOption) => void;
  
  // Helpers
  getCurrentDashboard: () => Dashboard | undefined;
  getFilteredOrders: () => CustomerOrder[];
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      dashboards: [],
      currentDashboardId: null,
      orders: [],
      isConfiguring: false,
      selectedWidgetId: null,
      dateFilter: 'all-time',

      createDashboard: (name) => {
        const id = crypto.randomUUID();
        const newDashboard: Dashboard = {
          id,
          name,
          widgets: [],
          dateFilter: 'all-time',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          dashboards: [...state.dashboards, newDashboard],
          currentDashboardId: id,
        }));
        return id;
      },

      updateDashboard: (id, updates) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
          ),
        }));
      },

      deleteDashboard: (id) => {
        set((state) => ({
          dashboards: state.dashboards.filter((d) => d.id !== id),
          currentDashboardId: state.currentDashboardId === id ? null : state.currentDashboardId,
        }));
      },

      setCurrentDashboard: (id) => {
        set({ currentDashboardId: id });
      },

      addWidget: (dashboardId, type, x, y) => {
        const defaults = WIDGET_DEFAULTS[type];
        const baseWidget = {
          id: crypto.randomUUID(),
          type,
          title: `New ${type.replace(/-/g, ' ')}`,
          x,
          y,
          width: defaults.width || 4,
          height: defaults.height || 4,
        };
        
        const widget = { ...baseWidget, ...defaults } as WidgetConfig;

        set((state) => {
          const newDashboards = state.dashboards.map((d) => {
            if (d.id === dashboardId) {
              return { 
                ...d, 
                widgets: [...d.widgets, widget], 
                updatedAt: new Date() 
              };
            }
            return d;
          });
          return { dashboards: newDashboards };
        });
      },

      updateWidget: (dashboardId, widgetId, updates) => {
        set((state) => {
          const newDashboards = state.dashboards.map((d) => {
            if (d.id === dashboardId) {
              return {
                ...d,
                widgets: d.widgets.map((w) =>
                  w.id === widgetId ? ({ ...w, ...updates } as WidgetConfig) : w
                ),
                updatedAt: new Date(),
              };
            }
            return d;
          });
          return { dashboards: newDashboards };
        });
      },

      removeWidget: (dashboardId, widgetId) => {
        set((state) => {
          const newDashboards = state.dashboards.map((d) => {
            if (d.id === dashboardId) {
              return {
                ...d,
                widgets: d.widgets.filter((w) => w.id !== widgetId),
                updatedAt: new Date(),
              };
            }
            return d;
          });
          return { 
            dashboards: newDashboards,
            selectedWidgetId: state.selectedWidgetId === widgetId ? null : state.selectedWidgetId,
          };
        });
      },

      moveWidget: (dashboardId, widgetId, x, y) => {
        set((state) => {
          const newDashboards = state.dashboards.map((d) => {
            if (d.id === dashboardId) {
              return {
                ...d,
                widgets: d.widgets.map((w) =>
                  w.id === widgetId ? ({ ...w, x, y } as WidgetConfig) : w
                ),
                updatedAt: new Date(),
              };
            }
            return d;
          });
          return { dashboards: newDashboards };
        });
      },

      addOrder: (orderData) => {
        const order: CustomerOrder = {
          ...orderData,
          id: crypto.randomUUID(),
          totalAmount: orderData.quantity * orderData.unitPrice,
          createdAt: new Date(),
        };
        set((state) => ({ orders: [...state.orders, order] }));
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === id) {
              const updated = { ...o, ...updates };
              if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
                updated.totalAmount = updated.quantity * updated.unitPrice;
              }
              return updated;
            }
            return o;
          }),
        }));
      },

      deleteOrder: (id) => {
        set((state) => ({ orders: state.orders.filter((o) => o.id !== id) }));
      },

      setConfiguring: (isConfiguring) => {
        set({ isConfiguring, selectedWidgetId: null });
      },

      setSelectedWidget: (widgetId) => {
        set({ selectedWidgetId: widgetId });
      },

      setDateFilter: (filter) => {
        set({ dateFilter: filter });
      },

      getCurrentDashboard: () => {
        const state = get();
        return state.dashboards.find((d) => d.id === state.currentDashboardId);
      },

      getFilteredOrders: () => {
        const state = get();
        const now = new Date();
        
        return state.orders.filter((order) => {
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
      },
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        dashboards: state.dashboards,
        orders: state.orders,
        currentDashboardId: state.currentDashboardId,
      }),
    }
  )
);
