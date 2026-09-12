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

/** For native <input type="date"> value/onChange, which use "YYYY-MM-DD". */
export function toInputDateValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromInputDateValue(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isDateWithinRange(dateStr: string, start: Date, end: Date): boolean {
  const date = parseDisplayDate(dateStr).getTime();
  const startOfDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999).getTime();
  return date >= startOfDay && date <= endOfDay;
}

export function parseQtyKg(qty?: string): number {
  if (!qty) return 0;
  const digits = qty.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}
