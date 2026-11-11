import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Edit3,
  Plus,
  RotateCcw,
  Ruler,
  Trash2,
} from 'lucide-react';
import { CustomMeasureModal } from '../components/CustomMeasureModal/CustomMeasureModal';
import { MeasureDropdown } from '../components/MeasureDropdown/MeasureDropdown';
import { ShiftSelectorDropdown } from '../components/ShiftSelectorDropdown/ShiftSelectorDropdown';
import { useStock } from '../context/StockContext';
import { MeasureItem, ShiftCode, WarehouseId, WarehouseStockMap } from '../types/stock';
import {
  buildMeasureItem,
  sortCatalogMeasures,
  sortMeasureIdsByCatalog,
  WAREHOUSES,
} from '../utils/measures';
import { formatTime12h } from '../utils/shifts';

export function DispatcherView() {
  const { state, confirmStockChanges, resetDemoStock } = useStock();

  // Borrador editable en Despachador: los cambios se guardan y envían a Balanza al confirmar
  const [draftCatalog, setDraftCatalog] = useState<MeasureItem[]>(() => state.catalog);
  const [draftWarehouses, setDraftWarehouses] = useState<WarehouseStockMap>(() => state.warehouses);
  const [draftShift, setDraftShift] = useState<ShiftCode>(() => state.shift);
  const lastStateRevisionRef = useRef(state.revision);

  // Reloj en tiempo real para "Hora de modificación"
  const [liveNow, setLiveNow] = useState<Date>(() => new Date());

  const [pendingSlotWarehouse, setPendingSlotWarehouse] = useState<WarehouseId | null>(null);
  const [customModalWarehouse, setCustomModalWarehouse] = useState<WarehouseId | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    if (draftShift !== state.shift) return true;
    if (draftCatalog.length !== state.catalog.length) return true;
    if (draftCatalog.some((m, i) => state.catalog[i]?.id !== m.id)) return true;
    return WAREHOUSES.some((wh) => {
      const a = draftWarehouses[wh.id];
      const b = state.warehouses[wh.id];
      return a.length !== b.length || a.some((id, idx) => b[idx] !== id);
    });
  }, [draftCatalog, draftShift, draftWarehouses, state.catalog, state.shift, state.warehouses]);

  useEffect(() => {
    if (state.revision !== lastStateRevisionRef.current) {
      lastStateRevisionRef.current = state.revision;
      setDraftCatalog(state.catalog);
      setDraftWarehouses(state.warehouses);
      setDraftShift(state.shift);
    }
  }, [state.catalog, state.revision, state.shift, state.warehouses]);

  useEffect(() => {
    if (!feedbackMessage) return;
    const t = window.setTimeout(() => setFeedbackMessage(null), 3500);
    return () => window.clearTimeout(t);
  }, [feedbackMessage]);

  useEffect(() => {
    if (!confirmReset) return;
    const t = window.setTimeout(() => setConfirmReset(false), 4000);
    return () => window.clearTimeout(t);
  }, [confirmReset]);

  const draftCatalogMap = useMemo(
    () => new Map<string, MeasureItem>(draftCatalog.map((m) => [m.id, m])),
    [draftCatalog]
  );

  const handleAddMeasure = (warehouseId: WarehouseId, measureId: string) => {
    setDraftWarehouses((prev) => ({
      ...prev,
      [warehouseId]: sortMeasureIdsByCatalog([...prev[warehouseId], measureId], draftCatalogMap),
    }));
  };

  const handleReplaceMeasure = (
    warehouseId: WarehouseId,
    oldMeasureId: string,
    newMeasureId: string
  ) => {
    if (oldMeasureId === newMeasureId) return;
    setDraftWarehouses((prev) => {
      const filtered = prev[warehouseId].filter((id) => id !== oldMeasureId);
      return {
        ...prev,
        [warehouseId]: sortMeasureIdsByCatalog([...filtered, newMeasureId], draftCatalogMap),
      };
    });
  };

  const handleRemoveMeasure = (warehouseId: WarehouseId, measureId: string) => {
    setDraftWarehouses((prev) => ({
      ...prev,
      [warehouseId]: prev[warehouseId].filter((id) => id !== measureId),
    }));
  };

  const handleClearWarehouse = (warehouseId: WarehouseId) => {
    setDraftWarehouses((prev) => ({
      ...prev,
      [warehouseId]: [],
    }));
  };

  const handleCreateCustomMeasure = (
    label: string,
    options?: { overrideDiameterMm?: number; overrideLengthM?: number; autoAssignTo?: WarehouseId }
  ): { ok: boolean; error?: string; measure?: MeasureItem } => {
    const trimmed = label.trim().replace(/\s+/g, ' ');
    if (!trimmed) {
      return { ok: false, error: 'Ingresa el nombre de la medida (ej: 1 3/8" x 12 m o 16 mm).' };
    }

    const newMeasure = buildMeasureItem(trimmed, {
      isCustom: true,
      overrideDiameterMm: options?.overrideDiameterMm,
      overrideLengthM: options?.overrideLengthM,
    });

    const duplicate = draftCatalog.find(
      (m) => m.id === newMeasure.id || m.label.toLowerCase() === newMeasure.label.toLowerCase()
    );
    if (duplicate) {
      return {
        ok: false,
        error: `La medida "${duplicate.label}" ya existe en el catálogo.`,
      };
    }

    const nextCatalog = sortCatalogMeasures([...draftCatalog, newMeasure]);
    const nextMap = new Map<string, MeasureItem>(nextCatalog.map((m) => [m.id, m]));
    setDraftCatalog(nextCatalog);

    if (options?.autoAssignTo) {
      const targetWh = options.autoAssignTo;
      setDraftWarehouses((prev) => ({
        ...prev,
        [targetWh]: sortMeasureIdsByCatalog([...prev[targetWh], newMeasure.id], nextMap),
      }));
    }

    setFeedbackMessage(
      `Medida "${newMeasure.label}" agregada. Presiona Confirmado / Verificado para enviar a Balanza.`
    );
    return { ok: true, measure: newMeasure };
  };

  const handleConfirmChanges = () => {
    const confirmedIso = confirmStockChanges({
      catalog: draftCatalog,
      warehouses: draftWarehouses,
      shift: draftShift,
    });
    setPendingSlotWarehouse(null);
    setFeedbackMessage(
      `Cambios guardados y confirmados hacia Balanza (${formatTime12h(confirmedIso)}).`
    );
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
                {hasUnsavedChanges ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sider-amber-soft px-3 py-1 text-xs font-bold text-amber-900">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-sider-amber" />
                    Cambios sin confirmar
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Sincronizado con Balanza
                  </span>
                )}
              </div>

              <h1 className="mt-2.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
                Gestión de Medidas Disponibles por Almacén
              </h1>

              {/* Reloj en tiempo real */}
              <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-700 sm:text-sm">
                <Clock className="h-4 w-4 text-gerdau" aria-hidden="true" />
                <span>
                  Hora de modificación:{' '}
                  <strong className="font-mono text-sm font-extrabold text-gerdau sm:text-base">
                    {formatTime12h(liveNow)}
                  </strong>
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <ShiftSelectorDropdown shift={draftShift} onChange={setDraftShift} />

              <button
                type="button"
                onClick={() => openCustomModal()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gerdau/30 bg-white px-3.5 py-2 text-xs font-bold text-gerdau shadow-sm transition-colors hover:bg-gerdau-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau sm:text-sm"
              >
                <Ruler className="h-4 w-4" aria-hidden="true" />
                Nueva medida
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
            const assignedIds = draftWarehouses[wh.id];
            const isPendingHere = pendingSlotWarehouse === wh.id;
            const remainingCatalogCount = draftCatalog.length - assignedIds.length;
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
                      onClick={() => handleClearWarehouse(wh.id)}
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
                              catalog={draftCatalog}
                              selectedMeasureId={measureId}
                              usedMeasureIdsInColumn={assignedIds}
                              variant={isBlue ? 'blue' : 'red'}
                              onSelect={(newId) =>
                                handleReplaceMeasure(wh.id, measureId, newId)
                              }
                              onRequestCustomMeasure={() => openCustomModal(wh.id)}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveMeasure(wh.id, measureId)}
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
                              catalog={draftCatalog}
                              selectedMeasureId={null}
                              usedMeasureIdsInColumn={assignedIds}
                              variant={isBlue ? 'blue' : 'red'}
                              placeholder="Elegir medida..."
                              autoOpen
                              onSelect={(newId) => {
                                handleAddMeasure(wh.id, newId);
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

        {/* Botón de Confirmación / Verificación en la parte inferior derecha */}
        <div className="mt-6 flex flex-col items-end justify-between gap-3 rounded-2xl border border-surface-border bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center">
          <div className="text-xs font-medium text-slate-600 sm:text-sm">
            {hasUnsavedChanges ? (
              <span className="font-semibold text-amber-800">
                Tienes cambios pendientes por confirmar hacia Balanza.
              </span>
            ) : state.lastVerifiedAt ? (
              <span>
                Última confirmación enviada a Balanza:{' '}
                <strong className="font-mono text-slate-900">
                  {formatTime12h(state.lastVerifiedAt)}
                </strong>
              </span>
            ) : (
              <span>Presiona el botón para guardar y registrar la hora en Balanza.</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleConfirmChanges}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            Confirmado / Verificado
          </button>
        </div>
      </div>

      <CustomMeasureModal
        isOpen={isCustomModalOpen}
        defaultWarehouseId={customModalWarehouse}
        onClose={() => setIsCustomModalOpen(false)}
        onCreate={handleCreateCustomMeasure}
      />
    </main>
  );
}
