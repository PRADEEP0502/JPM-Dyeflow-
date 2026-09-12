import { useMemo } from 'react';
import { LdnItem } from '../types';
import { ConversionOverviewCard } from '../components/dashboard/ConversionOverviewCard';
import { BulkQuantityPanel } from '../components/dashboard/BulkQuantityPanel';
import { BuyerConversionList } from '../components/dashboard/BuyerConversionList';
import { LabProcessingInsight } from '../components/dashboard/LabProcessingInsight';
import { InsightCard } from '../components/dashboard/InsightCard';
import { TrendPanel } from '../components/dashboard/TrendPanel';
import { TrendHeadline } from '../components/dashboard/TrendHeadline';
import { LineTrendChart } from '../components/dashboard/LineTrendChart';
import { MiniBarChart } from '../components/dashboard/MiniBarChart';
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
  onViewAll,
  onViewConverted,
  onViewPending,
}: DashboardPageProps) {
  const topCustomer = useMemo(
    () =>
      stats.customerBreakdown.reduce<(typeof stats.customerBreakdown)[number] | null>((best, current) => {
        if (current.total === 0) return best;
        if (!best || current.conversionRate > best.conversionRate) return current;
        return best;
      }, null),
    [stats.customerBreakdown]
  );

  const latestWeek = trend[trend.length - 1];
  const previousWeek = trend[trend.length - 2];
  const deliveredDelta = previousWeek ? latestWeek.delivered - previousWeek.delivered : 0;
  const conversionDelta = previousWeek ? latestWeek.conversionRate - previousWeek.conversionRate : 0;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-12 gap-5 sm:gap-6">
        <div className="lg:col-span-2 2xl:col-span-8">
          <ConversionOverviewCard
            stats={stats}
            onViewAll={onViewAll}
            onViewConverted={onViewConverted}
            onViewPending={onViewPending}
          />
        </div>
        <div className="lg:col-span-1 2xl:col-span-4">
          <BulkQuantityPanel stats={stats} totalLrn={lrnStats.totalLrn} onReviewPending={onViewPending} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2">
          <BuyerConversionList
            breakdown={stats.customerBreakdown}
            activeCustomer={customerFilter}
            onSelectCustomer={onSelectCustomer}
            onViewAll={onViewAll}
          />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-5 sm:gap-6">
          <LabProcessingInsight distribution={lrnStats.distribution} avgProcessingDays={lrnStats.avgProcessingDays} />
          <InsightCard
            headlineNumber={stats.conversionRate}
            headlineSuffix="%"
            headlineText={`${stats.totalConverted} of ${stats.totalDelivered} delivered samples have converted into confirmed bulk orders.`}
            secondaryText={
              topCustomer
                ? `${topCustomer.customer} leads conversion at ${topCustomer.conversionRate}%, with ${topCustomer.qtyKg.toLocaleString('en-IN')} KG confirmed.`
                : `Average LRN to LDN processing time is ${lrnStats.avgProcessingDays} days.`
            }
            progressPercent={stats.conversionRate}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <TrendPanel
          title="LDN Delivery Trend"
          description="Samples delivered per week"
          headline={<TrendHeadline value={latestWeek.delivered} delta={deliveredDelta} />}
        >
          <LineTrendChart
            data={trend.map((bucket) => ({ label: bucket.label, value: bucket.delivered }))}
            colorClassName="text-blue-500"
          />
        </TrendPanel>
        <TrendPanel
          title="Bulk Conversion Trend"
          description="Conversion rate of delivered samples, per week"
          headline={<TrendHeadline value={latestWeek.conversionRate} suffix="%" delta={conversionDelta} deltaSuffix="%" />}
          footnote="Recent weeks read lower because newer samples haven't had time to convert yet."
        >
          <MiniBarChart
            data={trend.map((bucket) => ({ label: bucket.label, value: bucket.conversionRate }))}
            barClassName="bg-gradient-to-b from-violet-600 to-violet-800"
            mutedBarClassName="bg-gradient-to-b from-violet-200 to-violet-400"
            axisMax={100}
            valueSuffix="%"
          />
        </TrendPanel>
      </div>

      <RecentActivityList data={recentData} onSelect={onSelectRecord} onViewAll={onViewAll} />
    </div>
  );
}
