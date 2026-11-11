import { getThicknessTier } from '../../utils/measures';

interface ThicknessIndicatorProps {
  diameterMm: number;
  highlighted?: boolean;
}

const HEIGHT_CLASSES: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: 'h-1 w-4',
  2: 'h-1.5 w-4',
  3: 'h-2 w-4',
  4: 'h-2.5 w-4',
  5: 'h-3 w-4',
  6: 'h-3.5 w-4',
};

export function ThicknessIndicator({ diameterMm, highlighted = false }: ThicknessIndicatorProps) {
  const tier = getThicknessTier(diameterMm);
  return (
    <span
      className="inline-flex h-4 w-5 shrink-0 items-center justify-center rounded bg-orange-100/80 px-0.5"
      title={`Espesor aproximado: ${diameterMm >= 9999 ? 'Personalizado' : `${diameterMm.toFixed(1)} mm`}`}
      aria-hidden="true"
    >
      <span
        className={`rounded-full transition-colors ${HEIGHT_CLASSES[tier]} ${
          highlighted ? 'bg-orange-700' : 'bg-orange-500'
        }`}
      />
    </span>
  );
}

