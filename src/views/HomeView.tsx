import { ArrowRight, Edit3, Layers, Lock, Monitor, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomeView() {
  return (
    <main className="relative flex flex-1 items-center overflow-hidden bg-gradient-to-b from-[#F3F8FD] via-[#E9F1FA] to-[#DCE8F6]">
      <div className="bg-industrial-grid pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />

      <div className="animate-page-enter relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Título Principal */}
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#002855] sm:text-6xl">
            STOCK DE ALMACENES
          </h1>
        </div>

        {/* Dos Tarjetas Principales (Paleta Azul) */}
        <section
          aria-label="Selección de rol"
          className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Botón Izquierdo: Despachador */}
          <Link
            to="/despachador"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/80 bg-white/95 p-7 shadow-md shadow-blue-950/5 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-gerdau hover:shadow-2xl hover:shadow-blue-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau focus-visible:ring-offset-2 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gerdau transition-all duration-300 group-hover:h-2.5" />

            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gerdau text-sky-200 shadow-md shadow-gerdau/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Edit3 className="h-8 w-8" aria-hidden="true" />
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
                Actualizar medidas disponibles por almacén
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-[#F4F8FD] px-2.5 py-1.5 text-xs font-semibold text-gerdau transition-colors group-hover:border-gerdau/30 group-hover:bg-gerdau-soft">
                  <Layers className="h-3.5 w-3.5 text-gerdau-light" aria-hidden="true" />
                  4 almacenes
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-blue-100 pt-4">
              <span className="text-sm font-bold text-gerdau">Abrir Editable Almacén</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gerdau-soft text-gerdau transition-all duration-300 group-hover:translate-x-1.5 group-hover:bg-gerdau group-hover:text-white">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Botón Derecho: Balanza */}
          <Link
            to="/balanza"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/80 bg-white/95 p-7 shadow-md shadow-blue-950/5 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#0284C7] hover:shadow-2xl hover:shadow-sky-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gerdau-light to-[#0284C7] transition-all duration-300 group-hover:h-2.5" />

            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gerdau-light to-[#0284C7] text-sky-100 shadow-md shadow-sky-900/25 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Monitor className="h-8 w-8" aria-hidden="true" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F2FC] px-3 py-1 text-xs font-bold text-[#0056A3]">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  Solo Lectura
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-slate-900 transition-colors group-hover:text-[#0056A3] sm:text-3xl">
                Balanza
              </h2>
              <p className="mt-1.5 text-sm font-medium text-slate-600">
                Visualizar medidas disponibles por almacén
              </p>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-blue-100 pt-4">
              <span className="text-sm font-bold text-[#0056A3]">Abrir Monitor Balanza</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F2FC] text-[#0056A3] transition-all duration-300 group-hover:translate-x-1.5 group-hover:bg-[#0284C7] group-hover:text-white">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
