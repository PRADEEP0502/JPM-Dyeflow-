/**
 * JPM's actual lab-colour numbering convention: the LDN number itself encodes
 * the colour band it belongs to. Transcribed directly from the mill's
 * physical "JPM COLOURS" reference chart.
 */
export interface ColourBand {
  serial: number;
  name: string;
  ldnFrom: number;
  ldnTo: number;
  hex: string;
}

export const JPM_COLOUR_CHART: ColourBand[] = [
  { serial: 1, name: 'Pink', ldnFrom: 1, ldnTo: 999, hex: '#ec4899' },
  { serial: 2, name: 'Lt. Blue', ldnFrom: 1000, ldnTo: 1999, hex: '#7dd3fc' },
  { serial: 3, name: 'Navy', ldnFrom: 2000, ldnTo: 2999, hex: '#1e3a5f' },
  { serial: 4, name: 'Red', ldnFrom: 3000, ldnTo: 3999, hex: '#dc2626' },
  { serial: 5, name: 'Yellow', ldnFrom: 4000, ldnTo: 4999, hex: '#eab308' },
  { serial: 6, name: 'Grey', ldnFrom: 5000, ldnTo: 5999, hex: '#6b7280' },
  { serial: 7, name: 'Lilac', ldnFrom: 6000, ldnTo: 6999, hex: '#c4b5fd' },
  { serial: 8, name: 'Beige', ldnFrom: 7000, ldnTo: 7999, hex: '#d7c9a7' },
  { serial: 9, name: 'Orange', ldnFrom: 8000, ldnTo: 8999, hex: '#f97316' },
  { serial: 10, name: 'Olive', ldnFrom: 9000, ldnTo: 9999, hex: '#556b2f' },
  { serial: 11, name: 'Green', ldnFrom: 10000, ldnTo: 10999, hex: '#16a34a' },
  { serial: 12, name: 'Turquoise', ldnFrom: 11000, ldnTo: 11999, hex: '#14b8a6' },
  { serial: 13, name: 'Royal', ldnFrom: 12000, ldnTo: 12999, hex: '#1d4ed8' },
  { serial: 14, name: 'Brown', ldnFrom: 13000, ldnTo: 13999, hex: '#6d4c41' },
  { serial: 15, name: 'Purple', ldnFrom: 14000, ldnTo: 14999, hex: '#7e22ce' },
  { serial: 16, name: 'Black', ldnFrom: 15000, ldnTo: 15999, hex: '#1e1e24' },
];

/** Looks up the official JPM colour band for a given LDN number, per the mill's numbering chart. */
export function resolveColourByLdnNumber(ldnNumber: number): ColourBand | undefined {
  return JPM_COLOUR_CHART.find((band) => ldnNumber >= band.ldnFrom && ldnNumber <= band.ldnTo);
}
