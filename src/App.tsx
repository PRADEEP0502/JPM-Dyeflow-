import { useMemo, useState } from 'react';
import { LdnItem, MatchResult, NavTab } from './types';
import { LDN_DATA, LRN_DATA, DATA_AS_OF } from './data/mockData';
import { useLdnStats } from './hooks/useLdnStats';
import { useLdnFilters } from './hooks/useLdnFilters';
import { useLrnStats } from './hooks/useLrnStats';
import { useLrnFilters } from './hooks/useLrnFilters';
import { useDeliveryTrend } from './hooks/useDeliveryTrend';
import { formatDisplayDate } from './utils/format';
import { Header } from './components/layout/Header';
import { LdnDetailModal } from './components/ldn/LdnDetailModal';
import { DashboardPage } from './pages/DashboardPage';
import { LrnRegisterPage } from './pages/LrnRegisterPage';
import { LdnRegisterPage } from './pages/LdnRegisterPage';
import { PendingBulkPage } from './pages/PendingBulkPage';

const PAGE_META: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Lab Delivery to Bulk Order Reconciliation',
    subtitle: 'Status tracking of lab colour approvals converted into production bulk orders in ERP',
  },
  'lrn-tracking': {
    title: 'LRN Register',
    subtitle: 'Lab inward entries received from customers before colour matching begins',
  },
  'ldn-tracking': {
    title: 'LDN Tracking',
    subtitle: 'Complete record of delivered lab samples and cross-verified ERP bulk order status',
  },
  'waiting-bulk': {
    title: 'Bulk Order Check',
    subtitle: 'Samples delivered to customer where no corresponding bulk order has been logged yet',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | MatchResult>('all');
  const [selectedItem, setSelectedItem] = useState<LdnItem | null>(null);

  const stats = useLdnStats(LDN_DATA);
  const lrnStats = useLrnStats(LRN_DATA, LDN_DATA);
  const trend = useDeliveryTrend(LDN_DATA);

  const registerData = useLdnFilters(LDN_DATA, { searchQuery, statusFilter, customerFilter });
  const pendingData = useLdnFilters(LDN_DATA, {
    searchQuery,
    statusFilter,
    customerFilter,
    forcedStatus: 'Waiting',
  });
  const lrnFilteredData = useLrnFilters(LRN_DATA, searchQuery);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'waiting-bulk') {
      setStatusFilter('all');
    }
  };

  const dataAsOfLabel = useMemo(() => formatDisplayDate(DATA_AS_OF), []);
  const pageMeta = PAGE_META[activeTab];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col antialiased">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-5 border-b border-neutral-200">
          <div>
            <h1 className="text-[26px] sm:text-[28px] font-semibold text-neutral-900 tracking-tight leading-tight">
              {pageMeta.title}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">{pageMeta.subtitle}</p>
          </div>
          <div className="text-xs text-neutral-400 font-mono">Data as of {dataAsOfLabel}</div>
        </div>

        {activeTab === 'dashboard' && (
          <DashboardPage
            stats={stats}
            lrnStats={lrnStats}
            trend={trend}
            recentData={LDN_DATA}
            customerFilter={customerFilter}
            onSelectCustomer={setCustomerFilter}
            onSelectRecord={setSelectedItem}
            onViewLrn={() => handleTabChange('lrn-tracking')}
            onViewAll={() => handleTabChange('ldn-tracking')}
            onViewConverted={() => {
              handleTabChange('ldn-tracking');
              setStatusFilter('Bulk Order Found');
            }}
            onViewPending={() => handleTabChange('waiting-bulk')}
          />
        )}

        {activeTab === 'lrn-tracking' && (
          <LrnRegisterPage filteredData={lrnFilteredData} stats={lrnStats} onSelect={setSelectedItem} />
        )}

        {activeTab === 'ldn-tracking' && (
          <LdnRegisterPage
            totalCount={LDN_DATA.length}
            filteredData={registerData}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            customerFilter={customerFilter}
            onClearCustomer={() => setCustomerFilter('all')}
            onSelect={setSelectedItem}
          />
        )}

        {activeTab === 'waiting-bulk' && (
          <PendingBulkPage
            filteredData={pendingData}
            customerFilter={customerFilter}
            onClearCustomer={() => setCustomerFilter('all')}
            onSelect={setSelectedItem}
          />
        )}
      </main>

      {selectedItem && <LdnDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
