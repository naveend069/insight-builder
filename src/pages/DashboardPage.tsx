import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { DashboardBuilder } from '@/components/dashboard/DashboardBuilder';
import { EmptyDashboard } from '@/components/dashboard/EmptyDashboard';
import { AppLayout } from '@/components/layout/AppLayout';

const DashboardPage = () => {
  const { 
    dashboards, 
    currentDashboardId, 
    createDashboard, 
    setConfiguring,
    getCurrentDashboard
  } = useDashboardStore();

  // Create default dashboard if none exists
  useEffect(() => {
    if (dashboards.length === 0) {
      createDashboard('My Dashboard');
    } else if (!currentDashboardId && dashboards.length > 0) {
      useDashboardStore.getState().setCurrentDashboard(dashboards[0].id);
    }
  }, [dashboards, currentDashboardId, createDashboard]);

  const dashboard = getCurrentDashboard();
  const hasWidgets = dashboard?.widgets && dashboard.widgets.length > 0;

  const handleConfigure = () => {
    setConfiguring(true);
  };

  return (
    <AppLayout>
      {hasWidgets || useDashboardStore.getState().isConfiguring ? (
        <DashboardBuilder />
      ) : (
        <EmptyDashboard onConfigure={handleConfigure} />
      )}
    </AppLayout>
  );
};

export default DashboardPage;
