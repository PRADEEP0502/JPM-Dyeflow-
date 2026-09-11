import { useMemo } from 'react';
import { LdnItem, MatchResult } from '../types';

export interface LdnFilterCriteria {
  searchQuery: string;
  statusFilter: 'all' | MatchResult;
  customerFilter: string;
  /** When set, overrides statusFilter — used to lock a page to one result (e.g. Pending Bulk Orders). */
  forcedStatus?: MatchResult;
}

export function useLdnFilters(data: LdnItem[], criteria: LdnFilterCriteria): LdnItem[] {
  const { searchQuery, statusFilter, customerFilter, forcedStatus } = criteria;

  return useMemo(() => {
    let list = data;

    if (forcedStatus) {
      list = list.filter((item) => item.result === forcedStatus);
    } else if (statusFilter !== 'all') {
      list = list.filter((item) => item.result === statusFilter);
    }

    if (customerFilter !== 'all') {
      list = list.filter((item) => item.customer === customerFilter);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (item) =>
          item.customer.toLowerCase().includes(query) ||
          item.ldnNo.toLowerCase().includes(query) ||
          item.lrnNo.toLowerCase().includes(query) ||
          item.labAppNo.toLowerCase().includes(query) ||
          item.colorName.toLowerCase().includes(query) ||
          (item.bulkOrderNo ? item.bulkOrderNo.toLowerCase().includes(query) : false)
      );
    }

    return list;
  }, [data, forcedStatus, statusFilter, customerFilter, searchQuery]);
}
