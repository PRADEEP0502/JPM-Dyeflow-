import { useMemo } from 'react';
import { LdnItem } from '../types';

export interface TrendBucket {
  label: string;
  delivered: number;
  converted: number;
  conversionRate: number;
}

/** Oldest → newest, matching how `daysWaiting` (days since delivery) buckets into weeks. */
const BUCKET_LABELS = ['3+ Weeks Ago', '2 Weeks Ago', 'Last Week', 'This Week'];

/** Buckets delivered LDNs by week (from `daysWaiting`) purely from the demo data — no invented trend. */
export function useDeliveryTrend(data: LdnItem[]): TrendBucket[] {
  return useMemo(() => {
    const buckets = BUCKET_LABELS.map((label) => ({ label, delivered: 0, converted: 0, conversionRate: 0 }));

    data.forEach((item) => {
      const weeksAgo = Math.min(3, Math.floor((item.daysWaiting - 1) / 7));
      const bucketIndex = 3 - weeksAgo;
      buckets[bucketIndex].delivered += 1;
      if (item.result === 'Bulk Order Found') {
        buckets[bucketIndex].converted += 1;
      }
    });

    return buckets.map((bucket) => ({
      ...bucket,
      conversionRate: bucket.delivered ? Math.round((bucket.converted / bucket.delivered) * 100) : 0,
    }));
  }, [data]);
}
