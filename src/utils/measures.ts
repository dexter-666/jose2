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
 * Exact 8 classification groups required by the technical specification (Primera vista para despachador).
 */
export const CLASSIFICATION_GROUPS: readonly ClassificationGroup[] = [
  'IMPORTADO',
  'FEHAB',
  'NACIONAL',
  'FECOXI',
  'FM',
  'EXPORTACIÓN',
  'NACIONAL SOLDABLE',
  'SEMI-TERMINADO',
] as const;

export function isClassificationGroup(val: unknown): val is ClassificationGroup {
  return typeof val === 'string' && CLASSIFICATION_GROUPS.includes(val as ClassificationGroup);
}

const INCH_TO_MM = 25.4;

/**
 * Official catalog seeds covering all 8 classification groups
 * directly provided by user specification with SAP codes and descriptions.
 */
export const SEED_CATALOG_DEFINITIONS: readonly MeasureItem[] = [
  {
    id: "sap_110000255",
    sapCode: "110000255",
    label: "6mm x 9m",
    metric: "6mm",
    length: "9m",
    quality: "A615",
    metricDisplay: "6mm X 9m A615",
    technicalDescription: "BC 6mmx9m NTP 341.031/ASTM A615",
    materialDescription: "BC 6MMX9M NTP 341.031/ASTM A61",
    group: "IMPORTADO",
    diameterMm: 6,
    lengthM: 9,
  },
  {
    id: "sap_110000263",
    sapCode: "110000263",
    label: "1/2\" x 9m",
    metric: "1/2\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "1/2\" X 9m A615",
    technicalDescription: "BC 1/2\"x9m NTP 341.031/ASTM A615",
    materialDescription: "BC 1/2\"x9m NTP 341.031/ASTM A615",
    group: "IMPORTADO",
    diameterMm: 12.7,
    lengthM: 9,
  },
  {
    id: "sap_110000265",
    sapCode: "110000265",
    label: "8mm x 9m",
    metric: "8mm",
    length: "9m",
    quality: "A615",
    metricDisplay: "8mm X 9m A615",
    technicalDescription: "BC 8mmx9m NTP 341.031/ASTM A615",
    materialDescription: "BARRA CONSTR 8X9000MM A615",
    group: "IMPORTADO",
    diameterMm: 8,
    lengthM: 9,
  },
  {
    id: "sap_110000266",
    sapCode: "110000266",
    label: "3/8\" x 9m",
    metric: "3/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "3/8\" X 9m A615",
    technicalDescription: "BC 3/8\"x9m NTP 341.031/ASTM A615",
    materialDescription: "BARRA CONSTR 3/8\"X9000MM A615",
    group: "IMPORTADO",
    diameterMm: 9.525,
    lengthM: 9,
  },
  {
    id: "sap_110300507",
    sapCode: "110300507",
    label: "5/8\" x 9m",
    metric: "5/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "5/8\" X 9m A615",
    technicalDescription: "BC 5/8\"X9M NTP 341.031/ASTM A615",
    materialDescription: "BC 5/8\"X9M NTP 341.031/ASTM A615",
    group: "IMPORTADO",
    diameterMm: 15.875,
    lengthM: 9,
  },
  {
    id: "sap_110500143",
    sapCode: "110500143",
    label: "1.3/8\" x 12m",
    metric: "1.3/8\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "1.3/8\" X 12m A615",
    technicalDescription: "BC SP 1.3/8\"x12m FH NTP341.031/ASTM A615",
    materialDescription: "BC SP 1.3/8\"x12m FH NTP341.031/ASTM A615",
    group: "FEHAB",
    diameterMm: 34.925,
    lengthM: 12,
  },
  {
    id: "sap_110500144",
    sapCode: "110500144",
    label: "1\" x 9m",
    metric: "1\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "1\" X 9m A615",
    technicalDescription: "BC 1\"X9m SP FH NTP 341.031/ASTM A615",
    materialDescription: "BC 1\"X9m SP FH NTP 341.031/ASTM A615",
    group: "FEHAB",
    diameterMm: 25.4,
    lengthM: 9,
  },
  {
    id: "sap_110500145",
    sapCode: "110500145",
    label: "5/8\" x 9m",
    metric: "5/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "5/8\" X 9m A615",
    technicalDescription: "BC 5/8\"X9m SP FH NTP 341.031/ASTM A615",
    materialDescription: "BC 5/8\"X9m SP FH NTP 341.031/ASTM A615",
    group: "FEHAB",
    diameterMm: 15.875,
    lengthM: 9,
  },
  {
    id: "sap_110500146",
    sapCode: "110500146",
    label: "3/4\" x 9m",
    metric: "3/4\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "3/4\" X 9m A615",
    technicalDescription: "BC SP 3/4\"x9m FH NTP 341.031/ASTM A615",
    materialDescription: "BC SP 3/4\"x9m FH NTP 341.031/ASTM A615",
    group: "FEHAB",
    diameterMm: 19.05,
    lengthM: 9,
  },
  {
    id: "sap_110500147",
    sapCode: "110500147",
    label: "1\" x 12m",
    metric: "1\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "1\" X 12m A615",
    technicalDescription: "BC SP 1\"x12m FH NTP 341.031/ASTM A615",
    materialDescription: "BC SP 1\"x12m FH NTP 341.031/ASTM A615",
    group: "FEHAB",
    diameterMm: 25.4,
    lengthM: 12,
  },
  {
    id: "sap_110500148",
    sapCode: "110500148",
    label: "3/4\" x 12m",
    metric: "3/4\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "3/4\" X 12m A615",
    technicalDescription: "BC SP 3/4\"x12m FH NTP 341.031/ASTM A615",
    materialDescription: "BC SP 3/4\"x12m FH NTP 341.031/ASTM A615",
    group: "FEHAB",
    diameterMm: 19.05,
    lengthM: 12,
  },
  {
    id: "sap_110500149",
    sapCode: "110500149",
    label: "5/8\" x 12m",
    metric: "5/8\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "5/8\" X 12m A615",
    technicalDescription: "BC SP 5/8\"x12m FH NTP 341.031/ASTM A615",
    materialDescription: "BC SP 5/8\"x12m FH NTP 341.031/ASTM A615",
    group: "FEHAB",
    diameterMm: 15.875,
    lengthM: 12,
  },
  {
    id: "sap_110500150",
    sapCode: "110500150",
    label: "1/2\" x 12m",
    metric: "1/2\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "1/2\" X 12m A615",
    technicalDescription: "BC SP 1/2\"x12m FH NTP 341.031/ASTM A615",
    materialDescription: "BC SP 1/2\"x12m FH NTP 341.031/ASTM A615",
    group: "FEHAB",
    diameterMm: 12.7,
    lengthM: 12,
  },
  {
    id: "sap_110502186",
    sapCode: "110502186",
    label: "5/8\" x 12m",
    metric: "5/8\"",
    length: "12m",
    quality: "A706",
    metricDisplay: "5/8\" X 12m A706",
    technicalDescription: "BC SP 5/8\"x12m FH NTP 339.186/ASTM A706",
    materialDescription: "BC SP 5/8\"x12m FH NTP 339.186/ASTM A706",
    group: "FEHAB",
    diameterMm: 15.875,
    lengthM: 12,
  },
  {
    id: "sap_110502187",
    sapCode: "110502187",
    label: "3/4\" x 12m",
    metric: "3/4\"",
    length: "12m",
    quality: "A706",
    metricDisplay: "3/4\" X 12m A706",
    technicalDescription: "BC SP 3/4\"x12m FH NTP 339.186/ASTM A706",
    materialDescription: "BC SP 3/4\"x12m FH NTP 339.186/ASTM A706",
    group: "FEHAB",
    diameterMm: 19.05,
    lengthM: 12,
  },
  {
    id: "sap_110502190",
    sapCode: "110502190",
    label: "1.3/8\" x 12m",
    metric: "1.3/8\"",
    length: "12m",
    quality: "A706",
    metricDisplay: "1.3/8\" X 12m A706",
    technicalDescription: "BC SP 1.3/8\"x12m FH NTP339.186/ASTM A706",
    materialDescription: "BC SP 1.3/8\"x12m FH NTP339.186/ASTM A706",
    group: "FEHAB",
    diameterMm: 34.925,
    lengthM: 12,
  },
  {
    id: "sap_110721512",
    sapCode: "110721512",
    label: "3/8\" x 9m",
    metric: "3/8\"",
    length: "9m",
    quality: "A706",
    metricDisplay: "3/8\" X 9m A706",
    technicalDescription: "BC SP 3/8\"X9M FH NTP339.186/ASTM A706",
    materialDescription: "BC SP 3/8\"X9M FH NTP339.186/ASTM A706",
    group: "FEHAB",
    diameterMm: 9.525,
    lengthM: 9,
  },
  {
    id: "sap_110000257",
    sapCode: "110000257",
    label: "12mm x 9m",
    metric: "12mm",
    length: "9m",
    quality: "A615",
    metricDisplay: "12mm X 9m A615",
    technicalDescription: "BC SP 12mmx9m NTP 341.031/ASTM A615",
    materialDescription: "BC-1 SP ASTM A615 G60 12.0X9.0",
    group: "NACIONAL",
    diameterMm: 12,
    lengthM: 9,
  },
  {
    id: "sap_110000271",
    sapCode: "110000271",
    label: "1/2\" x 12m",
    metric: "1/2\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "1/2\" X 12m A615",
    technicalDescription: "BC SP 1/2\"x12m NTP 341.031/ASTM A615",
    materialDescription: "BARRA CONSTR SP 1/2\"X12  A615",
    group: "NACIONAL",
    diameterMm: 12.7,
    lengthM: 12,
  },
  {
    id: "sap_110000272",
    sapCode: "110000272",
    label: "1\" x 12m",
    metric: "1\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "1\" X 12m A615",
    technicalDescription: "BC SP 1\"x12m NTP 341.031/ASTM A615",
    materialDescription: "BC-1 SP ASTM A615 G60 1\"X12.00",
    group: "NACIONAL",
    diameterMm: 25.4,
    lengthM: 12,
  },
  {
    id: "sap_110000273",
    sapCode: "110000273",
    label: "1.3/8\" x 12m",
    metric: "1.3/8\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "1.3/8\" X 12m A615",
    technicalDescription: "BC SP 1.3/8\"x12m NTP 341.031/ASTM A615",
    materialDescription: "BC-1 SP A615 G60 1.3/8\"X12M",
    group: "NACIONAL",
    diameterMm: 34.925,
    lengthM: 12,
  },
  {
    id: "sap_110000274",
    sapCode: "110000274",
    label: "3/8\" x 9m",
    metric: "3/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "3/8\" X 9m A615",
    technicalDescription: "BC SP 3/8\"x9m NTP 341.031/ASTM A615",
    materialDescription: "BC-1 SP ASTM A615 G60 3/8\"X9.0",
    group: "NACIONAL",
    diameterMm: 9.525,
    lengthM: 9,
  },
  {
    id: "sap_110000276",
    sapCode: "110000276",
    label: "1/2\" x 9m",
    metric: "1/2\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "1/2\" X 9m A615",
    technicalDescription: "BC SP 1/2\"x9m NTP 341.031/ASTM A615",
    materialDescription: "BC-1 SP ASTM A615 G60 1/2\"X9.0",
    group: "NACIONAL",
    diameterMm: 12.7,
    lengthM: 9,
  },
  {
    id: "sap_110000277",
    sapCode: "110000277",
    label: "5/8\" x 9m",
    metric: "5/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "5/8\" X 9m A615",
    technicalDescription: "BC SP 5/8\"x9m NTP 341.031/ASTM A615",
    materialDescription: "BC-1 SP ASTM A615 G60 5/8\"X9.0",
    group: "NACIONAL",
    diameterMm: 15.875,
    lengthM: 9,
  },
  {
    id: "sap_110000280",
    sapCode: "110000280",
    label: "5/8\" x 12m",
    metric: "5/8\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "5/8\" X 12m A615",
    technicalDescription: "BC SP 5/8\"x12m NTP 341.031/ASTM A615",
    materialDescription: "BARRA CONSTR SP 5/8\"X12M A615",
    group: "NACIONAL",
    diameterMm: 15.875,
    lengthM: 12,
  },
  {
    id: "sap_110000283",
    sapCode: "110000283",
    label: "3/4\" x 12m",
    metric: "3/4\"",
    length: "12m",
    quality: "A615",
    metricDisplay: "3/4\" X 12m A615",
    technicalDescription: "BC SP 3/4\"x12m NTP 341.031/ASTM A615",
    materialDescription: "BC-1 SP  A615 G60 3/4\"X12.0M",
    group: "NACIONAL",
    diameterMm: 19.05,
    lengthM: 12,
  },
  {
    id: "sap_110000286",
    sapCode: "110000286",
    label: "1\" x 9m",
    metric: "1\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "1\" X 9m A615",
    technicalDescription: "BC SP 1\"x9m NTP 341.031/ASTM A615",
    materialDescription: "BC-1 SP ASTM A615 G60 1\"X9.00M",
    group: "NACIONAL",
    diameterMm: 25.4,
    lengthM: 9,
  },
  {
    id: "sap_110000287",
    sapCode: "110000287",
    label: "3/4\" x 9m",
    metric: "3/4\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "3/4\" X 9m A615",
    technicalDescription: "BC SP 3/4\"x9m NTP 341.031/ASTM A615",
    materialDescription: "BC-1 SP A615 G60 3/4\"X9.0M",
    group: "NACIONAL",
    diameterMm: 19.05,
    lengthM: 9,
  },
  {
    id: "sap_110007550",
    sapCode: "110007550",
    label: "1.3/8\" x 9m",
    metric: "1.3/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "1.3/8\" X 9m A615",
    technicalDescription: "BC SP 1.3/8\"x9m NTP 341.031/ASTM A615",
    materialDescription: "BARRA CONSTR SP 1.3/8\"X9000MM",
    group: "NACIONAL",
    diameterMm: 34.925,
    lengthM: 9,
  },
  {
    id: "sap_110000267",
    sapCode: "110000267",
    label: "5/8\" x 9000mm",
    metric: "5/8\"",
    length: "9000mm",
    quality: "A615",
    metricDisplay: "5/8\" X 9000mm A615",
    technicalDescription: "BC 5/8\"x9000mm NTP 341.031/ASTM A615",
    materialDescription: "BARRA CONSTR 5/8\"X9000MM A615",
    group: "FECOXI",
    diameterMm: 15.875,
    lengthM: 9,
  },
  {
    id: "sap_110000517",
    sapCode: "110000517",
    label: "6mm x 9000mm",
    metric: "6mm",
    length: "9000mm",
    quality: "A615",
    metricDisplay: "6mm X 9000mm A615",
    technicalDescription: "BC 6mmx9000mm NTP 341.031/ASTM A615",
    materialDescription: "BC-AL-1 SP NTP341 G60 6MMX9.0M",
    group: "FECOXI",
    diameterMm: 6,
    lengthM: 9,
  },
  {
    id: "sap_110000521",
    sapCode: "110000521",
    label: "3/8\" x 9000mm",
    metric: "3/8\"",
    length: "9000mm",
    quality: "A615",
    metricDisplay: "3/8\" X 9000mm A615",
    technicalDescription: "BC 3/8\"x9000mm NTP 341.031/ASTM A615",
    materialDescription: "BARRA CONSTR 3/8\"X9000MM A615",
    group: "FECOXI",
    diameterMm: 9.525,
    lengthM: 9,
  },
  {
    id: "sap_110007204",
    sapCode: "110007204",
    label: "1/2\" x 9000mm",
    metric: "1/2\"",
    length: "9000mm",
    quality: "A615",
    metricDisplay: "1/2\" X 9000mm A615",
    technicalDescription: "BC 1/2\"x9000mm NTP 341.031/ASTM A615",
    materialDescription: "BARRA CONSTR 1/2\"X9000MM A615",
    group: "FECOXI",
    diameterMm: 12.7,
    lengthM: 9,
  },
  {
    id: "sap_110007205",
    sapCode: "110007205",
    label: "8mm x 9000mm",
    metric: "8mm",
    length: "9000mm",
    quality: "A615",
    metricDisplay: "8mm X 9000mm A615",
    technicalDescription: "BC 8mmx9000mm NTP 341.031/ASTM A615",
    materialDescription: "BARRA CONSTR 8X9M A615",
    group: "FECOXI",
    diameterMm: 8,
    lengthM: 9,
  },
  {
    id: "sap_110300623",
    sapCode: "110300623",
    label: "12mm x 9000mm",
    metric: "12mm",
    length: "9000mm",
    quality: "A615",
    metricDisplay: "12mm X 9000mm A615",
    technicalDescription: "BC 12mmX9000mm NTP 341.031/ASTM A615",
    materialDescription: "BC 12mmX9000mm NTP 341.031/ASTM A615",
    group: "FECOXI",
    diameterMm: 12,
    lengthM: 9,
  },
  {
    id: "sap_110000254",
    sapCode: "110000254",
    label: "3/8\" x 9m",
    metric: "3/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "3/8\" X 9m A615",
    technicalDescription: "BC FM 3/8\"x9M ASTM A615 G60",
    materialDescription: "BC FM 3/8\"X9M ASTM A615 G60",
    group: "FM",
    diameterMm: 9.525,
    lengthM: 9,
  },
  {
    id: "sap_110000284",
    sapCode: "110000284",
    label: "5/8\" x 9m",
    metric: "5/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "5/8\" X 9m A615",
    technicalDescription: "BC FM 5/8\"x9M ASTM A615 G60",
    materialDescription: "BC FM 5/8\"X9M ASTM A615 G60",
    group: "FM",
    diameterMm: 15.875,
    lengthM: 9,
  },
  {
    id: "sap_110300577",
    sapCode: "110300577",
    label: "1/2\" x 9000mm",
    metric: "1/2\"",
    length: "9000mm",
    quality: "A615",
    metricDisplay: "1/2\" X 9000mm A615",
    technicalDescription: "BC FM 1/2\"X9000 ASTM A615 G60",
    materialDescription: "BC FM 1/2\"X9000 ASTM A615 G60",
    group: "FM",
    diameterMm: 12.7,
    lengthM: 9,
  },
  {
    id: "sap_110300947",
    sapCode: "110300947",
    label: "12mm x 9m",
    metric: "12mm",
    length: "9m",
    quality: "A615",
    metricDisplay: "12mm X 9m A615",
    technicalDescription: "BC FM 12MMX9M ASTM A615 G60",
    materialDescription: "BC FM 12MMX9M ASTM A615 G60",
    group: "FM",
    diameterMm: 12,
    lengthM: 9,
  },
  {
    id: "sap_110300948",
    sapCode: "110300948",
    label: "1/2\" x 9m",
    metric: "1/2\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "1/2\" X 9m A615",
    technicalDescription: "BC FM 1/2\"X9M ASTM A615 G60",
    materialDescription: "BC FM 1/2\"X9M ASTM A615 G60",
    group: "FM",
    diameterMm: 12.7,
    lengthM: 9,
  },
  {
    id: "sap_110300521",
    sapCode: "110300521",
    label: "12mm x 12m",
    metric: "12mm",
    length: "12m",
    quality: "NB 732",
    metricDisplay: "12mm X 12m NB 732",
    technicalDescription: "BC SP EX 12MMX12M NB 732",
    materialDescription: "BC SP EX 12MMX12M NB 732",
    group: "EXPORTACIÓN",
    diameterMm: 12,
    lengthM: 12,
  },
  {
    id: "sap_110300522",
    sapCode: "110300522",
    label: "16mm x 12m",
    metric: "16mm",
    length: "12m",
    quality: "NB 732",
    metricDisplay: "16mm X 12m NB 732",
    technicalDescription: "BC SP EX 16MMX12M NB 732",
    materialDescription: "BC SP EX 16MMX12M NB 732",
    group: "EXPORTACIÓN",
    diameterMm: 16,
    lengthM: 12,
  },
  {
    id: "sap_110300523",
    sapCode: "110300523",
    label: "20mm x 12m",
    metric: "20mm",
    length: "12m",
    quality: "NB 732",
    metricDisplay: "20mm X 12m NB 732",
    technicalDescription: "BC SP EX 20MMX12M NB 732",
    materialDescription: "BC SP EX 20MMX12M NB 732",
    group: "EXPORTACIÓN",
    diameterMm: 20,
    lengthM: 12,
  },
  {
    id: "sap_110300524",
    sapCode: "110300524",
    label: "9.5mm x 12m",
    metric: "9.5mm",
    length: "12m",
    quality: "NB 732",
    metricDisplay: "9.5mm X 12m NB 732",
    technicalDescription: "BC SP EX 9.5MM X12M NB 732",
    materialDescription: "BC SP EX 9.5MM X12M NB 732",
    group: "EXPORTACIÓN",
    diameterMm: 9.5,
    lengthM: 12,
  },
  {
    id: "sap_110300629",
    sapCode: "110300629",
    label: "5/8\" x 9m",
    metric: "5/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "5/8\" X 9m A615",
    technicalDescription: "BC GG 5/8\"X9M ASTM A615",
    materialDescription: "BC GG 5/8\"X9M IMP ASTM A615",
    group: "EXPORTACIÓN",
    diameterMm: 15.875,
    lengthM: 9,
  },
  {
    id: "sap_110300630",
    sapCode: "110300630",
    label: "1/2\" x 9m",
    metric: "1/2\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "1/2\" X 9m A615",
    technicalDescription: "BC GG 1/2\"X9M ASTM A615",
    materialDescription: "BC GG 1/2\"X9M IMP ASTM A615",
    group: "EXPORTACIÓN",
    diameterMm: 12.7,
    lengthM: 9,
  },
  {
    id: "sap_110300631",
    sapCode: "110300631",
    label: "3/8\" x 9m",
    metric: "3/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "3/8\" X 9m A615",
    technicalDescription: "BC GG 3/8\"X9M ASTM A615",
    materialDescription: "BC GG 3/8\"X9M IMP ASTM A615",
    group: "EXPORTACIÓN",
    diameterMm: 9.525,
    lengthM: 9,
  },
  {
    id: "sap_110000279",
    sapCode: "110000279",
    label: "3/8\" x 9m",
    metric: "3/8\"",
    length: "9m",
    quality: "A706",
    metricDisplay: "3/8\" X 9m A706",
    technicalDescription: "BC SP 3/8\"x9m NTP 339.186/ASTM A706",
    materialDescription: "BC SP 3/8\"X9M NTP 339.186",
    group: "NACIONAL SOLDABLE",
    diameterMm: 9.525,
    lengthM: 9,
  },
  {
    id: "sap_110000285",
    sapCode: "110000285",
    label: "1/2\" x 12m",
    metric: "1/2\"",
    length: "12m",
    quality: "A706",
    metricDisplay: "1/2\" X 12m A706",
    technicalDescription: "BC SP 1/2\"x12m NTP 339.186/ASTM A706",
    materialDescription: "BC SP 1/2\"X12M NTP 339.186",
    group: "NACIONAL SOLDABLE",
    diameterMm: 12.7,
    lengthM: 12,
  },
  {
    id: "sap_110000464",
    sapCode: "110000464",
    label: "5/8\" x 12m",
    metric: "5/8\"",
    length: "12m",
    quality: "A706",
    metricDisplay: "5/8\" X 12m A706",
    technicalDescription: "BC SP 5/8\"x12m NTP 339.186/ASTM A706",
    materialDescription: "BC SP 5/8\"X12M NTP 339.186",
    group: "NACIONAL SOLDABLE",
    diameterMm: 15.875,
    lengthM: 12,
  },
  {
    id: "sap_110007178",
    sapCode: "110007178",
    label: "1.3/8\" x 12m",
    metric: "1.3/8\"",
    length: "12m",
    quality: "A706",
    metricDisplay: "1.3/8\" X 12m A706",
    technicalDescription: "BC SP 1.3/8\"x12m NTP 339.186/ASTM A706",
    materialDescription: "BC SP 1.3/8\"X12M NTP 339.186",
    group: "NACIONAL SOLDABLE",
    diameterMm: 34.925,
    lengthM: 12,
  },
  {
    id: "sap_110007179",
    sapCode: "110007179",
    label: "3/4\" x 12m",
    metric: "3/4\"",
    length: "12m",
    quality: "A706",
    metricDisplay: "3/4\" X 12m A706",
    technicalDescription: "BC SP 3/4\"x12m NTP 339.186/ASTM A706",
    materialDescription: "BC SP 3/4\"X12M",
    group: "NACIONAL SOLDABLE",
    diameterMm: 19.05,
    lengthM: 12,
  },
  {
    id: "sap_110007180",
    sapCode: "110007180",
    label: "1.3/8\" x 9m",
    metric: "1.3/8\"",
    length: "9m",
    quality: "A706",
    metricDisplay: "1.3/8\" X 9m A706",
    technicalDescription: "BC SP 1.3/8\"x9m NTP 339.186/ASTM A706",
    materialDescription: "BC SP 1.3/8\"X9M NTP 339.186",
    group: "NACIONAL SOLDABLE",
    diameterMm: 34.925,
    lengthM: 9,
  },
  {
    id: "sap_110008022",
    sapCode: "110008022",
    label: "1\" x 12m",
    metric: "1\"",
    length: "12m",
    quality: "A706",
    metricDisplay: "1\" X 12m A706",
    technicalDescription: "BC SP 1\"x12m NTP 339.186/ASTM A706",
    materialDescription: "BC SP 1\"X12M NTP 339.186",
    group: "NACIONAL SOLDABLE",
    diameterMm: 25.4,
    lengthM: 12,
  },
  {
    id: "sap_110300552",
    sapCode: "110300552",
    label: "3/4\" x 9m",
    metric: "3/4\"",
    length: "9m",
    quality: "A706",
    metricDisplay: "3/4\" X 9m A706",
    technicalDescription: "BC SP 3/4\"X9M NTP 339.186/ASTM A706",
    materialDescription: "BC-1 SP ASTM A706 3/4\"X9.0",
    group: "NACIONAL SOLDABLE",
    diameterMm: 19.05,
    lengthM: 9,
  },
  {
    id: "sap_110300995",
    sapCode: "110300995",
    label: "1\" x 9m",
    metric: "1\"",
    length: "9m",
    quality: "A706",
    metricDisplay: "1\" X 9m A706",
    technicalDescription: "BC SP 1\"X9M NTP 339.186/ASTM A706",
    materialDescription: "BC SP 1\"X9M 339.186/ASTM A706",
    group: "NACIONAL SOLDABLE",
    diameterMm: 25.4,
    lengthM: 9,
  },
  {
    id: "sap_110500105",
    sapCode: "110500105",
    label: "8mm x 9m",
    metric: "8mm",
    length: "9m",
    quality: "A615",
    metricDisplay: "8mm X 9m A615",
    technicalDescription: "BC 8mmX9m IMP NTP 341.031/ASTM A615",
    materialDescription: "BC 8mmX9m IMP NTP 341.031/ASTM A615",
    group: "SEMI-TERMINADO",
    diameterMm: 8,
    lengthM: 9,
  },
  {
    id: "sap_110500106",
    sapCode: "110500106",
    label: "3/8\" x 9m",
    metric: "3/8\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "3/8\" X 9m A615",
    technicalDescription: "BC 3/8\"X9m IMP NTP 341.031/ASTM A615",
    materialDescription: "BC 3/8\"X9m IMP NTP 341.031/ASTM A615",
    group: "SEMI-TERMINADO",
    diameterMm: 9.525,
    lengthM: 9,
  },
  {
    id: "sap_110500110",
    sapCode: "110500110",
    label: "1/2\" x 9m",
    metric: "1/2\"",
    length: "9m",
    quality: "A615",
    metricDisplay: "1/2\" X 9m A615",
    technicalDescription: "BC 1/2\"X9m IMP NTP 341.031/ASTM A615",
    materialDescription: "BC 1/2\"X9m IMP NTP 341.031/ASTM A615",
    group: "SEMI-TERMINADO",
    diameterMm: 12.7,
    lengthM: 9,
  },
] as const;


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

  const mmMatch = cleaned.match(/^(\d+(?:[.,]\d+)?)\s*mm\b/i);
  if (mmMatch) {
    const diameterMm = parseFloat(mmMatch[1].replace(',', '.'));
    const lenMatch = cleaned.match(/x\s*(\d+(?:[.,]\d+)?)\s*m\b/i);
    return {
      diameterMm,
      lengthM: lenMatch ? parseFloat(lenMatch[1].replace(',', '.')) : 0,
      parsed: true,
    };
  }

  const parts = cleaned.split(/\s*x\s*/i);
  const diameterPart = parts[0]?.trim() || '';
  const lengthPart = parts[1]?.trim() || '';

  let diameterMm = 12.0;
  let parsed = false;

  const mmInside = diameterPart.match(/(\d+(?:[.,]\d+)?)\s*mm/i);
  if (mmInside) {
    diameterMm = parseFloat(mmInside[1].replace(',', '.'));
    parsed = true;
  } else {
    const mixedInchMatch = diameterPart.match(/^(\d+)[-\s]+(\d+)\s*\/\s*(\d+)(?:["'”]|in)?$/);
    if (mixedInchMatch) {
      const whole = parseFloat(mixedInchMatch[1]);
      const num = parseFloat(mixedInchMatch[2]);
      const den = parseFloat(mixedInchMatch[3]);
      diameterMm = (whole + num / den) * INCH_TO_MM;
      parsed = true;
    } else {
      const fracInchMatch = diameterPart.match(/^(\d+)\s*\/\s*(\d+)(?:["'”]|in)?$/);
      if (fracInchMatch) {
        const num = parseFloat(fracInchMatch[1]);
        const den = parseFloat(fracInchMatch[2]);
        diameterMm = (num / den) * INCH_TO_MM;
        parsed = true;
      } else {
        const decimalInchMatch = diameterPart.match(/^(\d+)\.(\d+)\s*\/\s*(\d+)(?:["'”]|in)?$/);
        if (decimalInchMatch) {
          const whole = parseFloat(decimalInchMatch[1]);
          const num = parseFloat(decimalInchMatch[2]);
          const den = parseFloat(decimalInchMatch[3]);
          diameterMm = (whole + num / den) * INCH_TO_MM;
          parsed = true;
        } else {
          const wholeInchMatch = diameterPart.match(/^(\d+(?:[.,]\d+)?)(?:["'”]|in)\b/);
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
  const combined = `${label} ${techDesc ?? ''}`.toUpperCase();
  if (combined.includes('FEHAB') || combined.includes('FHAB') || combined.includes('FH ')) return 'FEHAB';
  if (combined.includes('FECOXI') || combined.includes('RECOX')) return 'FECOXI';
  if (combined.includes('EXPORT') || combined.includes('NB 732')) return 'EXPORTACIÓN';
  if (combined.includes('SOLDABLE') || combined.includes('A706') || combined.includes('339.186')) return 'NACIONAL SOLDABLE';
  if (combined.includes('SEMI') || combined.includes('SEMI-TERMINADO')) return 'SEMI-TERMINADO';
  if (combined.includes(' FM ') || combined.startsWith('FM') || combined.includes('BC FM')) return 'FM';
  if (combined.includes('IMPORT') || combined.includes('IMP') || combined.includes('BC GG')) return 'IMPORTADO';
  return 'NACIONAL';
}

export function inferTechnicalDescription(label: string, _group: ClassificationGroup = 'NACIONAL'): string {
  const cleaned = label.trim();
  return `BC ${cleaned} NTP 341.031/ASTM A615`;
}

export function createMeasureId(label: string, group?: ClassificationGroup): string {
  const cleanLabel = label
    .trim()
    .toLowerCase()
    .replace(/"/g, 'in')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (group && group !== 'NACIONAL') {
    return `${group.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${cleanLabel}`;
  }
  return cleanLabel;
}

export function buildMeasureItem(
  label: string,
  options?: {
    isCustom?: boolean;
    sapCode?: string;
    metric?: string;
    length?: string;
    quality?: string;
    metricDisplay?: string;
    technicalDescription?: string;
    materialDescription?: string;
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
  const sapCode = options?.sapCode || '';
  const metricDisplay = options?.metricDisplay || normalizedLabel;
  const materialDescription = options?.materialDescription || technicalDescription;

  return {
    id: sapCode ? `sap_${sapCode}` : createMeasureId(normalizedLabel, group),
    sapCode,
    label: normalizedLabel,
    metric: options?.metric || normalizedLabel,
    length: options?.length || (parsed.lengthM ? `${parsed.lengthM}m` : ''),
    quality: options?.quality || 'A615',
    metricDisplay,
    technicalDescription,
    materialDescription,
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
 * Flexible matcher so queries by SAP code, measure, group, metric display, or technical description match.
 */
export function matchesMeasureQuery(targetInput: MeasureItem | string, rawQuery: string): boolean {
  const query = normalizeSearchText(rawQuery);
  if (!query) return true;

  const targetLabel = typeof targetInput === 'string' ? targetInput : targetInput.label;
  const targetTech = typeof targetInput === 'string' ? '' : targetInput.technicalDescription;
  const targetGroup = typeof targetInput === 'string' ? '' : targetInput.group;
  const targetSap = typeof targetInput === 'string' ? '' : (targetInput.sapCode ?? '');
  const targetMaterial = typeof targetInput === 'string' ? '' : (targetInput.materialDescription ?? '');
  const targetMetricDisplay = typeof targetInput === 'string' ? '' : (targetInput.metricDisplay ?? '');
  const combined = `${targetLabel} ${targetTech} ${targetGroup} ${targetSap} ${targetMaterial} ${targetMetricDisplay}`.trim();

  const target = normalizeSearchText(combined);
  const compactTarget = target.replace(/\s+/g, '');
  const compactQuery = query.replace(/\s+/g, '');

  if (target.includes(query) || compactTarget.includes(compactQuery)) {
    return true;
  }

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
export const INITIAL_CATALOG: MeasureItem[] = sortCatalogMeasures([...SEED_CATALOG_DEFINITIONS]);

/**
 * Realistic initial distribution across the 4 warehouses
 * populated with standard measures from the official catalog.
 */
export const INITIAL_WAREHOUSE_STOCK: WarehouseStockMap = {
  PT_08: ['sap_110000257', 'sap_110000274', 'sap_110000276', 'sap_110000277'],
  PT_09: ['sap_110000286', 'sap_110000287', 'sap_110000271', 'sap_110000280'],
  PT_15_BAHIA: ['sap_110000255', 'sap_110000263', 'sap_110500143', 'sap_110500144'],
  PT_15_CURVA: ['sap_110000267', 'sap_110000517', 'sap_110000279', 'sap_110300521'],
};
