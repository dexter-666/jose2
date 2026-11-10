import { useEffect, useRef, useState } from 'react';
import { Check, Clock } from 'lucide-react';
import { ShiftCode } from '../../types/stock';
import { getShiftOption, SHIFT_OPTIONS } from '../../utils/shifts';

interface ShiftSelectorDropdownProps {
  shift: ShiftCode;
  onChange: (shift: ShiftCode) => void;
}

export function ShiftSelectorDropdown({ shift, onChange }: ShiftSelectorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = getShiftOption(shift);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative z-30">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 rounded-lg bg-gerdau px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-gerdau-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau focus-visible:ring-offset-2 sm:text-sm"
      >
        <Clock className="h-4 w-4 text-sider-amber" aria-hidden="true" />
        <span>{current.label}</span>
        <svg
          viewBox="0 0 12 8"
          className={`h-2 w-2.5 fill-sider-amber transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <polygon points="0,0 12,0 6,8" />
        </svg>
      </button>

      {isOpen && (
        <div className="animate-dropdown-enter absolute right-0 top-full mt-2.5 w-56 origin-top">
          <div
            className="pointer-events-none absolute -top-[8px] right-6 z-10 h-0 w-0 border-x-[8px] border-b-[8px] border-x-transparent border-b-sider-amber"
            aria-hidden="true"
          />
          <ul
            role="listbox"
            aria-label="Seleccionar turno"
            className="overflow-hidden rounded-xl border-2 border-sider-amber/80 bg-white p-1.5 shadow-xl"
          >
            {SHIFT_OPTIONS.map((opt) => {
              const selected = opt.code === shift;
              return (
                <li key={opt.code} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.code);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      selected
                        ? 'bg-gerdau-soft font-bold text-gerdau'
                        : 'text-slate-700 hover:bg-surface-panel'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-[11px] text-slate-500">{opt.schedule}</div>
                    </div>
                    {selected && <Check className="h-4 w-4 text-gerdau" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

