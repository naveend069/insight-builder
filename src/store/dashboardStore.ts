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
  // User-specific data storage (keyed by user ID)
  userDashboards: Record<string, Dashboard[]>;
  userOrders: Record<string, CustomerOrder[]>;
  currentUserId: string | null;
  currentDashboardId: string | null;
  isConfiguring: boolean;
  selectedWidgetId: string | null;
  dateFilter: DateFilterOption;
  
  // User management
  setCurrentUser: (userId: string | null) => void;
  
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
  
  // Getters
  getDashboards: () => Dashboard[];
  getOrders: () => CustomerOrder[];
  getCurrentDashboard: () => Dashboard | undefined;
  getFilteredOrders: () => CustomerOrder[];
}

// Helper to get user-specific dashboards
const getUserDashboards = (state: DashboardState): Dashboard[] => {
  return state.currentUserId ? (state.userDashboards[state.currentUserId] || []) : [];
};

// Helper to get user-specific orders
const getUserOrders = (state: DashboardState): CustomerOrder[] => {
  return state.currentUserId ? (state.userOrders[state.currentUserId] || []) : [];
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      userDashboards: {},
      userOrders: {},
      currentUserId: null,
      currentDashboardId: null,
      isConfiguring: false,
      selectedWidgetId: null,
      dateFilter: 'all-time',

      setCurrentUser: (userId) => {
        const state = get();
        // When user changes, try to restore their last dashboard
        const userDashboards = userId ? (state.userDashboards[userId] || []) : [];
        const firstDashboardId = userDashboards.length > 0 ? userDashboards[0].id : null;
        
        set({ 
          currentUserId: userId, 
          currentDashboardId: firstDashboardId, 
          isConfiguring: false, 
          selectedWidgetId: null 
        });
      },

      createDashboard: (name) => {
        const state = get();
        if (!state.currentUserId) return '';
        
        const id = crypto.randomUUID();
        const newDashboard: Dashboard = {
          id,
          userId: state.currentUserId,
          name,
          widgets: [],
          dateFilter: 'all-time',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const currentDashboards = state.userDashboards[state.currentUserId] || [];
        
        set({
          userDashboards: {
            ...state.userDashboards,
            [state.currentUserId]: [...currentDashboards, newDashboard],
          },
          currentDashboardId: id,
        });
        return id;
      },

      updateDashboard: (id, updates) => {
        const state = get();
        if (!state.currentUserId) return;
        
        const currentDashboards = state.userDashboards[state.currentUserId] || [];
        const updatedDashboards = currentDashboards.map((d) =>
          d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
        );
        
        set({
          userDashboards: {
            ...state.userDashboards,
            [state.currentUserId]: updatedDashboards,
          },
        });
      },

      deleteDashboard: (id) => {
        const state = get();
        if (!state.currentUserId) return;
        
        const currentDashboards = state.userDashboards[state.currentUserId] || [];
        const filteredDashboards = currentDashboards.filter((d) => d.id !== id);
        
        set({
          userDashboards: {
            ...state.userDashboards,
            [state.currentUserId]: filteredDashboards,
          },
          currentDashboardId: state.currentDashboardId === id ? null : state.currentDashboardId,
        });
      },

      setCurrentDashboard: (id) => {
        set({ currentDashboardId: id });
      },

      addWidget: (dashboardId, type, x, y) => {
        const state = get();
        if (!state.currentUserId) return;
        
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
        
        const currentDashboards = state.userDashboards[state.currentUserId] || [];
        const updatedDashboards = currentDashboards.map((d) => {
          if (d.id === dashboardId) {
            return { 
              ...d, 
              widgets: [...d.widgets, widget], 
              updatedAt: new Date() 
            };
          }
          return d;
        });
        
        set({
          userDashboards: {
            ...state.userDashboards,
            [state.currentUserId]: updatedDashboards,
          },
        });
      },

      updateWidget: (dashboardId, widgetId, updates) => {
        const state = get();
        if (!state.currentUserId) return;
        
        const currentDashboards = state.userDashboards[state.currentUserId] || [];
        const updatedDashboards = currentDashboards.map((d) => {
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
        
        set({
          userDashboards: {
            ...state.userDashboards,
            [state.currentUserId]: updatedDashboards,
          },
        });
      },

      removeWidget: (dashboardId, widgetId) => {
        const state = get();
        if (!state.currentUserId) return;
        
        const currentDashboards = state.userDashboards[state.currentUserId] || [];
        const updatedDashboards = currentDashboards.map((d) => {
          if (d.id === dashboardId) {
            return {
              ...d,
              widgets: d.widgets.filter((w) => w.id !== widgetId),
              updatedAt: new Date(),
            };
          }
          return d;
        });
        
        set({
          userDashboards: {
            ...state.userDashboards,
            [state.currentUserId]: updatedDashboards,
          },
          selectedWidgetId: state.selectedWidgetId === widgetId ? null : state.selectedWidgetId,
        });
      },

      moveWidget: (dashboardId, widgetId, x, y) => {
        const state = get();
        if (!state.currentUserId) return;
        
        const currentDashboards = state.userDashboards[state.currentUserId] || [];
        const updatedDashboards = currentDashboards.map((d) => {
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
        
        set({
          userDashboards: {
            ...state.userDashboards,
            [state.currentUserId]: updatedDashboards,
          },
        });
      },

      addOrder: (orderData) => {
        const state = get();
        if (!state.currentUserId) return;
        
        const order: CustomerOrder = {
          ...orderData,
          id: crypto.randomUUID(),
          totalAmount: orderData.quantity * orderData.unitPrice,
          createdAt: new Date(),
        };
        
        const currentOrders = state.userOrders[state.currentUserId] || [];
        
        set({
          userOrders: {
            ...state.userOrders,
            [state.currentUserId]: [...currentOrders, order],
          },
        });
      },

      updateOrder: (id, updates) => {
        const state = get();
        if (!state.currentUserId) return;
        
        const currentOrders = state.userOrders[state.currentUserId] || [];
        const updatedOrders = currentOrders.map((o) => {
          if (o.id === id) {
            const updated = { ...o, ...updates };
            if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
              updated.totalAmount = updated.quantity * updated.unitPrice;
            }
            return updated;
          }
          return o;
        });
        
        set({
          userOrders: {
            ...state.userOrders,
            [state.currentUserId]: updatedOrders,
          },
        });
      },

      deleteOrder: (id) => {
        const state = get();
        if (!state.currentUserId) return;
        
        const currentOrders = state.userOrders[state.currentUserId] || [];
        const filteredOrders = currentOrders.filter((o) => o.id !== id);
        
        set({
          userOrders: {
            ...state.userOrders,
            [state.currentUserId]: filteredOrders,
          },
        });
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

      getDashboards: () => getUserDashboards(get()),
      
      getOrders: () => getUserOrders(get()),

      getCurrentDashboard: () => {
        const state = get();
        const dashboards = getUserDashboards(state);
        return dashboards.find((d) => d.id === state.currentDashboardId);
      },

      getFilteredOrders: () => {
        const state = get();
        const orders = getUserOrders(state);
        const now = new Date();
        
        return orders.filter((order) => {
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
        userDashboards: state.userDashboards,
        userOrders: state.userOrders,
      }),
    }
  )
);

// Selector hooks for convenience
export const useDashboards = () => useDashboardStore((state) => state.getDashboards());
export const useOrders = () => useDashboardStore((state) => state.getOrders());
