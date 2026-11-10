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

export function formatTimeShort(isoString: string | null): string {
  if (!isoString) return 'Pendiente';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Pendiente';
  return date.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
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

