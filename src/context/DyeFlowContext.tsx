import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  LabApproval, 
  BulkOrder, 
  ProductionBatch, 
  DeliveryRecord, 
  ActiveTab,
  LabApprovalStatus,
  ProductionStatus,
  DeliveryStatus
} from '../types';
import { 
  INITIAL_LAB_APPROVALS, 
  INITIAL_BULK_ORDERS, 
  INITIAL_PRODUCTION_BATCHES, 
  INITIAL_DELIVERY_RECORDS 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface DyeFlowContextType {
  // State
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  labApprovals: LabApproval[];
  bulkOrders: BulkOrder[];
  productionBatches: ProductionBatch[];
  deliveryRecords: DeliveryRecord[];
  
  // Selected items & Modals
  selectedLabAppNo: string | null;
  setSelectedLabAppNo: (labAppNo: string | null) => void;
  selectedBulkOrderNo: string | null;
  setSelectedBulkOrderNo: (orderNo: string | null) => void;
  traceQuery: string;
  setTraceQuery: (q: string) => void;
  isTraceModalOpen: boolean;
  setIsTraceModalOpen: (open: boolean) => void;
  openTraceFor: (referenceNo: string) => void;
  
  // Search & Global Filters
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  selectedCustomerFilter: string;
  setSelectedCustomerFilter: (c: string) => void;
  selectedDateRange: string;
  setSelectedDateRange: (d: string) => void;
  
  // Notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Actions
  updateLabApprovalStatus: (labAppNo: string, status: LabApprovalStatus, reason?: string) => void;
  createLabApproval: (sample: Omit<LabApproval, 'labAppNo' | 'runningNo' | 'yearCode' | 'colorCode' | 'approvalStatus'>) => string;
  createBulkOrderFromLab: (labAppNo: string, orderData: {
    orderQtyKg: number;
    requiredDeliveryDate: string;
    yarnLotNo: string;
    gsm: number;
    diaInches: number;
    specialInstructions?: string;
  }) => string;
  advanceProductionStage: (batchId: string, nextStage: ProductionStatus, qcNotes?: string) => void;
  dispatchDelivery: (deliveryId: string, vehicleNo: string, driverName: string, driverPhone: string, eWayBillNo: string) => void;
  recordProofOfDelivery: (deliveryId: string, receiverName: string, remarks?: string) => void;
  
  // ERP sync simulation
  lastSyncTime: string;
  syncWithErp: () => void;
  isSyncing: boolean;
}

const DyeFlowContext = createContext<DyeFlowContextType | undefined>(undefined);

export const DyeFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [labApprovals, setLabApprovals] = useState<LabApproval[]>(INITIAL_LAB_APPROVALS);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>(INITIAL_BULK_ORDERS);
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>(INITIAL_PRODUCTION_BATCHES);
  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>(INITIAL_DELIVERY_RECORDS);
  
  const [selectedLabAppNo, setSelectedLabAppNo] = useState<string | null>('8157-26/A');
  const [selectedBulkOrderNo, setSelectedBulkOrderNo] = useState<string | null>(null);
  
  const [traceQuery, setTraceQuery] = useState<string>('');
  const [isTraceModalOpen, setIsTraceModalOpen] = useState<boolean>(false);
  
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState<string>('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('This Month (Sep 2026)');
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Today at 09:45 AM (Selsoft ERP v4.2)');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openTraceFor = (referenceNo: string) => {
    setTraceQuery(referenceNo);
    setIsTraceModalOpen(true);
  };

  const syncWithErp = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeString = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Selsoft ERP v4.2)`;
      setLastSyncTime(timeString);
      addToast({
        type: 'success',
        title: 'Selsoft ERP Synchronized',
        message: 'Successfully refreshed live recipe formulations, batch vessels & dispatch queues.'
      });
    }, 1200);
  };

  const updateLabApprovalStatus = (labAppNo: string, status: LabApprovalStatus, reason?: string) => {
    const currentDate = '2026-09-09';
    setLabApprovals(prev => prev.map(lab => {
      if (lab.labAppNo === labAppNo) {
        return {
          ...lab,
          approvalStatus: status,
          approvalDate: status === 'Approved' ? currentDate : lab.approvalDate,
          rejectionReason: status === 'Rejected' || status === 'Resubmission Required' ? reason : undefined
        };
      }
      return lab;
    }));

    addToast({
      type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'info',
      title: `Lab App ${labAppNo} Updated`,
      message: `Status transitioned to "${status}"${reason ? `: ${reason}` : ''}`
    });
  };

  const createLabApproval = (sampleData: Omit<LabApproval, 'labAppNo' | 'runningNo' | 'yearCode' | 'colorCode' | 'approvalStatus'>): string => {
    const nextRunningNo = Math.max(...labApprovals.map(l => l.runningNo), 8164) + 1;
    const yearCode = '26';
    const colorCode = 'A';
    const labAppNo = `${nextRunningNo}-${yearCode}/${colorCode}`;

    const newLabApproval: LabApproval = {
      ...sampleData,
      labAppNo,
      runningNo: nextRunningNo,
      yearCode,
      colorCode,
      requestDate: '2026-09-09',
      approvalStatus: 'Awaiting Customer'
    };

    setLabApprovals(prev => [newLabApproval, ...prev]);
    setSelectedLabAppNo(labAppNo);

    addToast({
      type: 'success',
      title: 'Lab Recipe Sample Registered',
      message: `Created Lab Approval Reference ${labAppNo} for ${newLabApproval.customer} (${newLabApproval.colorName}).`
    });

    return labAppNo;
  };

  const createBulkOrderFromLab = (
    labAppNo: string, 
    orderData: {
      orderQtyKg: number;
      requiredDeliveryDate: string;
      yarnLotNo: string;
      gsm: number;
      diaInches: number;
      specialInstructions?: string;
    }
  ): string => {
    const lab = labApprovals.find(l => l.labAppNo === labAppNo);
    if (!lab) return '';

    const nextOrderNum = bulkOrders.length + 1;
    const bulkOrderNo = `B-2026-${String(nextOrderNum).padStart(3, '0')}`;

    const newBulkOrder: BulkOrder = {
      bulkOrderNo,
      labAppNo,
      customer: lab.customer,
      colorName: lab.colorName,
      colorHex: lab.colorHex,
      fabric: lab.fabric,
      orderQtyKg: orderData.orderQtyKg,
      orderDate: '2026-09-09',
      requiredDeliveryDate: orderData.requiredDeliveryDate,
      productionStatus: 'Queued',
      deliveryStatus: 'Pending',
      currentStage: 'Production',
      yarnLotNo: orderData.yarnLotNo,
      gsm: orderData.gsm,
      diaInches: orderData.diaInches,
      poReference: `PO-${lab.customer.slice(0, 3).toUpperCase()}-2026-${nextOrderNum}`,
      specialInstructions: orderData.specialInstructions
    };

    // Update link in lab approval
    setLabApprovals(prev => prev.map(l => l.labAppNo === labAppNo ? { ...l, linkedBulkOrderNo: bulkOrderNo } : l));
    
    // Add bulk order
    setBulkOrders(prev => [newBulkOrder, ...prev]);

    // Create corresponding production batch
    const newBatch: ProductionBatch = {
      batchId: `PRD-${lab.runningNo}-01`,
      bulkOrderNo,
      labAppNo,
      customer: lab.customer,
      colorName: lab.colorName,
      colorHex: lab.colorHex,
      fabric: lab.fabric,
      quantityKg: orderData.orderQtyKg,
      machineVessel: 'Softflow Vessel 02 (1500 KG)',
      stage: 'Queued',
      progressPct: 0,
      expectedCompletion: orderData.requiredDeliveryDate,
      operatorName: 'S. Shanmugam',
      qcNotes: 'Batch ticket generated from Lab RC recipe standard.'
    };

    setProductionBatches(prev => [newBatch, ...prev]);

    addToast({
      type: 'success',
      title: 'Bulk Order Created & Linked',
      message: `Generated Bulk Order ${bulkOrderNo} (${orderData.orderQtyKg.toLocaleString()} KG) connected to Lab Ref ${labAppNo}.`
    });

    return bulkOrderNo;
  };

  const advanceProductionStage = (batchId: string, nextStage: ProductionStatus, qcNotes?: string) => {
    setProductionBatches(prev => prev.map(batch => {
      if (batch.batchId === batchId) {
        const isNowCompleted = nextStage === 'Completed';
        const updatedBatch = {
          ...batch,
          stage: nextStage,
          progressPct: nextStage === 'Queued' ? 0 : nextStage === 'Dyeing' ? 50 : nextStage === 'QC' ? 85 : 100,
          qcNotes: qcNotes || batch.qcNotes,
          qcPassed: isNowCompleted ? true : batch.qcPassed,
          actualCompletion: isNowCompleted ? '2026-09-09 17:00' : batch.actualCompletion
        };

        // Also update corresponding Bulk Order production & delivery status
        setBulkOrders(bOrders => bOrders.map(bo => {
          if (bo.bulkOrderNo === batch.bulkOrderNo) {
            return {
              ...bo,
              productionStatus: nextStage,
              deliveryStatus: isNowCompleted ? 'Ready for Delivery' : bo.deliveryStatus,
              currentStage: isNowCompleted ? 'Delivery' : 'Production'
            };
          }
          return bo;
        }));

        // If completed, ensure Delivery Record exists
        if (isNowCompleted) {
          setDeliveryRecords(delRecords => {
            const exists = delRecords.find(d => d.bulkOrderNo === batch.bulkOrderNo);
            if (!exists) {
              const newDel: DeliveryRecord = {
                deliveryId: `DEL-2026-${String(delRecords.length + 80).padStart(3, '0')}`,
                bulkOrderNo: batch.bulkOrderNo,
                labAppNo: batch.labAppNo,
                customer: batch.customer,
                colorName: batch.colorName,
                colorHex: batch.colorHex,
                quantityKg: batch.quantityKg,
                rollsCount: Math.ceil(batch.quantityKg / 22),
                vehicleNo: 'Pending Assignment',
                driverName: 'Unassigned',
                driverPhone: '-',
                dispatchDate: '2026-09-10',
                expectedDelivery: '2026-09-11',
                deliveryStatus: 'Ready for Delivery',
                eWayBillNo: 'Pending Generation',
                remarks: 'Batch passed shade delta & dimensional stability tests. Packed in dispatch warehouse.'
              };
              return [newDel, ...delRecords];
            } else {
              return delRecords.map(d => d.bulkOrderNo === batch.bulkOrderNo ? { ...d, deliveryStatus: 'Ready for Delivery' } : d);
            }
          });
        }

        return updatedBatch;
      }
      return batch;
    }));

    addToast({
      type: 'info',
      title: 'Production Stage Advanced',
      message: `Batch ${batchId} moved to "${nextStage}".`
    });
  };

  const dispatchDelivery = (
    deliveryId: string, 
    vehicleNo: string, 
    driverName: string, 
    driverPhone: string, 
    eWayBillNo: string
  ) => {
    setDeliveryRecords(prev => prev.map(del => {
      if (del.deliveryId === deliveryId) {
        const updated = {
          ...del,
          vehicleNo,
          driverName,
          driverPhone,
          eWayBillNo,
          deliveryStatus: 'Dispatched' as DeliveryStatus,
          dispatchDate: '2026-09-09'
        };

        // Update bulk order
        setBulkOrders(bOrders => bOrders.map(bo => {
          if (bo.bulkOrderNo === del.bulkOrderNo) {
            return {
              ...bo,
              deliveryStatus: 'Dispatched'
            };
          }
          return bo;
        }));

        return updated;
      }
      return del;
    }));

    addToast({
      type: 'success',
      title: 'Consignment Dispatched',
      message: `Delivery ${deliveryId} dispatched on Vehicle ${vehicleNo}. E-Way Bill: ${eWayBillNo}.`
    });
  };

  const recordProofOfDelivery = (deliveryId: string, receiverName: string, remarks?: string) => {
    const timestamp = '2026-09-09 16:45';
    setDeliveryRecords(prev => prev.map(del => {
      if (del.deliveryId === deliveryId) {
        const updated = {
          ...del,
          deliveryStatus: 'Delivered' as DeliveryStatus,
          actualDelivery: timestamp,
          receiverName,
          deliveredDateTime: timestamp,
          remarks: remarks || del.remarks
        };

        // Update bulk order
        setBulkOrders(bOrders => bOrders.map(bo => {
          if (bo.bulkOrderNo === del.bulkOrderNo) {
            return {
              ...bo,
              deliveryStatus: 'Delivered',
              currentStage: 'Delivered'
            };
          }
          return bo;
        }));

        return updated;
      }
      return del;
    }));

    addToast({
      type: 'success',
      title: 'Proof of Delivery (POD) Logged',
      message: `Consignment signed by ${receiverName}. Order lifecycle completed.`
    });
  };

  const value = useMemo(() => ({
    activeTab,
    setActiveTab,
    labApprovals,
    bulkOrders,
    productionBatches,
    deliveryRecords,
    selectedLabAppNo,
    setSelectedLabAppNo,
    selectedBulkOrderNo,
    setSelectedBulkOrderNo,
    traceQuery,
    setTraceQuery,
    isTraceModalOpen,
    setIsTraceModalOpen,
    openTraceFor,
    globalSearch,
    setGlobalSearch,
    selectedCustomerFilter,
    setSelectedCustomerFilter,
    selectedDateRange,
    setSelectedDateRange,
    toasts,
    addToast,
    removeToast,
    updateLabApprovalStatus,
    createLabApproval,
    createBulkOrderFromLab,
    advanceProductionStage,
    dispatchDelivery,
    recordProofOfDelivery,
    lastSyncTime,
    syncWithErp,
    isSyncing
  }), [
    activeTab,
    labApprovals,
    bulkOrders,
    productionBatches,
    deliveryRecords,
    selectedLabAppNo,
    selectedBulkOrderNo,
    traceQuery,
    isTraceModalOpen,
    globalSearch,
    selectedCustomerFilter,
    selectedDateRange,
    toasts,
    lastSyncTime,
    isSyncing
  ]);

  return (
    <DyeFlowContext.Provider value={value}>
      {children}
    </DyeFlowContext.Provider>
  );
};

export const useDyeFlow = () => {
  const context = useContext(DyeFlowContext);
  if (!context) {
    throw new Error('useDyeFlow must be used within a DyeFlowProvider');
  }
  return context;
};
