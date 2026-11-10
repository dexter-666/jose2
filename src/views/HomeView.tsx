import { ArrowRight, Edit3, Layers, Lock, Monitor, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomeView() {
  return (
    <main className="bg-industrial-grid flex flex-1 items-center">
      <div className="animate-page-enter mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Título Principal */}
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gerdau sm:text-6xl">
            Stock por balanza
          </h1>
        </div>

        {/* Dos Tarjetas Principales */}
        <section
          aria-label="Selección de rol"
          className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Botón Izquierdo: Despachador */}
          <Link
            to="/despachador"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-surface-border bg-white p-7 shadow-md transition-all duration-300 ease-out hover:-translate-y-2 hover:border-gerdau hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau focus-visible:ring-offset-2 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gerdau transition-all duration-300 group-hover:h-2.5" />

            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gerdau text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Edit3 className="h-8 w-8 text-sider-amber" aria-hidden="true" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gerdau-soft px-3 py-1 text-xs font-bold text-gerdau">
                  <Warehouse className="h-3.5 w-3.5" aria-hidden="true" />
                  Panel Editable
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-slate-900 transition-colors group-hover:text-gerdau sm:text-3xl">
                Despachador
              </h2>
              <p className="mt-1.5 text-sm font-medium text-slate-600">
                Actualiza el stock disponible por almacén.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-panel px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors group-hover:border-gerdau/25 group-hover:bg-gerdau-soft/50">
                  <Layers className="h-3.5 w-3.5 text-gerdau" aria-hidden="true" />
                  4 almacenes
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-surface-border pt-4">
              <span className="text-sm font-bold text-gerdau">Ingresar a Despacho</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gerdau-soft text-gerdau transition-all duration-300 group-hover:translate-x-1.5 group-hover:bg-gerdau group-hover:text-white">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Botón Derecho: Balanza */}
          <Link
            to="/balanza"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-surface-border bg-white p-7 shadow-md transition-all duration-300 ease-out hover:-translate-y-2 hover:border-sider-red hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sider-red focus-visible:ring-offset-2 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-sider-red transition-all duration-300 group-hover:h-2.5" />

            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sider-red text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Monitor className="h-8 w-8 text-sider-amber" aria-hidden="true" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sider-red-soft px-3 py-1 text-xs font-bold text-sider-red">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  Solo Lectura
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-slate-900 transition-colors group-hover:text-sider-red sm:text-3xl">
                Balanza
              </h2>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-surface-border pt-4">
              <span className="text-sm font-bold text-sider-red">Abrir Monitor Balanza</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sider-red-soft text-sider-red transition-all duration-300 group-hover:translate-x-1.5 group-hover:bg-sider-red group-hover:text-white">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
