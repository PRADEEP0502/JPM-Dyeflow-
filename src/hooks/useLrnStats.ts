import { useMemo } from 'react';
import { LdnItem, LrnRecord } from '../types';
import { daysBetween, parseDisplayDate } from '../utils/format';

export interface ProcessingTimeBucket {
  days: number;
  count: number;
}

export interface LrnStats {
  totalLrn: number;
  avgProcessingDays: number;
  /** Distribution of LRN → LDN lab processing time, in whole days, derived from the actual record dates. */
  distribution: ProcessingTimeBucket[];
}

/** Derives LRN-related metrics purely from the demo data — no hardcoded figures. */
export function useLrnStats(lrnData: LrnRecord[], ldnData: LdnItem[]): LrnStats {
  return useMemo(() => {
    const ldnByLrnNo = new Map(ldnData.map((item) => [item.lrnNo, item]));
    const byDays = new Map<number, number>();

    let totalDays = 0;
    let matchedCount = 0;

    lrnData.forEach((lrn) => {
      const matchedLdn = ldnByLrnNo.get(lrn.lrnNo);
      if (!matchedLdn) return;

      const days = daysBetween(parseDisplayDate(lrn.date), parseDisplayDate(matchedLdn.deliveredDate));
      totalDays += days;
      matchedCount += 1;
      byDays.set(days, (byDays.get(days) ?? 0) + 1);
    });

    const distribution = Array.from(byDays.entries())
      .map(([days, count]) => ({ days, count }))
      .sort((a, b) => a.days - b.days);

    return {
      totalLrn: lrnData.length,
      avgProcessingDays: matchedCount ? Math.round((totalDays / matchedCount) * 10) / 10 : 0,
      distribution,
    };
  }, [lrnData, ldnData]);
}
