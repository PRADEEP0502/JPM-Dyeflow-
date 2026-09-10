export type MatchResult = 'Bulk Order Found' | 'Waiting';

export interface LdnItem {
  ldnNo: string; // e.g. "LDN-10293"
  lrnNo: string; // e.g. "LRN-23"
  labAppNo: string; // e.g. "16321 (8157-26/A)"
  customer: string; // e.g. "Coral Knit Wear"
  colorName: string; // e.g. "13-2807 TX"
  colorHex?: string;
  fabric: string; // e.g. "Viscose"
  deliveredDate: string; // e.g. "08 Sep 2026"
  daysWaiting: number; // e.g. 2
  bulkOrderNo?: string; // e.g. "BO-2026-001" or undefined
  bulkQty?: string; // e.g. "2,000 KG" or undefined
  result: MatchResult;
}

export type NavTab = 'dashboard' | 'ldn-tracking' | 'waiting-bulk';
