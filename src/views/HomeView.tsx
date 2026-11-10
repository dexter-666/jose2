import { ArrowRight, CheckCircle2, Edit3, Lock, Monitor, Radio, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStock } from '../context/StockContext';
import { WAREHOUSES } from '../utils/measures';
import { formatTimeShort, getShiftOption } from '../utils/shifts';

export function HomeView() {
  const { state } = useStock();
  const shiftInfo = getShiftOption(state.shift);
  const totalActiveItems = WAREHOUSES.reduce(
    (sum, wh) => sum + state.warehouses[wh.id].length,
    0
  );

  return (
    <main className="bg-industrial-grid flex-1">
      <div className="animate-page-enter mx-auto flex max-w-6xl flex-col items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Encabezado Principal */}
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gerdau/15 bg-white px-3.5 py-1 text-xs font-bold tracking-wider text-gerdau uppercase shadow-sm">
            <Radio className="h-3.5 w-3.5 text-sider-red" aria-hidden="true" />
            Sincronización Instantánea Despacho ↔ Balanza
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gerdau sm:text-5xl">
            Stock por balanza
          </h1>
          <p className="mt-2 text-lg font-semibold text-slate-700 sm:text-xl">
            Stock por Almacén · Productos Siderúrgicos
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Consulta y gestiona en tiempo real la disponibilidad de medidas de barras de acero en{' '}
            <span className="font-semibold text-gerdau">PT 08</span>,{' '}
            <span className="font-semibold text-sider-red">PT 09</span>,{' '}
            <span className="font-semibold text-gerdau">PT 15 - BAHIA</span> y{' '}
            <span className="font-semibold text-sider-red">PT 15 - CURVA</span> para agilizar la
            atención de pedidos SAP en balanza.
          </p>
        </div>

        {/* Dos Botones / Tarjetas Principales */}
        <section
          aria-label="Selección de rol"
          className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Botón Izquierdo: Despachador */}
          <Link
            to="/despachador"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-surface-border bg-white p-7 shadow-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gerdau hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau focus-visible:ring-offset-2 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gerdau transition-all duration-300 group-hover:h-2" />

            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gerdau text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                  <Edit3 className="h-7 w-7 text-sider-amber" aria-hidden="true" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gerdau-soft px-3 py-1 text-xs font-bold text-gerdau">
                  <Warehouse className="h-3.5 w-3.5" aria-hidden="true" />
                  Panel Editable
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-slate-900 transition-colors group-hover:text-gerdau">
                Despachador
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Actualiza las medidas disponibles en cada almacén, registra nuevas medidas del
                catálogo y verifica el stock por turno. Los cambios se reflejan al instante en
                Balanza.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-surface-border pt-4">
              <span className="text-sm font-bold text-gerdau">Ingresar a Despacho</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gerdau-soft text-gerdau transition-all duration-300 group-hover:translate-x-1 group-hover:bg-gerdau group-hover:text-white">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Botón Derecho: Balanza */}
          <Link
            to="/balanza"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-surface-border bg-white p-7 shadow-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-sider-red hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sider-red focus-visible:ring-offset-2 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-sider-red transition-all duration-300 group-hover:h-2" />

            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sider-red text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                  <Monitor className="h-7 w-7 text-sider-amber" aria-hidden="true" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sider-red-soft px-3 py-1 text-xs font-bold text-sider-red">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  Solo Lectura
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-slate-900 transition-colors group-hover:text-sider-red">
                Balanza
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Monitor en vivo no modificable. Busca rápidamente la medida de la hoja de picking
                SAP para dirigir al camión al almacén correcto sin demoras.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-surface-border pt-4">
              <span className="text-sm font-bold text-sider-red">Abrir Monitor Balanza</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sider-red-soft text-sider-red transition-all duration-300 group-hover:translate-x-1 group-hover:bg-sider-red group-hover:text-white">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </section>

        {/* Resumen rápido del estado actual */}
        <section
          aria-label="Resumen actual de almacenes"
          className="mt-10 w-full max-w-4xl rounded-2xl border border-surface-border bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Estado actual de planta · {totalActiveItems} asignaciones activas
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
              <span className="rounded-md bg-surface-panel px-2.5 py-1 font-semibold text-gerdau">
                {shiftInfo.label}
              </span>
              <span>Última actualización: {formatTimeShort(state.lastUpdatedAt)}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {WAREHOUSES.map((wh) => {
              const count = state.warehouses[wh.id].length;
              return (
                <div
                  key={wh.id}
                  className="rounded-xl border border-surface-border bg-surface-panel/70 px-3.5 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold tracking-wide text-slate-800">
                      {wh.label}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        wh.accent === 'blue' ? 'bg-gerdau' : 'bg-sider-red'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1 font-mono text-lg font-bold text-slate-900">
                    {count}{' '}
                    <span className="font-sans text-xs font-medium text-slate-500">
                      {count === 1 ? 'medida' : 'medidas'}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
