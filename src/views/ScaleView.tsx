import { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Filter, Layers, Lock, Search, X } from 'lucide-react';
import { ConnectionDot } from '../components/ConnectionDot/ConnectionDot';
import { ThicknessIndicator } from '../components/ThicknessIndicator/ThicknessIndicator';
import { useStock } from '../context/StockContext';
import { ClassificationGroup, MeasureItem } from '../types/stock';
import { CLASSIFICATION_GROUPS, matchesMeasureQuery, WAREHOUSES } from '../utils/measures';
import { formatTime12h } from '../utils/shifts';

const QUICK_FILTER_CHIPS = ['6 mm', '8 mm', '3/8', '12 mm', '1/2', '5/8', '3/4', '1"'] as const;

export function ScaleView() {
  const { state, catalogMap, isConnected, recentPulse, dismissPulse } = useStock();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<ClassificationGroup | 'ALL'>('ALL');
  const [hideNonMatchingColumns, setHideNonMatchingColumns] = useState(false);

  const hasQuery = searchQuery.trim().length > 0;

  const warehouseMatchSummary = useMemo(() => {
    const map = new Map<
      string,
      {
        allMeasures: MeasureItem[];
        matchingIds: Set<string>;
      }
    >();

    for (const wh of WAREHOUSES) {
      const rawMeasures = state.warehouses[wh.id]
        .map((id) => catalogMap.get(id))
        .filter((item): item is MeasureItem => Boolean(item));

      // Filtro por grupo de clasificación si no es 'ALL'
      const groupScopedMeasures =
        selectedGroup === 'ALL'
          ? rawMeasures
          : rawMeasures.filter((m) => m.group === selectedGroup);

      const matchingIds = new Set(
        hasQuery
          ? groupScopedMeasures
              .filter((m) => matchesMeasureQuery(m, searchQuery))
              .map((m) => m.id)
          : []
      );

      map.set(wh.id, { allMeasures: groupScopedMeasures, matchingIds });
    }
    return map;
  }, [state.warehouses, catalogMap, selectedGroup, hasQuery, searchQuery]);

  const matchingWarehouseLabels = useMemo(() => {
    if (!hasQuery) return [];
    return WAREHOUSES.filter(
      (wh) => (warehouseMatchSummary.get(wh.id)?.matchingIds.size ?? 0) > 0
    ).map((wh) => wh.label);
  }, [hasQuery, warehouseMatchSummary]);

  const visibleWarehouses = useMemo(() => {
    if (!hasQuery || !hideNonMatchingColumns) return WAREHOUSES;
    return WAREHOUSES.filter(
      (wh) => (warehouseMatchSummary.get(wh.id)?.matchingIds.size ?? 0) > 0
    );
  }, [hasQuery, hideNonMatchingColumns, warehouseMatchSummary]);

  return (
    <main className="flex-1 bg-gradient-to-b from-[#FFF9F2] to-[#FFF1E0]">
      <div className="animate-page-enter mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Cabecera de Monitor Balanza (100% Solo Lectura) */}
        <section
          aria-label="Monitor de balanza en tiempo real"
          className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-100 px-3.5 py-1 text-xs font-extrabold tracking-wide text-orange-900 uppercase">
                  <Lock className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
                  Solo Lectura · Monitor Balanza
                </span>
                <ConnectionDot connected={isConnected} />
              </div>

              <h1 className="sr-only">Monitor de Balanza</h1>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-700 sm:text-sm">
                <Clock className="h-4 w-4 text-orange-600" aria-hidden="true" />
                <span>
                  Última modificación:{' '}
                  <strong className="font-mono text-sm font-extrabold text-orange-800 sm:text-base">
                    {formatTime12h(state.lastVerifiedAt)}
                  </strong>
                </span>
              </p>
            </div>

            {/* Buscador Rápido */}
            <div className="w-full lg:max-w-lg">
              <label htmlFor="balanza-search" className="sr-only">
                Buscar medida
              </label>
              <div className="relative flex items-center">
                <Search
                  className="pointer-events-none absolute left-3.5 h-5 w-5 text-orange-600"
                  aria-hidden="true"
                />
                <input
                  id="balanza-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar medida..."
                  className="w-full rounded-xl border-2 border-orange-200 bg-orange-50/40 py-3 pl-11 pr-10 font-mono text-sm font-semibold text-slate-900 placeholder:font-sans placeholder:font-medium placeholder:text-slate-400 focus:border-orange-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-400/25"
                />
                {hasQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2.5 rounded-lg p-1 text-slate-400 transition-colors hover:bg-orange-100 hover:text-orange-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Chips de acceso rápido por diámetro */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[11px] font-semibold text-slate-500">Filtro rápido:</span>
                {QUICK_FILTER_CHIPS.map((chip) => {
                  const active = searchQuery.trim().toLowerCase() === chip.toLowerCase();
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSearchQuery(active ? '' : chip)}
                      className={`rounded-md px-2 py-1 font-mono text-[11px] font-bold transition-all ${
                        active
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'border border-orange-200 bg-orange-50/70 text-orange-900 hover:border-orange-400 hover:bg-orange-100'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filtro por los 8 Grupos de Clasificación en Balanza */}
          <div className="mt-4 border-t border-orange-100 pt-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-2 flex items-center gap-1 text-[11px] font-bold tracking-wide text-slate-600 uppercase">
                <Layers className="h-3 w-3 text-orange-600" />
                Grupos:
              </span>
              <button
                type="button"
                onClick={() => setSelectedGroup('ALL')}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                  selectedGroup === 'ALL'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'border border-orange-200 bg-orange-50/60 text-slate-700 hover:bg-orange-100'
                }`}
              >
                Todos
              </button>
              {CLASSIFICATION_GROUPS.map((g) => {
                const isActive = selectedGroup === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGroup(isActive ? 'ALL' : g)}
                    className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'border border-orange-200 bg-orange-50/60 text-slate-700 hover:bg-orange-100'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notificación en tiempo real cuando Despachador confirma un cambio */}
          {recentPulse && (
            <div
              role="status"
              className="animate-dropdown-enter mt-4 flex items-center justify-between gap-3 rounded-xl border-2 border-orange-400 bg-orange-100/80 px-4 py-2.5 text-xs font-bold text-orange-950 sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
                <span>
                  {recentPulse.action === 'verify'
                    ? 'Stock confirmado por Despacho'
                    : 'Actualización recibida desde Despacho en tiempo real'}
                  {(recentPulse.affectedWarehouses?.length ?? 0) > 0 &&
                    (recentPulse.affectedWarehouses?.length ?? 0) < 4 && (
                      <>
                        {' '}
                        ·{' '}
                        {WAREHOUSES.filter((w) =>
                          recentPulse.affectedWarehouses?.includes(w.id)
                        )
                          .map((w) => w.label)
                          .join(', ')}
                      </>
                    )}
                </span>
              </div>
              <button
                type="button"
                onClick={dismissPulse}
                aria-label="Cerrar notificación"
                className="rounded p-1 text-orange-800 hover:bg-orange-200/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Banner de Resultado de Búsqueda */}
          {hasQuery && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-300 bg-orange-100/70 px-4 py-3">
              <div className="text-xs sm:text-sm">
                {matchingWarehouseLabels.length > 0 ? (
                  <span className="font-semibold text-slate-800">
                    Medida{' '}
                    <code className="font-mono font-bold text-orange-900">&ldquo;{searchQuery}&rdquo;</code>{' '}
                    disponible en:{' '}
                    <span className="font-extrabold text-orange-700">
                      {matchingWarehouseLabels.join('  ·  ')}
                    </span>
                  </span>
                ) : (
                  <span className="font-semibold text-orange-800">
                    No se encontraron almacenes con stock para &ldquo;{searchQuery}&rdquo;.
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setHideNonMatchingColumns((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                  hideNonMatchingColumns
                    ? 'border-orange-600 bg-orange-600 text-white'
                    : 'border-orange-300 bg-white text-orange-900 hover:border-orange-500'
                }`}
              >
                <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                {hideNonMatchingColumns ? 'Mostrar los 4 almacenes' : 'Solo coincidencias'}
              </button>
            </div>
          )}
        </section>

        {/* Tablero de 4 Columnas Fijas (Solo Lectura con Código y Texto Completo de Medidas) */}
        <section
          aria-label="Columnas de stock por almacén"
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {visibleWarehouses.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-orange-300 bg-white p-10 text-center">
              <p className="text-base font-bold text-slate-800">
                Ningún almacén coincide con &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setHideNonMatchingColumns(false);
                }}
                className="mt-3 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700"
              >
                Ver todos los almacenes
              </button>
            </div>
          ) : (
            visibleWarehouses.map((wh) => {
              const info = warehouseMatchSummary.get(wh.id)!;
              const matchCount = info.matchingIds.size;
              const isHighlightedColumn = hasQuery && matchCount > 0;
              const isDimmedColumn = hasQuery && matchCount === 0;
              const isPulsingColumn = recentPulse?.affectedWarehouses?.includes(wh.id) ?? false;
              const isDarkOrange = wh.accent === 'blue';

              return (
                <article
                  key={`${wh.id}-${isPulsingColumn ? recentPulse?.pulseKey : 'idle'}`}
                  className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isHighlightedColumn
                      ? 'border-2 border-orange-500 shadow-lg ring-4 ring-orange-400/25'
                      : isDimmedColumn
                        ? 'border-orange-200 opacity-45'
                        : isPulsingColumn
                          ? 'animate-stock-pulse border-orange-400 shadow-md'
                          : 'border-orange-200 shadow-sm'
                  }`}
                >
                  {/* Cabecera fija del almacén con código en naranja / naranja oscuro */}
                  <header
                    className={`flex items-center justify-between px-4 py-3.5 text-white ${
                      isDarkOrange ? 'bg-orange-700' : 'bg-orange-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold tracking-wide">{wh.label}</h2>
                    </div>
                    {isHighlightedColumn ? (
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-extrabold text-orange-950">
                        {matchCount} {matchCount === 1 ? 'coincidencia' : 'coincidencias'}
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/20 px-2.5 py-1 font-mono text-xs font-bold text-orange-50">
                        {info.allMeasures.length}
                      </span>
                    )}
                  </header>

                  {/* Subtítulo de columna */}
                  <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/75 px-4 py-2">
                    <h3 className="text-xs font-bold tracking-wide text-orange-950 uppercase">
                      Tipos de medida
                    </h3>
                  </div>

                  {/* Tarjetas estáticas de solo lectura: DATOS OBLIGATORIOS (Código + Texto Completo) */}
                  <div className="flex-1 p-4">
                    {info.allMeasures.length === 0 ? (
                      <div className="flex h-full min-h-[150px] items-center justify-center rounded-xl border border-dashed border-orange-200 bg-orange-50/40 p-4 text-center text-xs font-medium text-slate-500">
                        {selectedGroup !== 'ALL'
                          ? `Sin medidas en ${selectedGroup}`
                          : 'Sin medidas registradas en este almacén'}
                      </div>
                    ) : (
                      <ul className="space-y-2.5" aria-label={`Medidas en ${wh.label}`}>
                        {info.allMeasures.map((measure) => {
                          const isMatch = hasQuery && info.matchingIds.has(measure.id);
                          const affectedMeasureIds = recentPulse?.affectedMeasureIds ?? [];
                          const isPulsingItem =
                            isPulsingColumn &&
                            (affectedMeasureIds.length === 0 ||
                              affectedMeasureIds.includes(measure.id));

                          return (
                            <li
                              key={`${measure.id}-${isPulsingItem ? recentPulse?.pulseKey : 'idle'}`}
                              className={`flex flex-col gap-1.5 rounded-xl border p-3 transition-all ${
                                isMatch
                                  ? 'border-orange-500 bg-orange-100 shadow-sm ring-2 ring-orange-400/50'
                                  : isPulsingItem
                                    ? 'animate-stock-pulse border-orange-400 bg-white'
                                    : hasQuery
                                      ? 'border-orange-100 bg-orange-50/30 opacity-60'
                                      : 'border-orange-200/80 bg-orange-50/50'
                              }`}
                            >
                              {/* Fila Superior: 1. CÓDIGO primero (negrita, mediano), 2. Clasificación */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* CÓDIGO PRIMERO (Negrita, tamaño mediano) */}
                                  {measure.sapCode && (
                                    <span className="rounded-md bg-white px-2.5 py-1 font-mono text-sm sm:text-base font-black text-slate-900 shadow-2xs border border-orange-200">
                                      CÓDIGO: {measure.sapCode}
                                    </span>
                                  )}
                                  {/* CLASIFICACIÓN */}
                                  <span className="rounded-md bg-orange-100/90 px-2 py-0.5 text-xs font-bold uppercase text-orange-900 border border-orange-200/80">
                                    {measure.group}
                                  </span>
                                </div>

                                {isMatch && (
                                  <span className="rounded-md bg-orange-600 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase">
                                    Coincide
                                  </span>
                                )}
                              </div>

                              {/* Fila Principal: DESCRIPCIÓN TÉCNICA OFICIAL SAP */}
                              <div className="flex items-start gap-2.5 pt-1">
                                <div className="pt-1">
                                  <ThicknessIndicator
                                    diameterMm={measure.diameterMm}
                                    highlighted={isMatch}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div
                                    className={`font-mono text-sm font-bold tracking-tight leading-snug sm:text-base ${
                                      isMatch ? 'text-orange-900 font-extrabold' : 'text-slate-900'
                                    }`}
                                  >
                                    {measure.technicalDescription}
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
