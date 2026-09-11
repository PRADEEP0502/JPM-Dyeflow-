import { LdnItem } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { WorkflowStepper } from '../components/dashboard/WorkflowStepper';
import { ConversionOverviewCard } from '../components/dashboard/ConversionOverviewCard';
import { BulkQuantityPanel } from '../components/dashboard/BulkQuantityPanel';
import { BuyerConversionList } from '../components/dashboard/BuyerConversionList';
import { LabProcessingInsight } from '../components/dashboard/LabProcessingInsight';
import { TrendPanel } from '../components/dashboard/TrendPanel';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { LdnStats } from '../hooks/useLdnStats';
import { LrnStats } from '../hooks/useLrnStats';
import { TrendBucket } from '../hooks/useDeliveryTrend';

interface DashboardPageProps {
  stats: LdnStats;
  lrnStats: LrnStats;
  trend: TrendBucket[];
  recentData: LdnItem[];
  customerFilter: string;
  onSelectCustomer: (customer: string) => void;
  onSelectRecord: (item: LdnItem) => void;
  onViewLrn: () => void;
  onViewAll: () => void;
  onViewConverted: () => void;
  onViewPending: () => void;
}

export function DashboardPage({
  stats,
  lrnStats,
  trend,
  recentData,
  customerFilter,
  onSelectCustomer,
  onSelectRecord,
  onViewLrn,
  onViewAll,
  onViewConverted,
  onViewPending,
}: DashboardPageProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <WorkflowStepper avgProcessingDays={lrnStats.avgProcessingDays} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="LRN Received"
          value={lrnStats.totalLrn}
          sublabel="Lab inward entries"
          onClick={onViewLrn}
        />
        <StatCard
          label="LDN Delivered"
          value={stats.totalDelivered}
          sublabel="Sample lots outward"
          onClick={onViewAll}
        />
        <StatCard
          label="Bulk Orders Found"
          value={stats.totalConverted}
          trend={`${stats.conversionRate}%`}
          tone="positive"
          sublabel="Conversion rate"
          onClick={onViewConverted}
        />
        <StatCard
          label="Pending Conversion"
          value={stats.totalWaiting}
          trend={stats.totalDelivered ? `${100 - stats.conversionRate}%` : undefined}
          tone="warning"
          sublabel="Awaiting ERP entry"
          onClick={onViewPending}
        />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          sublabel={`${stats.totalConverted}/${stats.totalDelivered} LDNs`}
        />
        <StatCard
          label="Bulk Quantity"
          value={stats.totalConfirmedQtyKg.toLocaleString('en-IN')}
          unit="KG"
          sublabel={`Across ${stats.totalConverted} orders`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-12 gap-5 sm:gap-6">
        <div className="lg:col-span-2 2xl:col-span-8">
          <ConversionOverviewCard stats={stats} onViewConverted={onViewConverted} onViewPending={onViewPending} />
        </div>
        <div className="lg:col-span-1 2xl:col-span-4">
          <BulkQuantityPanel stats={stats} onReviewPending={onViewPending} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2">
          <BuyerConversionList
            breakdown={stats.customerBreakdown}
            activeCustomer={customerFilter}
            onSelectCustomer={onSelectCustomer}
          />
        </div>
        <LabProcessingInsight distribution={lrnStats.distribution} avgProcessingDays={lrnStats.avgProcessingDays} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <TrendPanel
          title="LDN Delivery Trend"
          description="Samples delivered per week"
          data={trend.map((bucket) => ({ label: bucket.label, value: bucket.delivered }))}
          barClassName="bg-blue-500"
        />
        <TrendPanel
          title="Bulk Conversion Trend"
          description="Conversion rate of delivered samples, per week"
          data={trend.map((bucket) => ({ label: bucket.label, value: bucket.conversionRate }))}
          barClassName="bg-violet-500"
          valueSuffix="%"
          footnote="Recent weeks read lower because newer samples haven't had time to convert yet."
        />
      </div>

      <RecentActivityList data={recentData} onSelect={onSelectRecord} />
    </div>
  );
}
