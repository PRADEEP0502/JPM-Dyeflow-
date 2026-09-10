import React from 'react';
import { DyeFlowProvider, useDyeFlow } from './context/DyeFlowContext';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { OverviewView } from './components/views/OverviewView';
import { LabApprovalsView } from './components/views/LabApprovalsView';
import { CustomerApprovalsView } from './components/views/CustomerApprovalsView';
import { BulkOrdersView } from './components/views/BulkOrdersView';
import { ProductionView } from './components/views/ProductionView';
import { DeliveriesView } from './components/views/DeliveriesView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { TraceModal } from './components/common/TraceModal';
import { NotificationToastContainer } from './components/common/NotificationToast';

const AppContent: React.FC = () => {
  const { activeTab } = useDyeFlow();

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'lab-approvals':
        return <LabApprovalsView />;
      case 'customer-approvals':
        return <CustomerApprovalsView />;
      case 'bulk-orders':
        return <BulkOrdersView />;
      case 'production':
        return <ProductionView />;
      case 'deliveries':
        return <DeliveriesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f6f8]">
      {/* Industrial Left Navigation Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AppHeader />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto bg-grid-industrial">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <TraceModal />
      <NotificationToastContainer />
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
