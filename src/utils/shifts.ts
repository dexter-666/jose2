import { ShiftCode, ShiftOption } from '../types/stock';

export const SHIFT_OPTIONS: readonly ShiftOption[] = [
  { code: '07:00', label: 'Turno Mañana · 7:00 AM', schedule: '07:00 – 15:00' },
  { code: '15:00', label: 'Turno Tarde · 3:00 PM', schedule: '15:00 – 23:00' },
  { code: '23:00', label: 'Turno Noche · 11:00 PM', schedule: '23:00 – 07:00' },
] as const;

export function detectCurrentShift(date: Date = new Date()): ShiftCode {
  const hour = date.getHours();
  if (hour >= 7 && hour < 15) return '07:00';
  if (hour >= 15 && hour < 23) return '15:00';
  return '23:00';
}

export function getShiftOption(code: ShiftCode): ShiftOption {
  return SHIFT_OPTIONS.find((s) => s.code === code) ?? SHIFT_OPTIONS[0];
}

export function formatTime12h(input: Date | string | null): string {
  if (!input) return 'Pendiente';
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return 'Pendiente';
  const hours24 = date.getHours();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const hh = String(hours12).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss} ${period}`;
}

export function formatTimeShort(isoString: string | null): string {
  return formatTime12h(isoString);
}

export function formatDateTimeCompact(isoString: string | null): string {
  if (!isoString) return 'Sin registro';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Sin registro';
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

