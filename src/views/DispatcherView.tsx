import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Edit3,
  Plus,
  RefreshCw,
  RotateCcw,
  Ruler,
  Trash2,
} from 'lucide-react';
import { CustomMeasureModal } from '../components/CustomMeasureModal/CustomMeasureModal';
import { MeasureDropdown } from '../components/MeasureDropdown/MeasureDropdown';
import { ShiftSelectorDropdown } from '../components/ShiftSelectorDropdown/ShiftSelectorDropdown';
import { useStock } from '../context/StockContext';
import { WarehouseId } from '../types/stock';
import { WAREHOUSES } from '../utils/measures';
import { formatTimeShort } from '../utils/shifts';

export function DispatcherView() {
  const {
    state,
    addMeasureToWarehouse,
    replaceMeasureInWarehouse,
    removeMeasureFromWarehouse,
    clearWarehouse,
    addCustomCatalogMeasure,
    setShift,
    verifyStock,
    resetDemoStock,
  } = useStock();

  const [pendingSlotWarehouse, setPendingSlotWarehouse] = useState<WarehouseId | null>(null);
  const [customModalWarehouse, setCustomModalWarehouse] = useState<WarehouseId | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!feedbackMessage) return;
    const t = window.setTimeout(() => setFeedbackMessage(null), 3200);
    return () => window.clearTimeout(t);
  }, [feedbackMessage]);

  useEffect(() => {
    if (!confirmReset) return;
    const t = window.setTimeout(() => setConfirmReset(false), 4000);
    return () => window.clearTimeout(t);
  }, [confirmReset]);

  const handleVerifyStock = () => {
    verifyStock();
    setFeedbackMessage('Stock verificado y sincronizado en tiempo real con Balanza.');
  };

  const openCustomModal = (warehouseId?: WarehouseId) => {
    setCustomModalWarehouse(warehouseId ?? null);
    setIsCustomModalOpen(true);
  };

  return (
    <main className="flex-1 bg-surface-panel">
      <div className="animate-page-enter mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Barra de Estado y Controles del Despachador */}
        <section
          aria-label="Controles del despachador"
          className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gerdau/25 bg-gerdau-soft px-3.5 py-1 text-xs font-extrabold tracking-wide text-gerdau uppercase">
                  <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                  Modo Edición - Despachador
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Guardado automático activo
                </span>
              </div>

              <h1 className="mt-2.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
                Gestión de Medidas Disponibles por Almacén
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-600 sm:text-sm">
                <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <span>
                  Último cambio:{' '}
                  <strong className="font-mono text-slate-800">
                    {formatTimeShort(state.lastUpdatedAt)}
                  </strong>
                </span>
                {state.lastVerifiedAt && (
                  <>
                    <span>· Verificado:</span>
                    <strong className="font-mono text-emerald-700">
                      {formatTimeShort(state.lastVerifiedAt)}
                    </strong>
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <ShiftSelectorDropdown shift={state.shift} onChange={setShift} />

              <button
                type="button"
                onClick={() => openCustomModal()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gerdau/30 bg-white px-3.5 py-2 text-xs font-bold text-gerdau shadow-sm transition-colors hover:bg-gerdau-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau sm:text-sm"
              >
                <Ruler className="h-4 w-4" aria-hidden="true" />
                Nueva medida
              </button>

              <button
                type="button"
                onClick={handleVerifyStock}
                className="inline-flex items-center gap-2 rounded-lg bg-sider-red px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-sider-red-dark active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sider-red focus-visible:ring-offset-2 sm:text-sm"
              >
                <RefreshCw className="h-4 w-4 text-sider-amber" aria-hidden="true" />
                Verificar / Actualizar Stock
              </button>

              {confirmReset ? (
                <button
                  type="button"
                  onClick={() => {
                    resetDemoStock();
                    setConfirmReset(false);
                    setFeedbackMessage('Stock restablecido al catálogo inicial.');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sider-red bg-sider-red-soft px-3 py-2 text-xs font-bold text-sider-red transition-colors hover:bg-sider-red hover:text-white"
                >
                  ¿Confirmar reinicio?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  title="Restablecer ejemplo inicial"
                  aria-label="Restablecer ejemplo inicial"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-panel px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Restablecer</span>
                </button>
              )}
            </div>
          </div>

          {feedbackMessage && (
            <div
              role="status"
              className="animate-dropdown-enter mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 sm:text-sm"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              {feedbackMessage}
            </div>
          )}
        </section>

        {/* Tablero de 4 Columnas Fijas (Cabeceras NO Modificables) */}
        <section
          aria-label="Tablero editable de almacenes"
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {WAREHOUSES.map((wh) => {
            const assignedIds = state.warehouses[wh.id];
            const isPendingHere = pendingSlotWarehouse === wh.id;
            const remainingCatalogCount = state.catalog.length - assignedIds.length;
            const isBlue = wh.accent === 'blue';

            return (
              <article
                key={wh.id}
                className="flex flex-col rounded-2xl border border-surface-border bg-white shadow-sm"
              >
                {/* Cabecera fija no modificable */}
                <header
                  className={`flex items-center justify-between rounded-t-2xl px-4 py-3.5 text-white ${
                    isBlue ? 'bg-gerdau' : 'bg-sider-red'
                  }`}
                >
                  <div>
                    <h2 className="text-lg font-extrabold tracking-wide">{wh.label}</h2>
                    <p className="text-[11px] font-medium text-white/80">{wh.zone}</p>
                  </div>
                  <span className="rounded-full bg-white/15 px-2.5 py-1 font-mono text-xs font-bold text-sider-amber">
                    {assignedIds.length}
                  </span>
                </header>

                {/* Barra de subinfo */}
                <div className="flex items-center justify-between border-b border-surface-border bg-surface-panel/80 px-4 py-2 text-[11px] font-semibold text-slate-600">
                  <span>Tipos de medida (delgado → grueso)</span>
                  {assignedIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => clearWarehouse(wh.id)}
                      className="text-slate-500 underline-offset-2 transition-colors hover:text-sider-red hover:underline"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Ranuras editables */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  {assignedIds.length === 0 && !isPendingHere ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-surface-panel/50 px-4 py-8 text-center">
                      <p className="text-sm font-semibold text-slate-600">
                        Sin medidas asignadas
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Usa &ldquo;+ Agregar medida&rdquo; para habilitar productos en {wh.label}.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assignedIds.map((measureId) => (
                        <div
                          key={measureId}
                          className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-panel/60 p-2"
                        >
                          <div className="min-w-0 flex-1">
                            <MeasureDropdown
                              catalog={state.catalog}
                              selectedMeasureId={measureId}
                              usedMeasureIdsInColumn={assignedIds}
                              variant={isBlue ? 'blue' : 'red'}
                              onSelect={(newId) =>
                                replaceMeasureInWarehouse(wh.id, measureId, newId)
                              }
                              onRequestCustomMeasure={() => openCustomModal(wh.id)}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeMeasureFromWarehouse(wh.id, measureId)}
                            title="Eliminar / Producto agotado"
                            aria-label={`Quitar medida de ${wh.label}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-white text-slate-500 transition-colors hover:border-sider-red/40 hover:bg-sider-red-soft hover:text-sider-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sider-red"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}

                      {isPendingHere && (
                        <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-sider-amber bg-sider-amber-soft/50 p-2">
                          <div className="min-w-0 flex-1">
                            <MeasureDropdown
                              catalog={state.catalog}
                              selectedMeasureId={null}
                              usedMeasureIdsInColumn={assignedIds}
                              variant={isBlue ? 'blue' : 'red'}
                              placeholder="Elegir medida..."
                              autoOpen
                              onSelect={(newId) => {
                                addMeasureToWarehouse(wh.id, newId);
                                setPendingSlotWarehouse(null);
                              }}
                              onRequestCustomMeasure={() => {
                                setPendingSlotWarehouse(null);
                                openCustomModal(wh.id);
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setPendingSlotWarehouse(null)}
                            title="Cancelar casilla"
                            aria-label="Cancelar nueva casilla"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Botón + Agregar medida */}
                  <div className="mt-auto pt-2">
                    <button
                      type="button"
                      disabled={remainingCatalogCount <= 0}
                      onClick={() => setPendingSlotWarehouse(wh.id)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 py-2.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:text-sm ${
                        remainingCatalogCount <= 0
                          ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                          : isBlue
                            ? 'border-gerdau/35 bg-gerdau-soft/40 text-gerdau hover:border-gerdau hover:bg-gerdau-soft focus-visible:ring-gerdau'
                            : 'border-sider-red/35 bg-sider-red-soft/40 text-sider-red hover:border-sider-red hover:bg-sider-red-soft focus-visible:ring-sider-red'
                      }`}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      {remainingCatalogCount <= 0
                        ? 'Catálogo completo asignado'
                        : 'Agregar medida'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      <CustomMeasureModal
        isOpen={isCustomModalOpen}
        defaultWarehouseId={customModalWarehouse}
        onClose={() => setIsCustomModalOpen(false)}
        onCreate={(label, options) => {
          const result = addCustomCatalogMeasure(label, options);
          if (result.ok && result.measure) {
            setFeedbackMessage(`Medida "${result.measure.label}" agregada al catálogo en orden.`);
          }
          return result;
        }}
      />
    </main>
  );
}
