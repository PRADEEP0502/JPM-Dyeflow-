import { useMemo } from 'react';
import { LdnItem, LrnRecord, MatchResult } from '../types';

export interface LrnFilterCriteria {
  searchQuery: string;
  statusFilter: 'all' | MatchResult;
  customerFilter: string;
}

/** Filters LRN records by search text, by the linked LDN's result, and by party/customer. */
export function useLrnFilters(lrnData: LrnRecord[], ldnData: LdnItem[], criteria: LrnFilterCriteria): LrnRecord[] {
  const { searchQuery, statusFilter, customerFilter } = criteria;

  return useMemo(() => {
    const ldnByLrnNo = new Map(ldnData.map((item) => [item.lrnNo, item]));
    let list = lrnData;

    if (statusFilter !== 'all') {
      list = list.filter((lrn) => ldnByLrnNo.get(lrn.lrnNo)?.result === statusFilter);
    }

    if (customerFilter !== 'all') {
      list = list.filter((lrn) => lrn.party === customerFilter);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (lrn) =>
          lrn.lrnNo.toLowerCase().includes(query) ||
          lrn.party.toLowerCase().includes(query) ||
          lrn.buyer.toLowerCase().includes(query) ||
          lrn.fabric.toLowerCase().includes(query) ||
          lrn.colour.toLowerCase().includes(query) ||
          lrn.markNo.toLowerCase().includes(query) ||
          lrn.matchSource.toLowerCase().includes(query) ||
          lrn.contact.toLowerCase().includes(query)
      );
    }

    return list;
  }, [lrnData, ldnData, statusFilter, customerFilter, searchQuery]);
}
