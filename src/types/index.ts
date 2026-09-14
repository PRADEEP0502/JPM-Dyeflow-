export type MatchResult = 'Bulk Order Found' | 'Waiting';

export interface LdnItem {
  ldnNo: string; // e.g. "LDN-10293"
  lrnNo: string; // e.g. "LRN-23" — links back to the LrnRecord with the same lrnNo
  labAppNo: string; // e.g. "16321 (8157-26/A)"
  customer: string; // e.g. "Coral Knit Wear"
  colorName: string; // e.g. "13-2807 TX"
  colorHex?: string;
  fabric: string; // e.g. "Viscose"
  deliveredDate: string; // e.g. "08 Sep 2026"
  daysWaiting: number; // e.g. 2
  bulkOrderNo?: string; // e.g. "BO-2026-001" or undefined
  bulkQty?: string; // e.g. "2,000 KG" or undefined
  bulkOrderDate?: string; // date the bulk order was logged in ERP — only set when bulkOrderNo is set
  result: MatchResult;
}

/** Selsoft LRN (Lab Inward Entry) — the first stage of the workflow, before Lab Processing. */
export interface LrnRecord {
  lrnNo: string; // e.g. "LRN-23" — the same LRN No carried on the matching LdnItem
  date: string; // Lab inward receive date
  party: string; // Party / Customer placing the lab request
  contact: string;
  buyer: string;
  fabric: string;
  markNo: string;
  remarks: string;
  expectedDeliveryDate: string;
  partyGroup: string;
  contactNo: string;
  orderNo: string;
  colour: string;
  matchSource: string;
  mlr: string;
}

export type NavTab = 'dashboard' | 'lrn-tracking' | 'ldn-tracking' | 'waiting-bulk';

/** Shared filter state across the record pages. 'all' means the dimension is unfiltered. */
export interface RecordFilters {
  status: 'all' | MatchResult;
  customer: string;
  fabric: string;
  colour: string;
  buyer: string; // LRN Register only
  matchSource: string; // LRN Register only
  partyGroup: string; // LRN Register only
}

export const EMPTY_FILTERS: RecordFilters = {
  status: 'all',
  customer: 'all',
  fabric: 'all',
  colour: 'all',
  buyer: 'all',
  matchSource: 'all',
  partyGroup: 'all',
};
