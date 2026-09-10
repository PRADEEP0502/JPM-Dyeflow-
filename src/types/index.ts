export type LabApprovalStatus = 
  | 'Awaiting Customer' 
  | 'Approved' 
  | 'Rejected' 
  | 'Resubmission Required';

export type ProductionStatus = 
  | 'Queued' 
  | 'Dyeing' 
  | 'QC' 
  | 'Completed';

export type DeliveryStatus = 
  | 'Pending'
  | 'Production Complete'
  | 'Ready for Delivery' 
  | 'Dispatched' 
  | 'Delivered';

export interface DyestuffItem {
  dyeName: string;
  code: string;
  percentage: number;
  ratio: string;
}

export interface FastnessScore {
  washing: number;
  rubbingDry: number;
  rubbingWet: number;
  light: number;
}

export interface LabApproval {
  labAppNo: string; // e.g. "8157-26/A"
  runningNo: number; // 8157
  yearCode: string; // "26"
  colorCode: string; // "A"
  customer: string;
  colorName: string;
  colorHex: string;
  targetHex: string;
  deltaE: number;
  fabric: string;
  sampleWeightKg: number;
  machineNo: string;
  cdcNo: string;
  dyestuffRecipe: DyestuffItem[];
  requestDate: string;
  approvalDate?: string;
  approvalStatus: LabApprovalStatus;
  rejectionReason?: string;
  linkedBulkOrderNo?: string;
  dyesmith: string;
  lightSources: string[];
  fastness: FastnessScore;
  remarks?: string;
}

export interface BulkOrder {
  bulkOrderNo: string; // e.g. "B-2026-001"
  labAppNo: string; // link to LabApproval
  customer: string;
  colorName: string;
  colorHex: string;
  fabric: string;
  orderQtyKg: number;
  orderDate: string;
  requiredDeliveryDate: string;
  productionStatus: ProductionStatus;
  deliveryStatus: DeliveryStatus;
  specialInstructions?: string;
  yarnLotNo: string;
  gsm: number;
  diaInches: number;
  poReference?: string;
  currentStage: 'Lab' | 'Approval' | 'Bulk' | 'Production' | 'Delivery' | 'Delivered';
}

export interface ProductionBatch {
  batchId: string; // e.g. "PRD-8157-01"
  bulkOrderNo: string;
  labAppNo: string;
  customer: string;
  colorName: string;
  colorHex: string;
  fabric: string;
  quantityKg: number;
  machineVessel: string;
  stage: ProductionStatus;
  progressPct: number;
  startTime?: string;
  expectedCompletion: string;
  actualCompletion?: string;
  temperatureC?: number;
  phLevel?: number;
  operatorName: string;
  qcNotes?: string;
  qcPassed?: boolean;
}

export interface DeliveryRecord {
  deliveryId: string; // e.g. "DEL-2026-042"
  bulkOrderNo: string;
  labAppNo: string;
  customer: string;
  colorName: string;
  colorHex: string;
  quantityKg: number;
  rollsCount: number;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  dispatchDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  deliveryStatus: DeliveryStatus;
  receiverName?: string;
  deliveredDateTime?: string;
  remarks?: string;
  eWayBillNo: string;
}

export interface PipelineMetrics {
  labSamplesCount: number;
  approvalPendingCount: number;
  bulkOrdersCount: number;
  bulkTotalQtyKg: number;
  productionActiveCount: number;
  productionTotalQtyKg: number;
  deliveryReadyCount: number;
  deliveryDispatchedCount: number;
  deliveredCount: number;
}

export type ActiveTab = 
  | 'overview'
  | 'lab-approvals'
  | 'customer-approvals'
  | 'bulk-orders'
  | 'production'
  | 'deliveries'
  | 'reports'
  | 'settings';
