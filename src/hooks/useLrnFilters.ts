import { useMemo } from 'react';
import { LdnItem, LrnRecord, RecordFilters } from '../types';

export interface LrnFilterCriteria {
  searchQuery: string;
  filters: RecordFilters;
}

/** Filters LRN records by search text, the linked LDN's result, and every LRN dimension. */
export function useLrnFilters(lrnData: LrnRecord[], ldnData: LdnItem[], criteria: LrnFilterCriteria): LrnRecord[] {
  const { searchQuery, filters } = criteria;

  return useMemo(() => {
    const ldnByLrnNo = new Map(ldnData.map((item) => [item.lrnNo, item]));
    let list = lrnData;

    if (filters.status !== 'all') {
      list = list.filter((lrn) => ldnByLrnNo.get(lrn.lrnNo)?.result === filters.status);
    }
    if (filters.customer !== 'all') {
      list = list.filter((lrn) => lrn.party === filters.customer);
    }
    if (filters.buyer !== 'all') {
      list = list.filter((lrn) => lrn.buyer === filters.buyer);
    }
    if (filters.fabric !== 'all') {
      list = list.filter((lrn) => lrn.fabric === filters.fabric);
    }
    if (filters.colour !== 'all') {
      list = list.filter((lrn) => lrn.colour === filters.colour);
    }
    if (filters.matchSource !== 'all') {
      list = list.filter((lrn) => lrn.matchSource === filters.matchSource);
    }
    if (filters.partyGroup !== 'all') {
      list = list.filter((lrn) => lrn.partyGroup === filters.partyGroup);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((lrn) =>
        [
          lrn.lrnNo,
          lrn.date,
          lrn.party,
          lrn.buyer,
          lrn.contact,
          lrn.contactNo,
          lrn.fabric,
          lrn.colour,
          lrn.markNo,
          lrn.orderNo,
          lrn.mlr,
          lrn.matchSource,
          lrn.partyGroup,
          lrn.remarks,
          ldnByLrnNo.get(lrn.lrnNo)?.ldnNo ?? '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    return list;
  }, [lrnData, ldnData, filters, searchQuery]);
}
