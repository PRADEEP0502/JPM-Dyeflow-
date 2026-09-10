import React, { createContext, useContext, useState, useMemo } from 'react';
import { LdnRecord, ErpBulkOrder, DashboardMetrics, ActivePage } from '../types';
import { METRICS, INITIAL_LDN_RECORDS, INITIAL_ERP_ORDERS } from '../data/mockData';

interface DyeFlowContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  ldnRecords: LdnRecord[];
  erpOrders: ErpBulkOrder[];
  metrics: DashboardMetrics;
  
  // Search & Filters
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  customerFilter: string;
  setCustomerFilter: (c: string) => void;
  
  // Detail Modal
  selectedLdn: LdnRecord | null;
  setSelectedLdn: (ldn: LdnRecord | null) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  openDetailFor: (query: string) => void;
  
  // Sync
  lastSyncTime: string;
  isSyncing: boolean;
  triggerSync: () => void;
}

const DyeFlowContext = createContext<DyeFlowContextType | undefined>(undefined);

export const DyeFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [ldnRecords, setLdnRecords] = useState<LdnRecord[]>(INITIAL_LDN_RECORDS);
  const [erpOrders, setErpOrders] = useState<ErpBulkOrder[]>(INITIAL_ERP_ORDERS);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [customerFilter, setCustomerFilter] = useState<string>('ALL');
  
  const [selectedLdn, setSelectedLdn] = useState<LdnRecord | null>(INITIAL_LDN_RECORDS[0]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  
  const [lastSyncTime, setLastSyncTime] = useState<string>('Today at 05:30 PM (Selsoft ERP v4.2)');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const openDetailFor = (query: string) => {
    const q = query.toLowerCase().trim();
    const found = ldnRecords.find(l => 
      l.ldnNo.toLowerCase() === q ||
      l.lrnNo.toLowerCase() === q ||
      l.labAppNo.toLowerCase().includes(q) ||
      l.bulkOrderNo?.toLowerCase() === q ||
      l.customer.toLowerCase().includes(q)
    ) || ldnRecords[0];
    
    setSelectedLdn(found);
    setIsDetailModalOpen(true);
  };

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSyncTime(`Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Selsoft ERP v4.2)`);
    }, 1000);
  };

  const metrics: DashboardMetrics = useMemo(() => {
    const totalDelivered = 100; // Total LDN baseline
    const foundCount = 63; // Found in ERP
    const pendingCount = 37; // Pending in ERP
    const totalKg = 125000; // 125,000 KG
    const percentage = 63; // 63%

    return {
      totalLdnDelivered: totalDelivered,
      bulkOrdersFound: foundCount,
      bulkOrdersPending: pendingCount,
      totalBulkQuantityKg: totalKg,
      conversionPercentage: percentage
    };
  }, []);

  const value = useMemo(() => ({
    activePage,
    setActivePage,
    ldnRecords,
    erpOrders,
    metrics,
    globalSearch,
    setGlobalSearch,
    customerFilter,
    setCustomerFilter,
    selectedLdn,
    setSelectedLdn,
    isDetailModalOpen,
    setIsDetailModalOpen,
    openDetailFor,
    lastSyncTime,
    isSyncing,
    triggerSync
  }), [
    activePage,
    ldnRecords,
    erpOrders,
    metrics,
    globalSearch,
    customerFilter,
    selectedLdn,
    isDetailModalOpen,
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
