import { MeasureItem, WarehouseDefinition, WarehouseStockMap } from '../types/stock';

/**
 * Exact 4 fixed columns required by specification (non-editable).
 */
export const WAREHOUSES: readonly WarehouseDefinition[] = [
  {
    id: 'PT_08',
    label: 'PT 08',
    zone: 'Almacén Producto Terminado 08',
    accent: 'blue',
  },
  {
    id: 'PT_09',
    label: 'PT 09',
    zone: 'Almacén Producto Terminado 09',
    accent: 'red',
  },
  {
    id: 'PT_15_BAHIA',
    label: 'PT 15 - BAHIA',
    zone: 'Almacén PT 15 · Bahía',
    accent: 'blue',
  },
  {
    id: 'PT_15_CURVA',
    label: 'PT 15 - CURVA',
    zone: 'Almacén PT 15 · Curva',
    accent: 'red',
  },
] as const;

const RAW_INITIAL_MEASURES: readonly string[] = [
  '6 mm',
  '8 mm',
  '3/8" x 9 m',
  '3/8" x 12 m',
  '12 mm',
  '1/2" x 9 m',
  '1/2" x 12 m',
  '5/8" x 9 m',
  '5/8" x 12 m',
  '3/4" x 9 m',
  '3/4" x 12 m',
  '1" x 9 m',
  '1" x 12 m',
];

const INCH_TO_MM = 25.4;

/**
 * Parses steel bar dimensions from a label into millimeter diameter and meter length
 * so measures can always be sorted strictly from thin to thick.
 */
export function parseMeasureMetrics(label: string): {
  diameterMm: number;
  lengthM: number;
  parsed: boolean;
} {
  const cleaned = label.trim().replace(/×/g, 'x').replace(/[“”]/g, '"');

  // Split around 'x' if present: e.g. '3/8" x 9 m' -> left='3/8"', right='9 m'
  const parts = cleaned.split(/\s*x\s*/i);
  const diameterPart = parts[0]?.trim() ?? '';
  const lengthPart = parts[1]?.trim() ?? '';

  let diameterMm = Number.MAX_SAFE_INTEGER;
  let parsed = false;

  // 1) Metric mm: "6 mm", "8mm", "12.5 mm"
  const mmMatch = diameterPart.match(/^(\d+(?:[.,]\d+)?)\s*mm$/i);
  if (mmMatch) {
    diameterMm = parseFloat(mmMatch[1].replace(',', '.'));
    parsed = true;
  } else {
    // 2) Mixed fraction inches: '1 3/8"' or '1-3/8'
    const mixedMatch = diameterPart.match(/^(\d+)\s*[-\s]\s*(\d+)\s*\/\s*(\d+)\s*"?$/);
    if (mixedMatch) {
      const whole = parseFloat(mixedMatch[1]);
      const num = parseFloat(mixedMatch[2]);
      const den = parseFloat(mixedMatch[3]);
      if (den > 0) {
        diameterMm = (whole + num / den) * INCH_TO_MM;
        parsed = true;
      }
    } else {
      // 3) Fractional inches: '3/8"', '1/2"', '3/8'
      const fracMatch = diameterPart.match(/^(\d+)\s*\/\s*(\d+)\s*"?$/);
      if (fracMatch) {
        const num = parseFloat(fracMatch[1]);
        const den = parseFloat(fracMatch[2]);
        if (den > 0) {
          diameterMm = (num / den) * INCH_TO_MM;
          parsed = true;
        }
      } else {
        // 4) Whole inches: '1"', '2"', or plain number when length exists like '1 x 9 m'
        const wholeInchMatch = diameterPart.match(/^(\d+(?:[.,]\d+)?)\s*"$/);
        if (wholeInchMatch) {
          diameterMm = parseFloat(wholeInchMatch[1].replace(',', '.')) * INCH_TO_MM;
          parsed = true;
        } else if (parts.length > 1) {
          const plainInchMatch = diameterPart.match(/^(\d+(?:[.,]\d+)?)$/);
          if (plainInchMatch) {
            diameterMm = parseFloat(plainInchMatch[1].replace(',', '.')) * INCH_TO_MM;
            parsed = true;
          }
        }
      }
    }
  }

  let lengthM = 0;
  if (lengthPart) {
    const lenMatch = lengthPart.match(/(\d+(?:[.,]\d+)?)/);
    if (lenMatch) {
      lengthM = parseFloat(lenMatch[1].replace(',', '.'));
    }
  }

  return {
    diameterMm: Number(diameterMm.toFixed(4)),
    lengthM,
    parsed,
  };
}

export function createMeasureId(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/"/g, 'in')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function buildMeasureItem(
  label: string,
  options?: { isCustom?: boolean; overrideDiameterMm?: number; overrideLengthM?: number }
): MeasureItem {
  const normalizedLabel = label.trim().replace(/\s+/g, ' ');
  const parsed = parseMeasureMetrics(normalizedLabel);
  return {
    id: createMeasureId(normalizedLabel),
    label: normalizedLabel,
    diameterMm: options?.overrideDiameterMm ?? parsed.diameterMm,
    lengthM: options?.overrideLengthM ?? parsed.lengthM,
    isCustom: options?.isCustom ?? false,
  };
}

/**
 * Strict comparator: thin to thick (diameterMm ASC, then lengthM ASC, then natural label).
 */
export function compareMeasures(a: MeasureItem, b: MeasureItem): number {
  const diffDiameter = a.diameterMm - b.diameterMm;
  if (Math.abs(diffDiameter) > 1e-4) {
    return diffDiameter;
  }
  const diffLength = a.lengthM - b.lengthM;
  if (Math.abs(diffLength) > 1e-4) {
    return diffLength;
  }
  return a.label.localeCompare(b.label, 'es', { numeric: true });
}

export function sortCatalogMeasures(measures: MeasureItem[]): MeasureItem[] {
  return [...measures].sort(compareMeasures);
}

export function sortMeasureIdsByCatalog(
  measureIds: string[],
  catalogMap: Map<string, MeasureItem>
): string[] {
  const uniqueIds = Array.from(new Set(measureIds)).filter((id) => catalogMap.has(id));
  return uniqueIds.sort((idA, idB) => {
    const a = catalogMap.get(idA)!;
    const b = catalogMap.get(idB)!;
    return compareMeasures(a, b);
  });
}

export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/×/g, 'x')
    .replace(/\s*x\s*/g, ' x ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Flexible matcher so SAP picking queries like "1/2 x 9", "1/2x9", "12mm", "3/8 12"
 * accurately match "1/2\" x 9 m", "12 mm", "3/8\" x 12 m" without false positives.
 */
export function matchesMeasureQuery(measureLabel: string, rawQuery: string): boolean {
  const query = normalizeSearchText(rawQuery);
  if (!query) return true;

  const target = normalizeSearchText(measureLabel);
  const compactTarget = target.replace(/\s+/g, '');
  const compactQuery = query.replace(/\s+/g, '');

  // Direct substring or spaceless substring match (e.g., "1/2 x 9" -> "1/2x9" inside "1/2x9m")
  if (target.includes(query) || compactTarget.includes(compactQuery)) {
    return true;
  }

  // Token-based match (ignoring standalone 'x') so "1/2 9" matches "1/2 x 9 m"
  const targetTokens = target.split(' ').filter((t) => t !== 'x');
  const queryTokens = query.split(' ').filter((t) => t !== 'x');
  if (queryTokens.length === 0) return true;

  return queryTokens.every((qToken) => {
    const qNoUnit = qToken.replace(/(mm|m)$/i, '');
    return targetTokens.some((tToken) => {
      if (tToken === qToken || tToken.startsWith(qToken)) return true;
      // Avoid matching "12mm" against "12" + "m" on a bar length unless units match
      if (qToken.endsWith('mm')) {
        return targetTokens.join('').includes(qToken);
      }
      return qNoUnit.length > 0 && tToken.includes(qNoUnit) && !qToken.endsWith('m');
    });
  });
}

/**
 * Visual gauge level (1..6) to subtly convey thin-to-thick scale in UI badges.
 */
export function getThicknessTier(diameterMm: number): 1 | 2 | 3 | 4 | 5 | 6 {
  if (diameterMm <= 8.5) return 1;
  if (diameterMm <= 12.2) return 2;
  if (diameterMm <= 14) return 3;
  if (diameterMm <= 17) return 4;
  if (diameterMm <= 21) return 5;
  return 6;
}

export const INITIAL_CATALOG: MeasureItem[] = sortCatalogMeasures(
  RAW_INITIAL_MEASURES.map((label) => buildMeasureItem(label))
);

/**
 * Realistic initial distribution so Balanza & Despachador are immediately ready to test on first load.
 */
export const INITIAL_WAREHOUSE_STOCK: WarehouseStockMap = {
  PT_08: ['6_mm', '8_mm', '3_8in_x_9_m', '3_8in_x_12_m', '12_mm'],
  PT_09: ['3_8in_x_9_m', '1_2in_x_9_m', '1_2in_x_12_m', '5_8in_x_9_m'],
  PT_15_BAHIA: ['1_2in_x_9_m', '5_8in_x_12_m', '3_4in_x_9_m', '3_4in_x_12_m'],
  PT_15_CURVA: ['5_8in_x_9_m', '3_4in_x_12_m', '1in_x_9_m', '1in_x_12_m'],
};

