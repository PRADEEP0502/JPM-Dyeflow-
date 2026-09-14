import { useMemo } from 'react';
import { LdnItem, MatchResult, RecordFilters } from '../types';

export interface LdnFilterCriteria {
  searchQuery: string;
  filters: RecordFilters;
  /** When set, overrides the status filter — used to lock a page to one result (e.g. Bulk Order Check). */
  forcedStatus?: MatchResult;
}

export function useLdnFilters(data: LdnItem[], criteria: LdnFilterCriteria): LdnItem[] {
  const { searchQuery, filters, forcedStatus } = criteria;

  return useMemo(() => {
    let list = data;

    if (forcedStatus) {
      list = list.filter((item) => item.result === forcedStatus);
    } else if (filters.status !== 'all') {
      list = list.filter((item) => item.result === filters.status);
    }

    if (filters.customer !== 'all') {
      list = list.filter((item) => item.customer === filters.customer);
    }
    if (filters.fabric !== 'all') {
      list = list.filter((item) => item.fabric === filters.fabric);
    }
    if (filters.colour !== 'all') {
      list = list.filter((item) => item.colorName === filters.colour);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((item) =>
        [
          item.ldnNo,
          item.lrnNo,
          item.labAppNo,
          item.customer,
          item.colorName,
          item.fabric,
          item.deliveredDate,
          item.bulkOrderNo ?? '',
          item.bulkQty ?? '',
          item.bulkOrderDate ?? '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    return list;
  }, [data, forcedStatus, filters, searchQuery]);
}
