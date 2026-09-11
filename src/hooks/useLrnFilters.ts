import { useMemo } from 'react';
import { LrnRecord } from '../types';

export function useLrnFilters(data: LrnRecord[], searchQuery: string): LrnRecord[] {
  return useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;

    return data.filter(
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
  }, [data, searchQuery]);
}
