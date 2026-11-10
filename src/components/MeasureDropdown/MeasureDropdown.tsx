import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, Plus, Search, X } from 'lucide-react';
import { MeasureItem } from '../../types/stock';
import { matchesMeasureQuery } from '../../utils/measures';
import { ThicknessIndicator } from '../ThicknessIndicator/ThicknessIndicator';

interface MeasureDropdownProps {
  catalog: MeasureItem[];
  selectedMeasureId: string | null;
  usedMeasureIdsInColumn: string[];
  variant?: 'red' | 'blue';
  placeholder?: string;
  autoOpen?: boolean;
  onSelect: (measureId: string) => void;
  onRequestCustomMeasure?: () => void;
}

export function MeasureDropdown({
  catalog,
  selectedMeasureId,
  usedMeasureIdsInColumn,
  variant = 'red',
  placeholder = 'Seleccionar medida',
  autoOpen = false,
  onSelect,
  onRequestCustomMeasure,
}: MeasureDropdownProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const selectedMeasure = useMemo(
    () => catalog.find((m) => m.id === selectedMeasureId) ?? null,
    [catalog, selectedMeasureId]
  );

  const filteredCatalog = useMemo(
    () => catalog.filter((item) => matchesMeasureQuery(item.label, query)),
    [catalog, query]
  );

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
    variant === 'red'
      ? 'bg-sider-red hover:bg-sider-red-dark focus-visible:ring-sider-red'
      : 'bg-gerdau hover:bg-gerdau-light focus-visible:ring-gerdau';

  return (
    <div ref={containerRef} className={`relative w-full ${isOpen ? 'z-30' : 'z-10'}`}>
      {/* Botón estilo Siderperú: cabecera roja o azul con texto blanco y triángulo amarillo */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-sm font-bold text-white shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${headerClasses}`}
      >
        <span className="truncate font-mono tracking-tight">
          {selectedMeasure ? selectedMeasure.label : placeholder}
        </span>

        {/* Flecha triangular amarilla característica de Siderperú */}
        <svg
          viewBox="0 0 12 8"
          className={`h-2.5 w-3 shrink-0 fill-sider-amber transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          aria-hidden="true"
        >
          <polygon points="0,0 12,0 6,8" />
        </svg>
      </button>

      {/* Menú desplegable animado con triángulo amarillo apuntando hacia arriba */}
      {isOpen && (
        <div className="animate-dropdown-enter absolute left-0 right-0 top-full mt-2.5 origin-top">
          {/* Pequeño triángulo amarillo conector apuntando hacia arriba */}
          <div
            className="pointer-events-none absolute -top-[8px] left-6 z-10 h-0 w-0 border-x-[8px] border-b-[8px] border-x-transparent border-b-sider-amber drop-shadow-sm"
            aria-hidden="true"
          />

          <div className="overflow-hidden rounded-xl border-2 border-sider-amber/80 bg-white shadow-xl ring-1 ring-black/5">
            {/* Buscador integrado dentro del dropdown */}
            <div className="border-b border-surface-border bg-surface-panel p-2">
              <div className="relative flex items-center">
                <Search
                  className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400"
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
                  placeholder="Buscar medida (ej: 1/2 x 9)..."
                  aria-label="Filtrar medidas en selector"
                  className="w-full rounded-md border border-surface-border bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-gerdau focus:outline-none focus:ring-1 focus:ring-gerdau"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Limpiar filtro"
                    className="absolute right-1.5 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="mt-1 flex items-center justify-between px-1 text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                <span>Orden: Delgado → Grueso</span>
                <span>{filteredCatalog.length} opc.</span>
              </div>
            </div>

            {/* Lista blanca de opciones */}
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Medidas disponibles"
              className="custom-scrollbar max-h-56 divide-y divide-slate-100 overflow-y-auto p-1"
            >
              {filteredCatalog.length === 0 ? (
                <li className="px-3 py-4 text-center text-xs text-slate-500">
                  No se encontró "{query}"
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
                            ? 'bg-gerdau-soft font-bold text-gerdau'
                            : isUsedElsewhere
                              ? 'cursor-not-allowed bg-slate-50/70 text-slate-400'
                              : isActive
                                ? 'bg-sider-amber-soft text-slate-900'
                                : 'text-slate-700 hover:bg-surface-panel'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <ThicknessIndicator diameterMm={item.diameterMm} highlighted={isSelected} />
                          <span className="font-mono text-[13px] font-semibold">{item.label}</span>
                          {item.isCustom && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                              Custom
                            </span>
                          )}
                        </span>

                        {isSelected ? (
                          <Check className="h-4 w-4 shrink-0 text-gerdau" aria-hidden="true" />
                        ) : isUsedElsewhere ? (
                          <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
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
              <div className="border-t border-surface-border bg-surface-panel p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onRequestCustomMeasure();
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-gerdau/40 bg-white px-2.5 py-1.5 text-xs font-semibold text-gerdau transition-colors hover:border-gerdau hover:bg-gerdau-soft"
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

