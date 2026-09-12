import { useMemo, useState } from 'react';
import { Link2 } from 'lucide-react';
import { LdnItem, MatchResult, NavTab } from './types';
import { LDN_DATA, LRN_DATA, DATA_AS_OF } from './data/mockData';
import { useLdnStats } from './hooks/useLdnStats';
import { useLdnFilters } from './hooks/useLdnFilters';
import { useLrnStats } from './hooks/useLrnStats';
import { useLrnFilters } from './hooks/useLrnFilters';
import { useDeliveryTrend } from './hooks/useDeliveryTrend';
import { formatDisplayDate, isDateWithinRange, parseDisplayDate } from './utils/format';
import { Header } from './components/layout/Header';
import { DateRangeControl } from './components/common/DateRangeControl';
import { LdnDetailModal } from './components/ldn/LdnDetailModal';
import { DashboardPage } from './pages/DashboardPage';
import { LrnRegisterPage } from './pages/LrnRegisterPage';
import { LdnRegisterPage } from './pages/LdnRegisterPage';
import { PendingBulkPage } from './pages/PendingBulkPage';

const PAGE_META: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Overview',
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

// Full span of the demo dataset — the date range control defaults to (and is bounded by) this.
const DELIVERY_DATES = LDN_DATA.map((item) => parseDisplayDate(item.deliveredDate).getTime());
const MIN_DELIVERY_DATE = new Date(Math.min(...DELIVERY_DATES));
const MAX_DELIVERY_DATE = new Date(Math.max(...DELIVERY_DATES));

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | MatchResult>('all');
  const [selectedItem, setSelectedItem] = useState<LdnItem | null>(null);
  const [dateRange, setDateRange] = useState({ start: MIN_DELIVERY_DATE, end: MAX_DELIVERY_DATE });

  const dateFilteredLdnData = useMemo(
    () => LDN_DATA.filter((item) => isDateWithinRange(item.deliveredDate, dateRange.start, dateRange.end)),
    [dateRange]
  );
  const dateFilteredLrnData = useMemo(() => {
    const survivingLrnNos = new Set(dateFilteredLdnData.map((item) => item.lrnNo));
    return LRN_DATA.filter((lrn) => survivingLrnNos.has(lrn.lrnNo));
  }, [dateFilteredLdnData]);

  const stats = useLdnStats(dateFilteredLdnData);
  const lrnStats = useLrnStats(dateFilteredLrnData, dateFilteredLdnData);
  const trend = useDeliveryTrend(dateFilteredLdnData);

  const registerData = useLdnFilters(dateFilteredLdnData, { searchQuery, statusFilter, customerFilter });
  const pendingData = useLdnFilters(dateFilteredLdnData, {
    searchQuery,
    statusFilter,
    customerFilter,
    forcedStatus: 'Waiting',
  });
  const lrnFilteredData = useLrnFilters(dateFilteredLrnData, dateFilteredLdnData, {
    searchQuery,
    statusFilter,
    customerFilter,
  });

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'waiting-bulk') {
      setStatusFilter('all');
    }
  };

  const dataAsOfLabel = useMemo(() => formatDisplayDate(DATA_AS_OF), []);
  const pageMeta = PAGE_META[activeTab];

  return (
    <div
      className="min-h-screen text-neutral-900 flex flex-col antialiased"
      style={{
        backgroundColor: '#fafafa',
        backgroundImage:
          'radial-gradient(at 8% 0%, rgba(59,130,246,0.09) 0, transparent 45%), radial-gradient(at 92% 8%, rgba(139,92,246,0.09) 0, transparent 45%), radial-gradient(at 50% 100%, rgba(16,185,129,0.07) 0, transparent 50%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-neutral-200">
          <div>
            <h1 className="text-[26px] sm:text-[28px] font-semibold text-neutral-900 uppercase tracking-wide leading-tight flex items-center gap-2">
              {pageMeta.title}
              {activeTab === 'dashboard' && <Link2 className="w-4 h-4 text-neutral-300" aria-hidden="true" />}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">{pageMeta.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeControl
              start={dateRange.start}
              end={dateRange.end}
              minDate={MIN_DELIVERY_DATE}
              maxDate={MAX_DELIVERY_DATE}
              onChange={(start, end) => setDateRange({ start, end })}
            />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-500 font-mono shrink-0">
              Data as of {dataAsOfLabel}
            </span>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <DashboardPage
            stats={stats}
            lrnStats={lrnStats}
            trend={trend}
            recentData={dateFilteredLdnData}
            customerFilter={customerFilter}
            onSelectCustomer={setCustomerFilter}
            onSelectRecord={setSelectedItem}
            onViewAll={() => handleTabChange('ldn-tracking')}
            onViewConverted={() => {
              handleTabChange('ldn-tracking');
              setStatusFilter('Bulk Order Found');
            }}
            onViewPending={() => handleTabChange('waiting-bulk')}
          />
        )}

        {activeTab === 'lrn-tracking' && (
          <LrnRegisterPage
            totalCount={dateFilteredLrnData.length}
            filteredData={lrnFilteredData}
            stats={lrnStats}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            customerFilter={customerFilter}
            onClearCustomer={() => setCustomerFilter('all')}
            onSelect={setSelectedItem}
          />
        )}

        {activeTab === 'ldn-tracking' && (
          <LdnRegisterPage
            totalCount={dateFilteredLdnData.length}
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
