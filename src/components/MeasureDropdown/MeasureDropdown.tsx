import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, Plus, Search, X } from 'lucide-react';
import { ClassificationGroup, MeasureItem } from '../../types/stock';
import { CLASSIFICATION_GROUPS, matchesMeasureQuery } from '../../utils/measures';
import { ThicknessIndicator } from '../ThicknessIndicator/ThicknessIndicator';

interface MeasureDropdownProps {
  catalog: MeasureItem[];
  selectedMeasureId: string | null;
  usedMeasureIdsInColumn: string[];
  initialGroupFilter?: ClassificationGroup | null;
  variant?: 'orange-dark' | 'orange-light';
  placeholder?: string;
  autoOpen?: boolean;
  onSelect: (measureId: string) => void;
  onRequestCustomMeasure?: () => void;
}

export function MeasureDropdown({
  catalog,
  selectedMeasureId,
  usedMeasureIdsInColumn,
  initialGroupFilter = null,
  variant = 'orange-dark',
  placeholder = 'Seleccionar medida...',
  autoOpen = false,
  onSelect,
  onRequestCustomMeasure,
}: MeasureDropdownProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [query, setQuery] = useState('');
  const [activeGroupFilter, setActiveGroupFilter] = useState<ClassificationGroup | 'ALL'>(
    initialGroupFilter ?? 'ALL'
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Sync initial group filter when prop changes
  useEffect(() => {
    if (initialGroupFilter) {
      setActiveGroupFilter(initialGroupFilter);
    }
  }, [initialGroupFilter]);

  const selectedMeasure = useMemo(
    () => catalog.find((m) => m.id === selectedMeasureId) ?? null,
    [catalog, selectedMeasureId]
  );

  const filteredCatalog = useMemo(() => {
    return catalog.filter((item) => {
      if (activeGroupFilter !== 'ALL' && item.group !== activeGroupFilter) {
        return false;
      }
      return matchesMeasureQuery(item, query);
    });
  }, [catalog, activeGroupFilter, query]);

  const usedSet = useMemo(() => new Set(usedMeasureIdsInColumn), [usedMeasureIdsInColumn]);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      const timer = window.setTimeout(() => {
        searchRef.current?.focus();
      }, 25);
      return () => window.clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectItem = (item: MeasureItem) => {
    const isTakenElsewhere = usedSet.has(item.id) && item.id !== selectedMeasureId;
    if (isTakenElsewhere) return;
    onSelect(item.id);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, Math.max(0, filteredCatalog.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredCatalog[activeIndex];
      if (target) handleSelectItem(target);
    }
  };

  const headerClasses =
    variant === 'orange-light'
      ? 'bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-500'
      : 'bg-orange-700 hover:bg-orange-800 focus-visible:ring-orange-700';

  return (
    <div ref={containerRef} className={`relative w-full ${isOpen ? 'z-30' : 'z-10'}`}>
      {/* Botón desplegable en paleta naranja con texto blanco y triángulo naranja claro */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-sm font-bold text-white shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${headerClasses}`}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-mono text-xs font-black tracking-tight sm:text-sm">
            {selectedMeasure
              ? selectedMeasure.technicalDescription || selectedMeasure.label
              : placeholder}
          </span>
          {selectedMeasure && (
            <span className="truncate text-[10px] font-medium text-orange-200">
              {selectedMeasure.group} · {selectedMeasure.label}
            </span>
          )}
        </div>

        {/* Flecha triangular naranja claro */}
        <svg
          viewBox="0 0 12 8"
          className={`h-2.5 w-3 shrink-0 fill-orange-200 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          aria-hidden="true"
        >
          <polygon points="0,0 12,0 6,8" />
        </svg>
      </button>

      {/* Menú desplegable animado */}
      {isOpen && (
        <div className="animate-dropdown-enter absolute left-0 right-0 top-full mt-2.5 origin-top">
          {/* Triángulo conector apuntando hacia arriba */}
          <div
            className="pointer-events-none absolute -top-[8px] left-6 z-10 h-0 w-0 border-x-[8px] border-b-[8px] border-x-transparent border-b-orange-400 drop-shadow-sm"
            aria-hidden="true"
          />

          <div className="overflow-hidden rounded-xl border-2 border-orange-300 bg-white shadow-xl ring-1 ring-orange-950/5">
            {/* Buscador integrado dentro del dropdown */}
            <div className="border-b border-orange-100 bg-orange-50/70 p-2">
              <div className="relative flex items-center">
                <Search
                  className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-orange-500"
                  aria-hidden="true"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Buscar descripción técnica (ej: Media x 9 y A 6 15)..."
                  aria-label="Filtrar medidas en selector"
                  className="w-full rounded-md border border-orange-200 bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Limpiar filtro"
                    className="absolute right-1.5 rounded p-0.5 text-slate-400 hover:bg-orange-100 hover:text-orange-800"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Pestañas de 8 grupos de clasificación dentro del dropdown */}
              <div className="mt-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveGroupFilter('ALL');
                    setActiveIndex(0);
                  }}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold transition-colors ${
                    activeGroupFilter === 'ALL'
                      ? 'bg-orange-600 text-white'
                      : 'border border-orange-200 bg-white text-orange-900 hover:bg-orange-100'
                  }`}
                >
                  Todos
                </button>
                {CLASSIFICATION_GROUPS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setActiveGroupFilter(g);
                      setActiveIndex(0);
                    }}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold transition-colors ${
                      activeGroupFilter === g
                        ? 'bg-orange-600 text-white'
                        : 'border border-orange-200 bg-white text-orange-900 hover:bg-orange-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="mt-1 flex items-center justify-between px-1 text-[10px] font-semibold tracking-wide text-orange-800/75 uppercase">
                <span>Orden: Delgado → Grueso</span>
                <span>{filteredCatalog.length} opciones</span>
              </div>
            </div>

            {/* Lista blanca de opciones con descripción técnica completa */}
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Medidas disponibles"
              className="custom-scrollbar max-h-60 divide-y divide-orange-50 overflow-y-auto p-1"
            >
              {filteredCatalog.length === 0 ? (
                <li className="px-3 py-4 text-center text-xs text-slate-500">
                  No se encontraron medidas coincidentes
                </li>
              ) : (
                filteredCatalog.map((item, idx) => {
                  const isSelected = item.id === selectedMeasureId;
                  const isUsedElsewhere = usedSet.has(item.id) && !isSelected;
                  const isActive = idx === activeIndex;

                  return (
                    <li
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isUsedElsewhere}
                    >
                      <button
                        type="button"
                        disabled={isUsedElsewhere}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => handleSelectItem(item)}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-orange-100 font-bold text-orange-900'
                            : isUsedElsewhere
                              ? 'cursor-not-allowed bg-slate-50/70 text-slate-400'
                              : isActive
                                ? 'bg-orange-50 text-slate-900'
                                : 'text-slate-700 hover:bg-orange-50/60'
                        }`}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <ThicknessIndicator diameterMm={item.diameterMm} highlighted={isSelected} />
                          <div className="min-w-0 flex-1">
                            {/* Descripción técnica completa requerida por especificación */}
                            <div className="truncate font-mono text-[13px] font-bold text-slate-900">
                              {item.technicalDescription}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="font-semibold text-orange-800">
                                {item.group}
                              </span>
                              <span>·</span>
                              <span>{item.label}</span>
                              {item.isCustom && (
                                <span className="rounded bg-orange-100 px-1 text-[9px] font-bold text-orange-800">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <Check className="h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" />
                        ) : isUsedElsewhere ? (
                          <span className="rounded bg-orange-100/70 px-1.5 py-0.5 text-[10px] font-medium text-orange-800/70">
                            Ya asignada
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            {onRequestCustomMeasure && (
              <div className="border-t border-orange-100 bg-orange-50/70 p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onRequestCustomMeasure();
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-orange-400 bg-white px-2.5 py-1.5 text-xs font-semibold text-orange-700 transition-colors hover:border-orange-600 hover:bg-orange-50"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Agregar medida personalizada
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
