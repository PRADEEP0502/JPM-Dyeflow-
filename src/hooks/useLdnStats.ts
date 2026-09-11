import { useMemo } from 'react';
import { LdnItem } from '../types';
import { parseQtyKg } from '../utils/format';

export interface CustomerStat {
  customer: string;
  total: number;
  converted: number;
  waiting: number;
  qtyKg: number;
  conversionRate: number;
}

export interface LdnStats {
  totalDelivered: number;
  totalConverted: number;
  totalWaiting: number;
  conversionRate: number;
  totalConfirmedQtyKg: number;
  customerBreakdown: CustomerStat[];
}

export function useLdnStats(data: LdnItem[]): LdnStats {
  return useMemo(() => {
    const byCustomer = new Map<string, CustomerStat>();
    let totalConverted = 0;
    let totalConfirmedQtyKg = 0;

    data.forEach((item) => {
      const current = byCustomer.get(item.customer) ?? {
        customer: item.customer,
        total: 0,
        converted: 0,
        waiting: 0,
        qtyKg: 0,
        conversionRate: 0,
      };
      current.total += 1;

      if (item.result === 'Bulk Order Found') {
        const qtyKg = parseQtyKg(item.bulkQty);
        current.converted += 1;
        current.qtyKg += qtyKg;
        totalConverted += 1;
        totalConfirmedQtyKg += qtyKg;
      } else {
        current.waiting += 1;
      }

      byCustomer.set(item.customer, current);
    });

    const customerBreakdown = Array.from(byCustomer.values())
      .map((stat) => ({
        ...stat,
        conversionRate: stat.total ? Math.round((stat.converted / stat.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const totalDelivered = data.length;
    const totalWaiting = totalDelivered - totalConverted;
    const conversionRate = totalDelivered ? Math.round((totalConverted / totalDelivered) * 100) : 0;

    return {
      totalDelivered,
      totalConverted,
      totalWaiting,
      conversionRate,
      totalConfirmedQtyKg,
      customerBreakdown,
    };
  }, [data]);
}
