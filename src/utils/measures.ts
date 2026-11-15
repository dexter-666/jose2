import { ClassificationGroup, MeasureItem, WarehouseDefinition, WarehouseStockMap } from '../types/stock';

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

/**
 * Exact 8 classification groups required by the technical specification.
 */
export const CLASSIFICATION_GROUPS: readonly ClassificationGroup[] = [
  'Nacional',
  'Fhab',
  'Importado',
  'Recox',
  'Dimensionado',
  'Especial',
  'Planchas',
  'Perfiles',
] as const;

export function isClassificationGroup(val: unknown): val is ClassificationGroup {
  return typeof val === 'string' && CLASSIFICATION_GROUPS.includes(val as ClassificationGroup);
}

const INCH_TO_MM = 25.4;

export interface RawCatalogSeed {
  label: string;
  technicalDescription: string;
  group: ClassificationGroup;
  overrideDiameterMm?: number;
  overrideLengthM?: number;
}

/**
 * Standard seed catalog covering all 8 classification groups
 * with exact technical description formats (e.g., "Media x 9 y A 6 15").
 */
export const SEED_CATALOG_DEFINITIONS: readonly RawCatalogSeed[] = [
  // 1) Nacional (Barras de Construcción Nacional NTP 341.031 / ASTM A615 Grado 60)
  {
    label: '6 mm',
    technicalDescription: '6 mm x 9 y NTP 341',
    group: 'Nacional',
    overrideDiameterMm: 6,
    overrideLengthM: 9,
  },
  {
    label: '8 mm',
    technicalDescription: '8 mm x 9 y A 6 15',
    group: 'Nacional',
    overrideDiameterMm: 8,
    overrideLengthM: 9,
  },
  {
    label: '3/8" x 9 m',
    technicalDescription: '3/8 x 9 y A 6 15',
    group: 'Nacional',
    overrideDiameterMm: 9.525,
    overrideLengthM: 9,
  },
  {
    label: '12 mm',
    technicalDescription: '12 mm x 9 y A 6 15',
    group: 'Nacional',
    overrideDiameterMm: 12,
    overrideLengthM: 9,
  },
  {
    label: '1/2" x 9 m',
    technicalDescription: 'Media x 9 y A 6 15',
    group: 'Nacional',
    overrideDiameterMm: 12.7,
    overrideLengthM: 9,
  },
  {
    label: '5/8" x 9 m',
    technicalDescription: '5/8 x 9 y A 6 15',
    group: 'Nacional',
    overrideDiameterMm: 15.875,
    overrideLengthM: 9,
  },
  {
    label: '3/4" x 9 m',
    technicalDescription: '3/4 x 9 y A 6 15',
    group: 'Nacional',
    overrideDiameterMm: 19.05,
    overrideLengthM: 9,
  },
  {
    label: '1" x 9 m',
    technicalDescription: '1 x 9 y A 6 15',
    group: 'Nacional',
    overrideDiameterMm: 25.4,
    overrideLengthM: 9,
  },

  // 2) Fhab (Fierro Habilitado)
  {
    label: '3/8" FHAB Estribos',
    technicalDescription: '3/8 FHAB Estribos 15x20',
    group: 'Fhab',
    overrideDiameterMm: 9.525,
    overrideLengthM: 1,
  },
  {
    label: '1/2" FHAB Columna',
    technicalDescription: 'Media FHAB Columna x 9',
    group: 'Fhab',
    overrideDiameterMm: 12.7,
    overrideLengthM: 9,
  },
  {
    label: '5/8" FHAB Viga',
    technicalDescription: '5/8 FHAB Viga Armada x 9',
    group: 'Fhab',
    overrideDiameterMm: 15.875,
    overrideLengthM: 9,
  },
  {
    label: '3/4" FHAB Zapata',
    technicalDescription: '3/4 FHAB Zapata Reforzada',
    group: 'Fhab',
    overrideDiameterMm: 19.05,
    overrideLengthM: 6,
  },

  // 3) Importado (Barras ASTM A615 Grado 60 Importadas)
  {
    label: '3/8" x 12 m',
    technicalDescription: '3/8 x 12 y A 6 15 IMP',
    group: 'Importado',
    overrideDiameterMm: 9.525,
    overrideLengthM: 12,
  },
  {
    label: '1/2" x 12 m',
    technicalDescription: 'Media x 12 y A 6 15 IMP',
    group: 'Importado',
    overrideDiameterMm: 12.7,
    overrideLengthM: 12,
  },
  {
    label: '5/8" x 12 m',
    technicalDescription: '5/8 x 12 y A 6 15 IMP',
    group: 'Importado',
    overrideDiameterMm: 15.875,
    overrideLengthM: 12,
  },
  {
    label: '3/4" x 12 m',
    technicalDescription: '3/4 x 12 y A 6 15 IMP',
    group: 'Importado',
    overrideDiameterMm: 19.05,
    overrideLengthM: 12,
  },
  {
    label: '1" x 12 m',
    technicalDescription: '1 x 12 y A 6 15 IMP',
    group: 'Importado',
    overrideDiameterMm: 25.4,
    overrideLengthM: 12,
  },

  // 4) Recox (Alambrón y Alambre Recocido)
  {
    label: '6 mm Alambrón',
    technicalDescription: 'Alambrón 6 mm RECOX Bobina',
    group: 'Recox',
    overrideDiameterMm: 6,
    overrideLengthM: 0,
  },
  {
    label: '8 mm Alambrón',
    technicalDescription: 'Alambrón 8 mm RECOX Bobina',
    group: 'Recox',
    overrideDiameterMm: 8,
    overrideLengthM: 0,
  },
  {
    label: 'Alambre #16',
    technicalDescription: 'Alambre #16 RECOX x 50kg',
    group: 'Recox',
    overrideDiameterMm: 1.65,
    overrideLengthM: 50,
  },
  {
    label: 'Alambre #8',
    technicalDescription: 'Alambre #8 RECOX x 50kg',
    group: 'Recox',
    overrideDiameterMm: 4.19,
    overrideLengthM: 50,
  },

  // 5) Dimensionado (Corte y Doblez)
  {
    label: '3/8" x 6 m',
    technicalDescription: '3/8 x 6 m DIM Corte Recto',
    group: 'Dimensionado',
    overrideDiameterMm: 9.525,
    overrideLengthM: 6,
  },
  {
    label: '1/2" x 6 m',
    technicalDescription: 'Media x 6 m DIM Corte Recto',
    group: 'Dimensionado',
    overrideDiameterMm: 12.7,
    overrideLengthM: 6,
  },
  {
    label: '5/8" x 6 m',
    technicalDescription: '5/8 x 6 m DIM Doblez Especial',
    group: 'Dimensionado',
    overrideDiameterMm: 15.875,
    overrideLengthM: 6,
  },
  {
    label: '3/4" x 6 m',
    technicalDescription: '3/4 x 6 m DIM Doblez Especial',
    group: 'Dimensionado',
    overrideDiameterMm: 19.05,
    overrideLengthM: 6,
  },

  // 6) Especial (Acero Soldable ASTM A706)
  {
    label: '1/2" x 9 m Soldable',
    technicalDescription: 'Media x 9 y A 7 06 Soldable',
    group: 'Especial',
    overrideDiameterMm: 12.7,
    overrideLengthM: 9,
  },
  {
    label: '5/8" x 9 m Soldable',
    technicalDescription: '5/8 x 9 y A 7 06 Soldable',
    group: 'Especial',
    overrideDiameterMm: 15.875,
    overrideLengthM: 9,
  },
  {
    label: '3/4" x 12 m Soldable',
    technicalDescription: '3/4 x 12 y A 7 06 Soldable',
    group: 'Especial',
    overrideDiameterMm: 19.05,
    overrideLengthM: 12,
  },
  {
    label: '1" x 12 m Soldable',
    technicalDescription: '1 x 12 y A 7 06 Soldable',
    group: 'Especial',
    overrideDiameterMm: 25.4,
    overrideLengthM: 12,
  },

  // 7) Planchas (Laminadas en Caliente LAC / Frío LAF)
  {
    label: 'LAC 1.5 mm',
    technicalDescription: 'LAC 1.5 mm x 1200 x 2400',
    group: 'Planchas',
    overrideDiameterMm: 1.5,
    overrideLengthM: 2.4,
  },
  {
    label: 'LAC 2.0 mm',
    technicalDescription: 'LAC 2.0 mm x 1200 x 2400',
    group: 'Planchas',
    overrideDiameterMm: 2.0,
    overrideLengthM: 2.4,
  },
  {
    label: 'LAC 3.0 mm',
    technicalDescription: 'LAC 3.0 mm x 1200 x 2400',
    group: 'Planchas',
    overrideDiameterMm: 3.0,
    overrideLengthM: 2.4,
  },
  {
    label: 'LAF 0.9 mm',
    technicalDescription: 'LAF 0.9 mm x 1000 x 2000',
    group: 'Planchas',
    overrideDiameterMm: 0.9,
    overrideLengthM: 2.0,
  },

  // 8) Perfiles (Ángulos, Platinas, Tees A36)
  {
    label: 'Ángulo 1 1/2" x 3/16"',
    technicalDescription: 'Ángulo 1 1/2 x 1 1/2 x 3/16 x 6m',
    group: 'Perfiles',
    overrideDiameterMm: 38.1,
    overrideLengthM: 6,
  },
  {
    label: 'Ángulo 2" x 1/4"',
    technicalDescription: 'Ángulo 2 x 2 x 1/4 x 6m',
    group: 'Perfiles',
    overrideDiameterMm: 50.8,
    overrideLengthM: 6,
  },
  {
    label: 'Platina 1" x 3/16"',
    technicalDescription: 'Platina 1 x 3/16 x 6m',
    group: 'Perfiles',
    overrideDiameterMm: 25.4,
    overrideLengthM: 6,
  },
  {
    label: 'Tee 1 1/2" x 1/8"',
    technicalDescription: 'Tee 1 1/2 x 1 1/2 x 1/8 x 6m',
    group: 'Perfiles',
    overrideDiameterMm: 38.1,
    overrideLengthM: 6,
  },
];

/**
 * Parses steel bar dimensions from a label into millimeter diameter and meter length
 * so measures can always be sorted strictly from thin to thick.
 */
export function parseMeasureMetrics(text: string): {
  diameterMm: number;
  lengthM: number;
  parsed: boolean;
} {
  const cleaned = text.trim().replace(/×/g, 'x').replace(/[“”]/g, '"');

  // Handle standard spoken Spanish steel sizes (e.g., "Media x 9 y A 6 15")
  if (/^media\b/i.test(cleaned)) {
    const lenMatch = cleaned.match(/x\s*(\d+(?:[.,]\d+)?)/i);
    return {
      diameterMm: 12.7,
      lengthM: lenMatch ? parseFloat(lenMatch[1].replace(',', '.')) : 0,
      parsed: true,
    };
  }

  // Split around 'x' if present: e.g. '3/8" x 9 m' -> left='3/8"', right='9 m'
  const parts = cleaned.split(/\s*x\s*/i);
  const diameterPart = parts[0]?.trim() ?? '';
  const lengthPart = parts[1]?.trim() ?? '';

  let diameterMm = Number.MAX_SAFE_INTEGER;
  let parsed = false;

  // 1) Metric mm: "6 mm", "8mm", "12.5 mm", "12 mm"
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
      // 3) Fractional inches: '3/8"', '1/2"', '3/8', '5/8'
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

export function inferClassificationGroup(label: string, techDesc?: string): ClassificationGroup {
  const combined = `${label} ${techDesc ?? ''}`.toLowerCase();
  if (combined.includes('fhab')) return 'Fhab';
  if (combined.includes('imp') || combined.includes('importad')) return 'Importado';
  if (combined.includes('recox') || combined.includes('alambr') || combined.includes('alambre')) return 'Recox';
  if (combined.includes('dim') || combined.includes('dimensionad')) return 'Dimensionado';
  if (combined.includes('soldable') || combined.includes('a706') || combined.includes('a 7 06') || combined.includes('especial')) return 'Especial';
  if (combined.includes('lac') || combined.includes('laf') || combined.includes('plancha')) return 'Planchas';
  if (combined.includes('ángulo') || combined.includes('angulo') || combined.includes('platina') || combined.includes('perfil') || combined.includes('tee')) return 'Perfiles';
  return 'Nacional';
}

export function inferTechnicalDescription(label: string, group: ClassificationGroup = 'Nacional'): string {
  const cleaned = label.trim();
  if (/^1\/2/i.test(cleaned)) {
    const len = cleaned.includes('12') ? '12' : '9';
    return group === 'Importado'
      ? `Media x ${len} y A 6 15 IMP`
      : group === 'Especial'
        ? `Media x ${len} y A 7 06 Soldable`
        : `Media x ${len} y A 6 15`;
  }
  if (/^3\/8/i.test(cleaned)) {
    const len = cleaned.includes('12') ? '12' : '9';
    return group === 'Importado' ? `3/8 x ${len} y A 6 15 IMP` : `3/8 x ${len} y A 6 15`;
  }
  if (/^5\/8/i.test(cleaned)) {
    const len = cleaned.includes('12') ? '12' : '9';
    return group === 'Importado' ? `5/8 x ${len} y A 6 15 IMP` : `5/8 x ${len} y A 6 15`;
  }
  if (/^3\/4/i.test(cleaned)) {
    const len = cleaned.includes('12') ? '12' : '9';
    return group === 'Importado' ? `3/4 x ${len} y A 6 15 IMP` : `3/4 x ${len} y A 6 15`;
  }
  if (/^1"/i.test(cleaned) || /^1\s*x/i.test(cleaned)) {
    const len = cleaned.includes('12') ? '12' : '9';
    return group === 'Importado' ? `1 x ${len} y A 6 15 IMP` : `1 x ${len} y A 6 15`;
  }
  if (/^6\s*mm/i.test(cleaned)) return '6 mm x 9 y NTP 341';
  if (/^8\s*mm/i.test(cleaned)) return '8 mm x 9 y A 6 15';
  if (/^12\s*mm/i.test(cleaned)) return '12 mm x 9 y A 6 15';

  return `${cleaned} - ${group}`;
}

export function createMeasureId(label: string, group?: ClassificationGroup): string {
  const cleanLabel = label
    .trim()
    .toLowerCase()
    .replace(/"/g, 'in')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (group && group !== 'Nacional') {
    return `${group.toLowerCase()}_${cleanLabel}`;
  }
  return cleanLabel;
}

export function buildMeasureItem(
  label: string,
  options?: {
    isCustom?: boolean;
    technicalDescription?: string;
    group?: ClassificationGroup;
    overrideDiameterMm?: number;
    overrideLengthM?: number;
  }
): MeasureItem {
  const normalizedLabel = label.trim().replace(/\s+/g, ' ');
  const parsed = parseMeasureMetrics(normalizedLabel);
  const group = options?.group ?? inferClassificationGroup(normalizedLabel, options?.technicalDescription);
  const technicalDescription =
    options?.technicalDescription?.trim() || inferTechnicalDescription(normalizedLabel, group);

  return {
    id: createMeasureId(normalizedLabel, group),
    label: normalizedLabel,
    technicalDescription,
    group,
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
 * Flexible matcher so SAP picking queries like "1/2 x 9", "1/2x9", "12mm", "3/8 12",
 * "Media x 9", "A 6 15", "Nacional", etc., accurately match without false positives.
 */
export function matchesMeasureQuery(targetInput: MeasureItem | string, rawQuery: string): boolean {
  const query = normalizeSearchText(rawQuery);
  if (!query) return true;

  const targetLabel = typeof targetInput === 'string' ? targetInput : targetInput.label;
  const targetTech = typeof targetInput === 'string' ? '' : targetInput.technicalDescription;
  const targetGroup = typeof targetInput === 'string' ? '' : targetInput.group;
  const combined = `${targetLabel} ${targetTech} ${targetGroup}`.trim();

  const target = normalizeSearchText(combined);
  const compactTarget = target.replace(/\s+/g, '');
  const compactQuery = query.replace(/\s+/g, '');

  // Direct substring or spaceless substring match (e.g., "1/2 x 9" -> "1/2x9" inside "1/2x9m")
  if (target.includes(query) || compactTarget.includes(compactQuery)) {
    return true;
  }

  // Token-based match (ignoring standalone 'x')
  const targetTokens = target.split(' ').filter((t) => t !== 'x');
  const queryTokens = query.split(' ').filter((t) => t !== 'x');
  if (queryTokens.length === 0) return true;

  return queryTokens.every((qToken) => {
    const qNoUnit = qToken.replace(/(mm|m)$/i, '');
    return targetTokens.some((tToken) => {
      if (tToken === qToken || tToken.startsWith(qToken)) return true;
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

/**
 * Initial full catalog sorted thin-to-thick.
 */
export const INITIAL_CATALOG: MeasureItem[] = sortCatalogMeasures(
  SEED_CATALOG_DEFINITIONS.map((seed) =>
    buildMeasureItem(seed.label, {
      technicalDescription: seed.technicalDescription,
      group: seed.group,
      overrideDiameterMm: seed.overrideDiameterMm,
      overrideLengthM: seed.overrideLengthM,
    })
  )
);

/**
 * Realistic initial distribution across the 4 warehouses
 * populated with standard measures from the catalog.
 */
export const INITIAL_WAREHOUSE_STOCK: WarehouseStockMap = {
  PT_08: ['6_mm', '8_mm', '3_8in_x_9_m', '12_mm', '1_2in_x_9_m'],
  PT_09: ['importado_3_8in_x_12_m', 'importado_1_2in_x_12_m', '5_8in_x_9_m', 'importado_5_8in_x_12_m'],
  PT_15_BAHIA: ['fhab_1_2in_fhab_columna', 'fhab_3_8in_fhab_estribos', 'recox_6_mm_alambron', 'recox_alambre_16'],
  PT_15_CURVA: ['especial_1_2in_x_9_m_soldable', 'especial_3_4in_x_12_m_soldable', 'perfiles_angulo_1_1_2in_x_3_16in'],
};
