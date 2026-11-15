import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Ruler, X } from 'lucide-react';
import { ClassificationGroup, MeasureItem, WarehouseId } from '../../types/stock';
import { CLASSIFICATION_GROUPS, inferTechnicalDescription, parseMeasureMetrics, WAREHOUSES } from '../../utils/measures';

interface CustomMeasureModalProps {
  isOpen: boolean;
  defaultWarehouseId?: WarehouseId | null;
  defaultGroup?: ClassificationGroup | null;
  onClose: () => void;
  onCreate: (
    label: string,
    options?: {
      overrideDiameterMm?: number;
      overrideLengthM?: number;
      autoAssignTo?: WarehouseId;
      group?: ClassificationGroup;
      technicalDescription?: string;
    }
  ) => { ok: boolean; error?: string; measure?: MeasureItem };
}

export function CustomMeasureModal({
  isOpen,
  defaultWarehouseId = null,
  defaultGroup = null,
  onClose,
  onCreate,
}: CustomMeasureModalProps) {
  const [label, setLabel] = useState('');
  const [technicalDescription, setTechnicalDescription] = useState('');
  const [group, setGroup] = useState<ClassificationGroup>(defaultGroup ?? 'NACIONAL');
  const [manualDiameter, setManualDiameter] = useState('');
  const [assignWarehouse, setAssignWarehouse] = useState<WarehouseId | ''>(
    defaultWarehouseId ?? ''
  );
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLabel('');
      setTechnicalDescription('');
      setGroup(defaultGroup ?? 'NACIONAL');
      setManualDiameter('');
      setAssignWarehouse(defaultWarehouseId ?? '');
      setError(null);
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, defaultWarehouseId, defaultGroup]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const parsedPreview = useMemo(() => parseMeasureMetrics(label), [label]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const overrideMm =
      !parsedPreview.parsed && manualDiameter.trim()
        ? parseFloat(manualDiameter.replace(',', '.'))
        : undefined;

    if (!parsedPreview.parsed && manualDiameter.trim() && (Number.isNaN(overrideMm!) || overrideMm! <= 0)) {
      setError('Ingresa un diámetro aproximado en mm válido (mayor a 0).');
      return;
    }

    const finalTechDesc = technicalDescription.trim() || inferTechnicalDescription(label, group);

    const res = onCreate(label, {
      overrideDiameterMm: overrideMm,
      autoAssignTo: assignWarehouse || undefined,
      group,
      technicalDescription: finalTechDesc,
    });

    if (!res.ok) {
      setError(res.error ?? 'No se pudo agregar la medida.');
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-measure-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-dropdown-enter w-full max-w-md overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-200 bg-orange-600 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Ruler className="h-5 w-5 text-orange-200" aria-hidden="true" />
            <h2 id="custom-measure-title" className="text-base font-bold">
              Nueva Medida / Descripción Técnica
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar diálogo"
            className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {/* Grupo de Clasificación (8 Grupos) */}
          <div>
            <label htmlFor="measure-group-select" className="block text-xs font-bold text-slate-800 uppercase">
              Grupo de Clasificación
            </label>
            <select
              id="measure-group-select"
              value={group}
              onChange={(e) => setGroup(e.target.value as ClassificationGroup)}
              className="mt-1.5 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              {CLASSIFICATION_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Medida / Dimensión */}
          <div>
            <label htmlFor="measure-label-input" className="block text-xs font-bold text-slate-800 uppercase">
              Medida / Dimensión
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Ejemplos: <code className="font-mono text-orange-700">1/2&quot; x 9 m</code>,{' '}
              <code className="font-mono text-orange-700">10 mm</code>,{' '}
              <code className="font-mono text-orange-700">1 3/8&quot; x 12 m</code>
            </p>
            <input
              ref={inputRef}
              id="measure-label-input"
              type="text"
              required
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                setError(null);
              }}
              placeholder='Ej: 1/2" x 9 m'
              className="mt-1.5 w-full rounded-lg border border-orange-200 px-3.5 py-2 font-mono text-sm font-semibold text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* Descripción Técnica Completa */}
          <div>
            <label htmlFor="measure-tech-input" className="block text-xs font-bold text-slate-800 uppercase">
              Descripción Técnica Completa
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Ejemplo: <code className="font-mono text-orange-700">Media x 9 y A 6 15</code>
            </p>
            <input
              id="measure-tech-input"
              type="text"
              value={technicalDescription}
              onChange={(e) => setTechnicalDescription(e.target.value)}
              placeholder={label.trim() ? inferTechnicalDescription(label, group) : 'Ej: Media x 9 y A 6 15'}
              className="mt-1.5 w-full rounded-lg border border-orange-200 px-3.5 py-2 font-mono text-sm font-semibold text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {label.trim() && (
            <div className="rounded-lg border border-orange-200 bg-orange-50/70 px-3.5 py-2 text-xs">
              {parsedPreview.parsed ? (
                <div className="flex items-center justify-between text-slate-700">
                  <span>Métrica calculada:</span>
                  <span className="font-mono font-bold text-orange-700">
                    Ø {parsedPreview.diameterMm.toFixed(2)} mm
                    {parsedPreview.lengthM > 0 ? ` · ${parsedPreview.lengthM} m` : ''}
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="font-medium text-orange-900">
                    Opcionalmente indica diámetro en mm para ordenación delgado-grueso:
                  </p>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={manualDiameter}
                    onChange={(e) => setManualDiameter(e.target.value)}
                    placeholder="Ej: 16 (mm)"
                    aria-label="Diámetro aproximado en milímetros"
                    className="w-full rounded-md border border-orange-300 bg-white px-3 py-1 font-mono text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="assign-wh-select" className="block text-xs font-bold text-slate-800 uppercase">
              Asignar a columna (opcional)
            </label>
            <select
              id="assign-wh-select"
              value={assignWarehouse}
              onChange={(e) => setAssignWarehouse(e.target.value as WarehouseId | '')}
              className="mt-1.5 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="">Solo agregar al catálogo general</option>
              {WAREHOUSES.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-orange-100 px-3 py-2 text-xs font-semibold text-orange-900">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-orange-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Guardar medida
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
