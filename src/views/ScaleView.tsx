import { useMemo, useState } from 'react';
import { CheckCircle2, Filter, Lock, Monitor, Radio, Search, X } from 'lucide-react';
import { ThicknessIndicator } from '../components/ThicknessIndicator/ThicknessIndicator';
import { useStock } from '../context/StockContext';
import { MeasureItem } from '../types/stock';
import { matchesMeasureQuery, WAREHOUSES } from '../utils/measures';
import { formatTimeShort, getShiftOption } from '../utils/shifts';

const QUICK_FILTER_CHIPS = ['6 mm', '8 mm', '3/8', '12 mm', '1/2', '5/8', '3/4', '1"'] as const;

export function ScaleView() {
  const { state, catalogMap, recentPulse, dismissPulse } = useStock();
  const [searchQuery, setSearchQuery] = useState('');
  const [hideNonMatchingColumns, setHideNonMatchingColumns] = useState(false);

  const hasQuery = searchQuery.trim().length > 0;
  const shiftInfo = getShiftOption(state.shift);

  const warehouseMatchSummary = useMemo(() => {
    const map = new Map<
      string,
      {
        allMeasures: MeasureItem[];
        matchingIds: Set<string>;
      }
    >();

    for (const wh of WAREHOUSES) {
      const measures = state.warehouses[wh.id]
        .map((id) => catalogMap.get(id))
        .filter((item): item is MeasureItem => Boolean(item));

      const matchingIds = new Set(
        hasQuery
          ? measures.filter((m) => matchesMeasureQuery(m.label, searchQuery)).map((m) => m.id)
          : []
      );

      map.set(wh.id, { allMeasures: measures, matchingIds });
    }
    return map;
  }, [state.warehouses, catalogMap, hasQuery, searchQuery]);

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
    <main className="flex-1 bg-surface-panel">
      <div className="animate-page-enter mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Cabecera de Monitor Balanza (100% Solo Lectura) */}
        <section
          aria-label="Monitor de balanza en tiempo real"
          className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sider-red/30 bg-sider-red-soft px-3.5 py-1 text-xs font-extrabold tracking-wide text-sider-red uppercase">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  Solo Lectura · Monitor Balanza
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-600" aria-hidden="true" />
                  Sincronizado en vivo
                </span>
                <span className="rounded-md bg-gerdau-soft px-2.5 py-1 text-xs font-bold text-gerdau">
                  {shiftInfo.label}
                </span>
              </div>

              <h1 className="mt-2.5 flex items-center gap-2.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
                <Monitor className="h-6 w-6 shrink-0 text-sider-red" aria-hidden="true" />
                Disponibilidad de Stock por Almacén
              </h1>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Vista no modificable para consulta de picking SAP · Última actualización:{' '}
                <strong className="font-mono text-slate-900">
                  {formatTimeShort(state.lastUpdatedAt)}
                </strong>
                {state.lastVerifiedAt && (
                  <>
                    {' '}
                    · Verificado por Despacho:{' '}
                    <strong className="font-mono text-emerald-700">
                      {formatTimeShort(state.lastVerifiedAt)}
                    </strong>
                  </>
                )}
              </p>
            </div>

            {/* Buscador Rápido de Picking SAP */}
            <div className="w-full lg:max-w-lg">
              <label htmlFor="balanza-search" className="sr-only">
                Buscar medida del picking SAP
              </label>
              <div className="relative flex items-center">
                <Search
                  className="pointer-events-none absolute left-3.5 h-5 w-5 text-gerdau"
                  aria-hidden="true"
                />
                <input
                  id="balanza-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Buscar medida SAP (ej: "1/2 x 9", "3/8 x 12", "8 mm")...'
                  className="w-full rounded-xl border-2 border-gerdau/25 bg-surface-panel py-3 pl-11 pr-10 font-mono text-sm font-semibold text-slate-900 placeholder:font-sans placeholder:font-medium placeholder:text-slate-400 focus:border-sider-red focus:bg-white focus:outline-none focus:ring-4 focus:ring-sider-amber/20"
                />
                {hasQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2.5 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-800"
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
                          ? 'bg-sider-red text-white shadow-sm'
                          : 'border border-surface-border bg-white text-slate-700 hover:border-gerdau hover:text-gerdau'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notificación en tiempo real cuando Despachador realiza un cambio */}
          {recentPulse && (
            <div
              role="status"
              className="animate-dropdown-enter mt-4 flex items-center justify-between gap-3 rounded-xl border-2 border-sider-amber bg-sider-amber-soft px-4 py-2.5 text-xs font-bold text-slate-900 sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>
                  {recentPulse.action === 'verify'
                    ? 'Stock verificado por Despacho'
                    : 'Actualización recibida desde Despacho en tiempo real'}
                  {recentPulse.affectedWarehouses.length > 0 &&
                    recentPulse.affectedWarehouses.length < 4 && (
                      <>
                        {' '}
                        ·{' '}
                        {WAREHOUSES.filter((w) =>
                          recentPulse.affectedWarehouses.includes(w.id)
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
                className="rounded p-1 text-slate-600 hover:bg-amber-200/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Banner de Resultado de Búsqueda */}
          {hasQuery && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gerdau/20 bg-gerdau-soft/70 px-4 py-3">
              <div className="text-xs sm:text-sm">
                {matchingWarehouseLabels.length > 0 ? (
                  <span className="font-semibold text-slate-800">
                    Medida <code className="font-mono font-bold text-gerdau">&ldquo;{searchQuery}&rdquo;</code>{' '}
                    disponible en:{' '}
                    <span className="font-extrabold text-sider-red">
                      {matchingWarehouseLabels.join('  ·  ')}
                    </span>
                  </span>
                ) : (
                  <span className="font-semibold text-sider-red">
                    No se encontraron almacenes con stock para &ldquo;{searchQuery}&rdquo;.
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setHideNonMatchingColumns((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                  hideNonMatchingColumns
                    ? 'border-gerdau bg-gerdau text-white'
                    : 'border-surface-border bg-white text-slate-700 hover:border-gerdau'
                }`}
              >
                <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                {hideNonMatchingColumns ? 'Mostrar los 4 almacenes' : 'Solo coincidencias'}
              </button>
            </div>
          )}
        </section>

        {/* Tablero de 4 Columnas Fijas (Solo Lectura) */}
        <section
          aria-label="Columnas de stock por almacén"
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {visibleWarehouses.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-base font-bold text-slate-800">
                Ningún almacén coincide con &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setHideNonMatchingColumns(false);
                }}
                className="mt-3 rounded-lg bg-gerdau px-4 py-2 text-xs font-bold text-white hover:bg-gerdau-light"
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
              const isPulsingColumn = recentPulse?.affectedWarehouses.includes(wh.id) ?? false;
              const isBlue = wh.accent === 'blue';

              return (
                <article
                  key={`${wh.id}-${isPulsingColumn ? recentPulse?.pulseKey : 'idle'}`}
                  className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isHighlightedColumn
                      ? 'border-2 border-sider-amber shadow-lg ring-4 ring-sider-amber/20'
                      : isDimmedColumn
                        ? 'border-surface-border opacity-45'
                        : isPulsingColumn
                          ? 'animate-stock-pulse border-sider-amber shadow-md'
                          : 'border-surface-border shadow-sm'
                  }`}
                >
                  {/* Cabecera fija del almacén */}
                  <header
                    className={`flex items-center justify-between px-4 py-3.5 text-white ${
                      isBlue ? 'bg-gerdau' : 'bg-sider-red'
                    }`}
                  >
                    <div>
                      <h2 className="text-lg font-extrabold tracking-wide">{wh.label}</h2>
                      <p className="text-[11px] font-medium text-white/80">{wh.zone}</p>
                    </div>
                    {isHighlightedColumn ? (
                      <span className="rounded-full bg-sider-amber px-2.5 py-1 text-xs font-extrabold text-slate-900">
                        {matchCount} {matchCount === 1 ? 'coincidencia' : 'coincidencias'}
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/15 px-2.5 py-1 font-mono text-xs font-bold text-sider-amber">
                        {info.allMeasures.length}
                      </span>
                    )}
                  </header>

                  {/* Subtítulo estático requerido */}
                  <div className="flex items-center justify-between border-b border-surface-border bg-surface-panel/80 px-4 py-2">
                    <h3 className="text-xs font-bold tracking-wide text-slate-700 uppercase">
                      Tipos de medida
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500">
                      Delgado → Grueso
                    </span>
                  </div>

                  {/* Tarjetas estáticas de solo lectura */}
                  <div className="flex-1 p-4">
                    {info.allMeasures.length === 0 ? (
                      <div className="flex h-full min-h-[150px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-surface-panel/50 p-4 text-center text-xs font-medium text-slate-500">
                        Sin medidas registradas en este almacén
                      </div>
                    ) : (
                      <ul className="space-y-2.5" aria-label={`Medidas en ${wh.label}`}>
                        {info.allMeasures.map((measure) => {
                          const isMatch = hasQuery && info.matchingIds.has(measure.id);
                          const isPulsingItem =
                            isPulsingColumn &&
                            (recentPulse?.affectedMeasureIds.length === 0 ||
                              recentPulse?.affectedMeasureIds.includes(measure.id));

                          return (
                            <li
                              key={`${measure.id}-${isPulsingItem ? recentPulse?.pulseKey : 'idle'}`}
                              className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition-all ${
                                isMatch
                                  ? 'border-sider-amber bg-sider-amber-soft shadow-sm ring-2 ring-sider-amber/50'
                                  : isPulsingItem
                                    ? 'animate-stock-pulse border-sider-amber bg-white'
                                    : hasQuery
                                      ? 'border-slate-200 bg-slate-50/70 opacity-60'
                                      : 'border-surface-border bg-surface-panel/50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <ThicknessIndicator
                                  diameterMm={measure.diameterMm}
                                  highlighted={isMatch}
                                />
                                <span
                                  className={`font-mono text-base font-bold tracking-tight ${
                                    isMatch ? 'text-sider-red' : 'text-slate-900'
                                  }`}
                                >
                                  {measure.label}
                                </span>
                              </div>

                              {isMatch ? (
                                <span className="rounded-md bg-sider-red px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase">
                                  Disponible
                                </span>
                              ) : (
                                <span className="rounded-md bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                  En stock
                                </span>
                              )}
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
