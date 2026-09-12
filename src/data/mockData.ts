import { LdnItem, LrnRecord } from '../types';
import { formatDisplayDate } from '../utils/format';
import { JPM_COLOUR_CHART, resolveColourByLdnNumber } from './jpmColourChart';

/**
 * Fixed reference date the demo dataset is anchored to, so "days elapsed"
 * figures stay reproducible regardless of the real current date.
 */
export const DATA_AS_OF = new Date(2026, 8, 8); // 08 Sep 2026

interface RawLdnRecord {
  customer: string;
  fabric: string;
  /** Days before DATA_AS_OF the sample was delivered to the customer. */
  offsetDays: number;
  /** Present only once a bulk order has actually been placed in ERP. */
  bulkQtyKg?: number;
}

const RAW_RECORDS: RawLdnRecord[] = [
  { customer: 'Coral Knit Wear', fabric: 'Viscose', offsetDays: 1 },
  { customer: 'Zeal Creation', fabric: 'Cotton', offsetDays: 1 },
  { customer: 'Sivanesh Trends', fabric: 'Single Jersey', offsetDays: 2 },
  { customer: 'Vaarahi Exports', fabric: 'Pique Polo', offsetDays: 2 },
  { customer: 'Majestic Clothing', fabric: 'French Terry', offsetDays: 3, bulkQtyKg: 1800 },
  { customer: 'Orbit Apparels', fabric: 'Loopknit', offsetDays: 3 },
  { customer: 'Kavin Textiles', fabric: 'Interlock', offsetDays: 4 },
  { customer: 'Coral Knit Wear', fabric: 'Rib Knit', offsetDays: 4, bulkQtyKg: 2200 },
  { customer: 'Zeal Creation', fabric: 'Terry Cotton', offsetDays: 5 },
  { customer: 'Sivanesh Trends', fabric: 'Modal Blend', offsetDays: 5, bulkQtyKg: 3100 },
  { customer: 'Vaarahi Exports', fabric: 'Viscose', offsetDays: 6 },
  { customer: 'Majestic Clothing', fabric: 'Cotton', offsetDays: 6, bulkQtyKg: 1500 },
  { customer: 'Orbit Apparels', fabric: 'Single Jersey', offsetDays: 7, bulkQtyKg: 4200 },
  { customer: 'Kavin Textiles', fabric: 'Pique Polo', offsetDays: 7 },
  { customer: 'Coral Knit Wear', fabric: 'French Terry', offsetDays: 8, bulkQtyKg: 2600 },
  { customer: 'Zeal Creation', fabric: 'Loopknit', offsetDays: 8, bulkQtyKg: 3300 },
  { customer: 'Sivanesh Trends', fabric: 'Interlock', offsetDays: 9, bulkQtyKg: 5000 },
  { customer: 'Vaarahi Exports', fabric: 'Rib Knit', offsetDays: 9 },
  { customer: 'Majestic Clothing', fabric: 'Terry Cotton', offsetDays: 10, bulkQtyKg: 1200 },
  { customer: 'Orbit Apparels', fabric: 'Modal Blend', offsetDays: 10, bulkQtyKg: 2800 },
  { customer: 'Kavin Textiles', fabric: 'Viscose', offsetDays: 11 },
  { customer: 'Coral Knit Wear', fabric: 'Cotton', offsetDays: 11, bulkQtyKg: 3500 },
  { customer: 'Zeal Creation', fabric: 'Single Jersey', offsetDays: 12, bulkQtyKg: 4700 },
  { customer: 'Sivanesh Trends', fabric: 'Pique Polo', offsetDays: 12, bulkQtyKg: 1900 },
  { customer: 'Vaarahi Exports', fabric: 'French Terry', offsetDays: 13 },
  { customer: 'Majestic Clothing', fabric: 'Loopknit', offsetDays: 13, bulkQtyKg: 2400 },
  { customer: 'Orbit Apparels', fabric: 'Interlock', offsetDays: 14, bulkQtyKg: 6000 },
  { customer: 'Kavin Textiles', fabric: 'Rib Knit', offsetDays: 14 },
  { customer: 'Coral Knit Wear', fabric: 'Terry Cotton', offsetDays: 15, bulkQtyKg: 2100 },
  { customer: 'Zeal Creation', fabric: 'Modal Blend', offsetDays: 16, bulkQtyKg: 3900 },
  { customer: 'Sivanesh Trends', fabric: 'Viscose', offsetDays: 17 },
  { customer: 'Vaarahi Exports', fabric: 'Cotton', offsetDays: 18, bulkQtyKg: 2700 },
  { customer: 'Majestic Clothing', fabric: 'Single Jersey', offsetDays: 19, bulkQtyKg: 3300 },
  { customer: 'Orbit Apparels', fabric: 'Pique Polo', offsetDays: 21 },
  { customer: 'Kavin Textiles', fabric: 'French Terry', offsetDays: 23, bulkQtyKg: 1600 },
  { customer: 'Coral Knit Wear', fabric: 'Loopknit', offsetDays: 26 },
];

const CONTACTS = ['R. Senthil', 'K. Meena', 'A. Bala', 'S. Devi', 'M. Raja', 'P. Latha', 'V. Kumar'];
const BUYERS = ['Zara Textiles Intl', 'H&M Sourcing', 'Decathlon Apparel', 'Marks & Spencer', 'Uniqlo Group', 'C&A Sourcing', 'Next Retail'];
const MATCH_SOURCES = ['Customer Swatch', 'Pantone Reference', 'Previous Bulk Match', 'Digital Lab Dip'];
const PARTY_GROUPS = ['Direct Export', 'Merchant Export', 'Domestic Buying'];
const REMARKS = [
  'As per approved swatch',
  'Match to previous bulk lot',
  'Urgent - buyer follow-up',
  'Standard shade band tolerance',
  '',
];
/** Lab processing lead time (days) from LRN receipt to LDN delivery. */
const LAB_PROCESSING_DAYS = [2, 3, 3, 4, 5];
/** Days after LDN delivery that a converted sample's bulk order got logged in ERP. */
const CONVERSION_LAG_DAYS = [1, 2, 3, 2, 4];

/**
 * Assigns each record an LDN number that actually falls inside one of JPM's
 * official colour bands, cycling through all 16 bands for variety, so the
 * sample's colour can be resolved from its LDN number the same way it is
 * on the real Selsoft floor sheet — rather than being a free-typed label.
 */
function assignLdnNumber(index: number): number {
  const band = JPM_COLOUR_CHART[index % JPM_COLOUR_CHART.length];
  const spread = band.ldnTo - band.ldnFrom; // 998 for band 1, 999 for the rest
  const offset = (index * 53) % (spread - 100); // stay clear of the band's upper edge
  return band.ldnFrom + offset;
}

function buildData(records: RawLdnRecord[]): { ldnData: LdnItem[]; lrnData: LrnRecord[] } {
  let bulkSeq = 0;
  const ldnData: LdnItem[] = [];
  const lrnData: LrnRecord[] = [];

  records.forEach((record, index) => {
    const delivered = new Date(DATA_AS_OF);
    delivered.setDate(delivered.getDate() - record.offsetDays);

    const leadDays = LAB_PROCESSING_DAYS[index % LAB_PROCESSING_DAYS.length];
    const received = new Date(delivered);
    received.setDate(received.getDate() - leadDays);

    const suffixLetter = ['A', 'B', 'C'][index % 3];
    const hasBulkOrder = record.bulkQtyKg !== undefined;
    if (hasBulkOrder) bulkSeq += 1;

    const lrnNo = `LRN-${23 + index}`;
    const ldnNumber = assignLdnNumber(index);
    const ldnNo = `LDN-${String(ldnNumber).padStart(5, '0')}`;
    const colourBand = resolveColourByLdnNumber(ldnNumber);
    const colorName = colourBand?.name ?? 'Unassigned';
    const colorHex = colourBand?.hex;

    let bulkOrderDate: string | undefined;
    if (hasBulkOrder) {
      const conversionLag = Math.min(CONVERSION_LAG_DAYS[index % CONVERSION_LAG_DAYS.length], record.offsetDays);
      const converted = new Date(delivered);
      converted.setDate(converted.getDate() + conversionLag);
      bulkOrderDate = formatDisplayDate(converted);
    }

    ldnData.push({
      ldnNo,
      lrnNo,
      labAppNo: `${16321 + index} (${8157 + index}-26/${suffixLetter})`,
      customer: record.customer,
      colorName,
      colorHex,
      fabric: record.fabric,
      deliveredDate: formatDisplayDate(delivered),
      daysWaiting: record.offsetDays,
      bulkOrderNo: hasBulkOrder ? `BO-2026-${String(bulkSeq).padStart(3, '0')}` : undefined,
      bulkQty: hasBulkOrder ? `${record.bulkQtyKg!.toLocaleString('en-IN')} KG` : undefined,
      bulkOrderDate,
      result: hasBulkOrder ? 'Bulk Order Found' : 'Waiting',
    });

    const contactNoBase = 9840000000 + index * 137;

    lrnData.push({
      lrnNo,
      date: formatDisplayDate(received),
      party: record.customer,
      contact: CONTACTS[index % CONTACTS.length],
      buyer: BUYERS[index % BUYERS.length],
      fabric: record.fabric,
      markNo: `MK-${100 + index}`,
      remarks: REMARKS[index % REMARKS.length],
      expectedDeliveryDate: formatDisplayDate(delivered),
      partyGroup: PARTY_GROUPS[index % PARTY_GROUPS.length],
      contactNo: `+91 ${contactNoBase}`,
      orderNo: `ORD-2026-${String(index + 1).padStart(3, '0')}`,
      colour: colorName,
      matchSource: MATCH_SOURCES[index % MATCH_SOURCES.length],
      mlr: `MLR-${8000 + index}`,
    });
  });

  return { ldnData, lrnData };
}

const { ldnData, lrnData } = buildData(RAW_RECORDS);

export const LDN_DATA: LdnItem[] = ldnData;
export const LRN_DATA: LrnRecord[] = lrnData;
