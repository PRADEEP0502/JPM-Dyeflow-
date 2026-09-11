/**
 * Restrained categorical palette for per-customer / per-series charts.
 * Kept separate from the semantic Converted=emerald / Pending=amber colors
 * used elsewhere (StatusBadge, filters) so that meaning isn't overloaded.
 */
export interface PaletteColor {
  bar: string; // solid bg class for bars/dots
  text: string; // matching text class
  soft: string; // light bg tint for badges/backgrounds
}

export const CATEGORY_PALETTE: PaletteColor[] = [
  { bar: 'bg-blue-500', text: 'text-blue-700', soft: 'bg-blue-50' },
  { bar: 'bg-emerald-500', text: 'text-emerald-700', soft: 'bg-emerald-50' },
  { bar: 'bg-teal-500', text: 'text-teal-700', soft: 'bg-teal-50' },
  { bar: 'bg-rose-500', text: 'text-rose-700', soft: 'bg-rose-50' },
  { bar: 'bg-orange-500', text: 'text-orange-700', soft: 'bg-orange-50' },
  { bar: 'bg-violet-500', text: 'text-violet-700', soft: 'bg-violet-50' },
  { bar: 'bg-cyan-500', text: 'text-cyan-700', soft: 'bg-cyan-50' },
];

export function paletteFor(index: number): PaletteColor {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
}
