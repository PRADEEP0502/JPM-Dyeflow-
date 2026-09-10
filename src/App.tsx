import React from 'react';
import { DyeFlowProvider, useDyeFlow } from './context/DyeFlowContext';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { DashboardView } from './components/views/DashboardView';
import { LdnTrackingView } from './components/views/LdnTrackingView';
import { PendingBulkView } from './components/views/PendingBulkView';
import { ErpBulkOrdersView } from './components/views/ErpBulkOrdersView';
import { DetailTimelineModal } from './components/common/DetailTimelineModal';

const AppContent: React.FC = () => {
  const { activePage } = useDyeFlow();

  const renderCurrentView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'ldn-tracking':
        return <LdnTrackingView />;
      case 'pending-bulk':
        return <PendingBulkView />;
      case 'erp-orders':
        return <ErpBulkOrdersView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      {/* Sidebar Navigation */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AppHeader />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* 5-Step Detail Timeline Modal */}
      <DetailTimelineModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DyeFlowProvider>
      <AppContent />
    </DyeFlowProvider>
  );
};

export default App;
