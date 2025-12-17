import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardBuilder } from '@/components/dashboard/DashboardBuilder';
import { EmptyDashboard } from '@/components/dashboard/EmptyDashboard';
import { AppLayout } from '@/components/layout/AppLayout';

const DashboardPage = () => {
  const { user } = useAuth();
  const { 
    getDashboards,
    currentDashboardId, 
    createDashboard, 
    setConfiguring,
    setCurrentUser,
    setCurrentDashboard,
    getCurrentDashboard,
    isConfiguring
  } = useDashboardStore();

  const dashboards = getDashboards();

  // Set current user when component mounts
  useEffect(() => {
    if (user?.id) {
      setCurrentUser(user.id);
    }
  }, [user?.id, setCurrentUser]);

  // Create default dashboard if none exists
  useEffect(() => {
    if (user?.id && dashboards.length === 0) {
      createDashboard('My Dashboard');
    } else if (!currentDashboardId && dashboards.length > 0) {
      setCurrentDashboard(dashboards[0].id);
    }
  }, [dashboards, currentDashboardId, createDashboard, user?.id, setCurrentDashboard]);

  const dashboard = getCurrentDashboard();
  const hasWidgets = dashboard?.widgets && dashboard.widgets.length > 0;

  const handleConfigure = () => {
    setConfiguring(true);
  };

  return (
    <AppLayout>
      {hasWidgets || isConfiguring ? (
        <DashboardBuilder />
      ) : (
        <EmptyDashboard onConfigure={handleConfigure} />
      )}
    </AppLayout>
  );
};

export default DashboardPage;
