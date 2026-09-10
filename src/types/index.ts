export type MatchStatus = 'Bulk Found' | 'Pending';

export interface LdnRecord {
  ldnNo: string; // e.g. "LDN-10293"
  lrnNo: string; // e.g. "LRN-8401"
  labAppNo: string; // e.g. "8157-26/A" or "16321"
  customer: string; // e.g. "Coral Knit Wear"
  colorName: string; // e.g. "13-2807 TX"
  colorHex: string;
  fabric: string; // e.g. "Viscose", "Cotton", "Loopknit"
  sampleWeightKg?: number;
  sampleDeliveryDate: string; // e.g. "08 Sep 2026"
  daysSinceDelivery: number; // e.g. 2
  status: MatchStatus;
  
  // Linked ERP Bulk Order fields (if Bulk Found)
  bulkOrderNo?: string; // e.g. "BO-2026-001"
  bulkOrderDate?: string;
  bulkQuantityKg?: number; // e.g. 2000
  erpSyncStatus?: 'Matched' | 'Unmatched';
  
  // LRN & Lab metadata
  lrnDate: string;
  labProcessDate: string;
  colorist: string;
  remarks?: string;
}

export interface ErpBulkOrder {
  bulkOrderNo: string; // e.g. "BO-2026-001"
  customer: string;
  colorName: string;
  colorHex: string;
  fabric: string;
  quantityKg: number;
  orderDate: string;
  linkedLdnNo?: string;
  labAppNo?: string;
  status: 'Matched with LDN' | 'Direct Order (No LDN)';
}

export interface DashboardMetrics {
  totalLdnDelivered: number; // e.g. 100
  bulkOrdersFound: number; // e.g. 63
  bulkOrdersPending: number; // e.g. 37
  totalBulkQuantityKg: number; // e.g. 125000
  conversionPercentage: number; // 63%
}

export type ActivePage = 
  | 'dashboard'
  | 'ldn-tracking'
  | 'pending-bulk'
  | 'erp-orders';
