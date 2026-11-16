import { CheckCircle2, Clock, Lock, X } from 'lucide-react';
import { ConnectionDot } from '../components/ConnectionDot/ConnectionDot';
import { ThicknessIndicator } from '../components/ThicknessIndicator/ThicknessIndicator';
import { useStock } from '../context/StockContext';
import { MeasureItem } from '../types/stock';
import { WAREHOUSES } from '../utils/measures';
import { formatTime12h } from '../utils/shifts';

export function ScaleView() {
  const { state, catalogMap, isConnected, recentPulse, dismissPulse } = useStock();

  return (
    <main className="flex-1 bg-gradient-to-b from-[#FFF9F2] to-[#FFF1E0]">
      <div className="animate-page-enter mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Cabecera de Monitor Balanza (100% Solo Lectura · Liquid Glass) */}
        <section
          aria-label="Monitor de balanza en tiempo real"
          className="liquid-glass-card mb-6 p-4 shadow-md sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/90 bg-orange-100/80 px-3.5 py-1 text-xs font-extrabold tracking-wide text-orange-950 uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-sm">
                <Lock className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
                Solo Lectura · Monitor Balanza
              </span>
              <ConnectionDot connected={isConnected} />
            </div>

            <h1 className="sr-only">Monitor de Balanza</h1>
            <p className="flex flex-wrap items-center gap-2 text-xs text-slate-700 sm:text-sm">
              <Clock className="h-4 w-4 text-orange-600" aria-hidden="true" />
              <span>
                Última modificación:{' '}
                <strong className="font-mono text-sm font-extrabold text-orange-800 sm:text-base">
                  {formatTime12h(state.lastVerifiedAt)}
                </strong>
              </span>
            </p>
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
                    ? 'Medidas confirmadas por Despacho'
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
        </section>

        {/* Tablero de 4 Columnas Fijas (Solo Lectura con Código y Texto Completo de Medidas) */}
        <section
          aria-label="Columnas de stock por almacén"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {WAREHOUSES.map((wh) => {
            const measures = state.warehouses[wh.id]
              .map((id) => catalogMap.get(id))
              .filter((item): item is MeasureItem => Boolean(item));
            const isPulsingColumn = recentPulse?.affectedWarehouses?.includes(wh.id) ?? false;
            const isDarkOrange = wh.accent === 'blue';

            return (
              <article
                key={`${wh.id}-${isPulsingColumn ? recentPulse?.pulseKey : 'idle'}`}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isPulsingColumn
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
                    <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-black tracking-wider uppercase">
                      {wh.label}
                    </span>
                    <h2 className="text-base font-black tracking-tight">{wh.label}</h2>
                  </div>
                  <span className="rounded-full bg-white/20 px-2.5 py-1 font-mono text-xs font-bold text-orange-50">
                    {measures.length}
                  </span>
                </header>

                {/* Subtítulo de columna */}
                <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/75 px-4 py-2">
                    Tipos de medida
                  </h3>
                </div>

                {/* Tarjetas estáticas de solo lectura: DATOS OBLIGATORIOS (Código + Texto Completo) */}
                <div className="flex-1 p-4">
                  {measures.length === 0 ? (
                    <div className="flex h-full min-h-[150px] items-center justify-center rounded-xl border border-dashed border-orange-200 bg-orange-50/40 p-4 text-center text-xs font-medium text-slate-500">
                      Sin medidas asignadas
                    </div>
                  ) : (
                    <ul className="space-y-2.5" aria-label={`Medidas en ${wh.label}`}>
                      {measures.map((measure) => {
                        const affectedMeasureIds = recentPulse?.affectedMeasureIds ?? [];
                        const isPulsingItem =
                          isPulsingColumn &&
                          (affectedMeasureIds.length === 0 ||
                            affectedMeasureIds.includes(measure.id));

                        return (
                          <li
                            key={`${measure.id}-${isPulsingItem ? recentPulse?.pulseKey : 'idle'}`}
                            className={`flex flex-col gap-1.5 rounded-xl border p-3 transition-all ${
                              isPulsingItem
                                ? 'animate-stock-pulse border-orange-400 bg-white'
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
                            </div>

                            {/* Fila Principal: DESCRIPCIÓN TÉCNICA OFICIAL SAP */}
                            <div className="flex items-start gap-2.5 pt-1">
                              <div className="pt-1">
                                <ThicknessIndicator
                                  diameterMm={measure.diameterMm}
                                />
                              </div>
                              <p className="font-mono text-xs sm:text-sm font-bold leading-snug tracking-tight text-slate-900">
                                {measure.technicalDescription}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
