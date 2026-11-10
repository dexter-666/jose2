export type WarehouseId = 'PT_08' | 'PT_09' | 'PT_15_BAHIA' | 'PT_15_CURVA';

export interface WarehouseDefinition {
  id: WarehouseId;
  /** Exact fixed header required by spec */
  label: string;
  /** Secondary descriptive subtitle */
  zone: string;
  /** Visual corporate accent per warehouse column */
  accent: 'blue' | 'red';
}

export interface MeasureItem {
  id: string;
  label: string;
  /** Calculated or user-provided diameter in mm for strict thin-to-thick sorting */
  diameterMm: number;
  /** Length in meters (0 if unspecified, e.g. 6 mm coils/bars) */
  lengthM: number;
  isCustom?: boolean;
}

export type ShiftCode = '07:00' | '15:00' | '23:00';

export interface ShiftOption {
  code: ShiftCode;
  label: string;
  schedule: string;
}

export type WarehouseStockMap = Record<WarehouseId, string[]>;

export interface StockState {
  version: number;
  catalog: MeasureItem[];
  warehouses: WarehouseStockMap;
  shift: ShiftCode;
  lastUpdatedAt: string;
  lastVerifiedAt: string | null;
  revision: number;
}

export interface StockChangeMetadata {
  sourceTabId: string;
  action: 'update' | 'verify' | 'reset' | 'catalog_add';
  affectedWarehouses: WarehouseId[];
  affectedMeasureIds: string[];
  timestamp: string;
}

