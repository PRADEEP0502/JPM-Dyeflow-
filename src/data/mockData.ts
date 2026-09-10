import { LdnItem } from '../types';

export const SUMMARY_NUMBERS = {
  ldnDelivered: 100,
  bulkOrderFound: 63,
  waitingForBulk: 37
};

export const LDN_DATA: LdnItem[] = [
  {
    ldnNo: 'LDN-10293',
    lrnNo: 'LRN-23',
    labAppNo: '16321 (8157-26/A)',
    customer: 'Coral Knit Wear',
    colorName: '13-2807 TX',
    colorHex: '#d9534f',
    fabric: 'Viscose',
    deliveredDate: '08 Sep 2026',
    daysWaiting: 2,
    bulkOrderNo: 'BO-2026-001',
    bulkQty: '2,000 KG',
    result: 'Bulk Order Found'
  },
  {
    ldnNo: 'LDN-10294',
    lrnNo: 'LRN-24',
    labAppNo: '16322 (8158-26/A)',
    customer: 'Zeal Creation',
    colorName: 'Brown',
    colorHex: '#6d4c41',
    fabric: 'Cotton',
    deliveredDate: '08 Sep 2026',
    daysWaiting: 2,
    result: 'Waiting'
  },
  {
    ldnNo: 'LDN-10295',
    lrnNo: 'LRN-25',
    labAppNo: '16323 (8159-26/B)',
    customer: 'Coral Knit Wear',
    colorName: 'Chilli',
    colorHex: '#c62828',
    fabric: 'Loopknit',
    deliveredDate: '06 Sep 2026',
    daysWaiting: 4,
    bulkOrderNo: 'BO-2026-002',
    bulkQty: '3,500 KG',
    result: 'Bulk Order Found'
  },
  {
    ldnNo: 'LDN-10296',
    lrnNo: 'LRN-26',
    labAppNo: '16324 (8160-26/A)',
    customer: 'Sivanesh Trends',
    colorName: 'Black',
    colorHex: '#1e1e24',
    fabric: 'Single Jersey',
    deliveredDate: '05 Sep 2026',
    daysWaiting: 5,
    bulkOrderNo: 'BO-2026-003',
    bulkQty: '5,000 KG',
    result: 'Bulk Order Found'
  },
  {
    ldnNo: 'LDN-10297',
    lrnNo: 'LRN-27',
    labAppNo: '16325 (8161-26/C)',
    customer: 'Vaarahi Exports',
    colorName: 'Navy',
    colorHex: '#1a237e',
    fabric: 'Pique Polo',
    deliveredDate: '04 Sep 2026',
    daysWaiting: 6,
    result: 'Waiting'
  },
  {
    ldnNo: 'LDN-10298',
    lrnNo: 'LRN-28',
    labAppNo: '16326 (8162-26/A)',
    customer: 'Majestic Clothing',
    colorName: 'Maroon',
    colorHex: '#4a148c',
    fabric: 'French Terry',
    deliveredDate: '03 Sep 2026',
    daysWaiting: 7,
    bulkOrderNo: 'BO-2026-004',
    bulkQty: '1,200 KG',
    result: 'Bulk Order Found'
  },
  {
    ldnNo: 'LDN-10299',
    lrnNo: 'LRN-29',
    labAppNo: '16327 (8163-26/A)',
    customer: 'Zeal Creation',
    colorName: 'Maroon',
    colorHex: '#581825',
    fabric: 'Interlock',
    deliveredDate: '02 Sep 2026',
    daysWaiting: 8,
    result: 'Waiting'
  },
  {
    ldnNo: 'LDN-10300',
    lrnNo: 'LRN-30',
    labAppNo: '16328 (8164-26/A)',
    customer: 'Sivanesh Trends',
    colorName: 'Royal Blue',
    colorHex: '#1565c0',
    fabric: 'Loopknit',
    deliveredDate: '01 Sep 2026',
    daysWaiting: 9,
    bulkOrderNo: 'BO-2026-005',
    bulkQty: '7,500 KG',
    result: 'Bulk Order Found'
  }
];
