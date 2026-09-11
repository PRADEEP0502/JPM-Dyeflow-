const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDisplayDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  return `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function parseDisplayDate(dateStr: string): Date {
  const [day, mon, year] = dateStr.split(' ');
  return new Date(Number(year), MONTHS.indexOf(mon), Number(day));
}

export function daysBetween(from: Date, to: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

export function parseQtyKg(qty?: string): number {
  if (!qty) return 0;
  const digits = qty.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}
