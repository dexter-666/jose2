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
import { ConnectionDot } from '../components/ConnectionDot/ConnectionDot';
import { CustomMeasureModal } from '../components/CustomMeasureModal/CustomMeasureModal';
import { MeasureDropdown } from '../components/MeasureDropdown/MeasureDropdown';
import { useStock } from '../context/StockContext';
import { ClassificationGroup, MeasureItem, WarehouseId, WarehouseStockMap } from '../types/stock';
import {
  buildMeasureItem,
  sortCatalogMeasures,
  sortMeasureIdsByCatalog,
  WAREHOUSES,
} from '../utils/measures';
import { formatTime12h } from '../utils/shifts';

export function DispatcherView() {
  const { state, isConnected, confirmStockChanges, resetDemoStock } = useStock();

  // Borrador editable en Despachador: los cambios se guardan y envían a Balanza al confirmar
  const [draftCatalog, setDraftCatalog] = useState<MeasureItem[]>(() => state.catalog);
  const [draftWarehouses, setDraftWarehouses] = useState<WarehouseStockMap>(() => state.warehouses);
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
    if (draftCatalog.length !== state.catalog.length) return true;
    if (draftCatalog.some((m, i) => state.catalog[i]?.id !== m.id)) return true;
    return WAREHOUSES.some((wh) => {
      const a = draftWarehouses[wh.id];
      const b = state.warehouses[wh.id];
      return a.length !== b.length || a.some((id, idx) => b[idx] !== id);
    });
  }, [draftCatalog, draftWarehouses, state.catalog, state.warehouses]);

  useEffect(() => {
    if (state.revision !== lastStateRevisionRef.current) {
      lastStateRevisionRef.current = state.revision;
      setDraftCatalog(state.catalog);
      setDraftWarehouses(state.warehouses);
    }
  }, [state.catalog, state.revision, state.warehouses]);

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
    options?: {
      overrideDiameterMm?: number;
      overrideLengthM?: number;
      autoAssignTo?: WarehouseId;
      group?: ClassificationGroup;
      technicalDescription?: string;
    }
  ): { ok: boolean; error?: string; measure?: MeasureItem } => {
    const trimmed = label.trim().replace(/\s+/g, ' ');
    if (!trimmed) {
      return { ok: false, error: 'Ingresa el nombre o dimensión de la medida.' };
    }

    const newMeasure = buildMeasureItem(trimmed, {
      isCustom: true,
      group: options?.group ?? 'NACIONAL',
      technicalDescription: options?.technicalDescription,
      overrideDiameterMm: options?.overrideDiameterMm,
      overrideLengthM: options?.overrideLengthM,
    });

    const duplicate = draftCatalog.find(
      (m) => m.id === newMeasure.id || m.technicalDescription.toLowerCase() === newMeasure.technicalDescription.toLowerCase()
    );
    if (duplicate) {
      return {
        ok: false,
        error: `La medida "${duplicate.technicalDescription || duplicate.label}" ya existe en el catálogo.`,
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
      `Medida "${newMeasure.technicalDescription}" agregada al grupo ${newMeasure.group}. Presiona Confirmado / Verificado para enviar a Balanza.`
    );
    return { ok: true, measure: newMeasure };
  };

  const handleConfirmChanges = () => {
    const confirmedIso = confirmStockChanges({
      catalog: draftCatalog,
      warehouses: draftWarehouses,
      shift: state.shift,
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
    <main className="flex-1 bg-gradient-to-b from-[#FFF9F2] to-[#FFF1E0]">
      <div className="animate-page-enter mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Barra de Estado y Controles del Despachador */}
        <section
          aria-label="Controles del despachador"
          className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-100 px-3.5 py-1 text-xs font-extrabold tracking-wide text-orange-900 uppercase">
                  <Edit3 className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
                  Modo Edición - Despachador
                </span>
                <ConnectionDot connected={isConnected} />
                {hasUnsavedChanges && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-800">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                    Cambios sin confirmar
                  </span>
                )}
              </div>

              <h1 className="mt-2.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
                Gestión de Medidas Disponibles por Almacén
              </h1>

              {/* Reloj en tiempo real */}
              <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-700 sm:text-sm">
                <Clock className="h-4 w-4 text-orange-600" aria-hidden="true" />
                <span>
                  Hora de modificación:{' '}
                  <strong className="font-mono text-sm font-extrabold text-orange-700 sm:text-base">
                    {formatTime12h(liveNow)}
                  </strong>
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => openCustomModal()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300 bg-orange-50 px-3.5 py-2 text-xs font-bold text-orange-800 shadow-sm transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:text-sm"
              >
                <Ruler className="h-4 w-4 text-orange-600" aria-hidden="true" />
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
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500 bg-orange-100 px-3 py-2 text-xs font-bold text-orange-900 transition-colors hover:bg-orange-600 hover:text-white"
                >
                  ¿Confirmar reinicio?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  title="Restablecer ejemplo inicial"
                  aria-label="Restablecer ejemplo inicial"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50/60 px-3 py-2 text-xs font-semibold text-orange-900/80 transition-colors hover:bg-orange-100 hover:text-orange-900"
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
              className="animate-dropdown-enter mt-4 flex items-center gap-2 rounded-xl border border-orange-300 bg-orange-50 px-4 py-2.5 text-xs font-semibold text-orange-900 sm:text-sm"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
              {feedbackMessage}
            </div>
          )}
        </section>

        {/* Tablero de 4 Columnas Fijas (Códigos PT08, PT09, PT 15 - BAHIA, PT 15 - CURVA) */}
        <section
          aria-label="Tablero editable de almacenes"
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {WAREHOUSES.map((wh) => {
            const rawAssignedIds = draftWarehouses[wh.id];
            const displayedIds = rawAssignedIds;
            const isPendingHere = pendingSlotWarehouse === wh.id;
            const remainingCatalogCount = draftCatalog.length - rawAssignedIds.length;
            const isDarkOrange = wh.accent === 'blue';

            return (
              <article
                key={wh.id}
                className="flex flex-col rounded-2xl border border-orange-200 bg-white shadow-sm"
              >
                {/* Cabecera fija con código de producto / almacén en naranja / naranja oscuro */}
                <header
                  className={`flex items-center justify-between rounded-t-2xl px-4 py-3.5 text-white ${
                    isDarkOrange ? 'bg-orange-700' : 'bg-orange-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold tracking-wide">{wh.label}</h2>
                  </div>
                  <span className="rounded-full bg-white/20 px-2.5 py-1 font-mono text-xs font-bold text-orange-50">
                    {displayedIds.length}
                  </span>
                </header>

                {/* Subinfo de la columna */}
                <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/75 px-4 py-2 text-[11px] font-semibold text-orange-900/80">
                  <span>Tipos de medida</span>
                  {rawAssignedIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleClearWarehouse(wh.id)}
                      className="text-orange-800/75 underline-offset-2 transition-colors hover:text-orange-700 hover:underline"
                    >
                      Limpiar columna
                    </button>
                  )}
                </div>

                {/* Ranuras editables con Formato de Visualización Completo */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  {displayedIds.length === 0 && !isPendingHere ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-orange-200 bg-orange-50/40 px-4 py-8 text-center">
                      <p className="text-sm font-semibold text-slate-700">
                        Sin medidas asignadas
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {displayedIds.map((measureId) => {
                        const measure = draftCatalogMap.get(measureId);

                        return (
                          <div
                            key={measureId}
                            className="flex flex-col gap-1.5 rounded-xl border border-orange-200/90 bg-orange-50/40 p-2.5 shadow-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              {/* 1. Código primero, 2. Clasificación luego (Agrandados) */}
                              <div className="flex flex-wrap items-center gap-2">
                                {measure?.sapCode && (
                                  <span className="rounded-md bg-white px-2.5 py-1 font-mono text-xs sm:text-sm font-black text-slate-800 shadow-2xs border border-orange-200">
                                    CÓDIGO: {measure.sapCode}
                                  </span>
                                )}
                                {measure && (
                                  <span className="rounded-md bg-orange-100 px-2.5 py-1 text-xs sm:text-sm font-extrabold uppercase text-orange-900 border border-orange-200/70">
                                    {measure.group}
                                  </span>
                                )}
                              </div>

                              {/* Botón Eliminar de columna */}
                              <button
                                type="button"
                                onClick={() => handleRemoveMeasure(wh.id, measureId)}
                                title="Eliminar / Producto agotado"
                                aria-label={`Quitar medida de ${wh.label}`}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-white text-orange-700/70 transition-colors hover:border-orange-400 hover:bg-orange-100 hover:text-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                              >
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </div>

                            {/* Selector desplegable con descripción técnica completa */}
                            <div className="min-w-0 flex-1">
                              <MeasureDropdown
                                catalog={draftCatalog}
                                selectedMeasureId={measureId}
                                usedMeasureIdsInColumn={rawAssignedIds}
                                initialGroupFilter={null}
                                variant={isDarkOrange ? 'orange-dark' : 'orange-light'}
                                onSelect={(newId) =>
                                  handleReplaceMeasure(wh.id, measureId, newId)
                                }
                                onRequestCustomMeasure={() => openCustomModal(wh.id)}
                              />
                            </div>
                          </div>
                        );
                      })}

                      {isPendingHere && (
                        <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-orange-400 bg-orange-50 p-2">
                          <div className="min-w-0 flex-1">
                            <MeasureDropdown
                              catalog={draftCatalog}
                              selectedMeasureId={null}
                              usedMeasureIdsInColumn={rawAssignedIds}
                              initialGroupFilter={null}
                              variant={isDarkOrange ? 'orange-dark' : 'orange-light'}
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
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-white text-orange-700/70 hover:bg-orange-100 hover:text-orange-900"
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
                          : isDarkOrange
                            ? 'border-orange-300 bg-orange-50/70 text-orange-800 hover:border-orange-600 hover:bg-orange-100 focus-visible:ring-orange-600'
                            : 'border-orange-300 bg-orange-50/50 text-orange-700 hover:border-orange-500 hover:bg-orange-100 focus-visible:ring-orange-500'
                      }`}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      {remainingCatalogCount <= 0
                        ? 'Catálogo completo asignado'
                        : `Agregar medida a ${wh.label}`}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Botón de Confirmación / Verificación hacia Balanza */}
        <div className="mt-6 flex flex-col items-end justify-between gap-3 rounded-2xl border border-orange-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center">
          <div className="text-xs font-medium text-slate-600 sm:text-sm">
            {hasUnsavedChanges ? (
              <span className="font-semibold text-orange-800">
                Tienes cambios pendientes por confirmar hacia Balanza.
              </span>
            ) : state.lastVerifiedAt ? (
              <span>
                Última confirmación enviada a Balanza:{' '}
                <strong className="font-mono text-orange-800">
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
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-orange-600/20 transition-all hover:bg-orange-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
          >
            <CheckCircle2 className="h-5 w-5 text-orange-100" aria-hidden="true" />
            Confirmado / Verificado
          </button>
        </div>
      </div>

      <CustomMeasureModal
        isOpen={isCustomModalOpen}
        defaultWarehouseId={customModalWarehouse}
        defaultGroup="NACIONAL"
        onClose={() => setIsCustomModalOpen(false)}
        onCreate={handleCreateCustomMeasure}
      />
    </main>
  );
}
