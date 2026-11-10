import { ArrowLeft, Edit3, Monitor } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function AppHeader() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isDispatcher = pathname === '/despachador';
  const isScale = pathname === '/balanza';

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[88px] flex-wrap items-center justify-between gap-3 py-3">
          {/* Esquina Superior Izquierda: Logo GERDAU */}
          <Link
            to="/"
            aria-label="Gerdau - Ir al inicio"
            className="flex shrink-0 items-center rounded-lg p-1 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau"
          >
            <img
              src="/images/gerdaulogo.png"
              alt="Logo Gerdau"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </Link>

          {/* Centro: Navegación contextual y botón Volver al Inicio */}
          {!isHome && (
            <div className="order-3 flex w-full items-center justify-center gap-2 border-t border-surface-border pt-2 sm:order-2 sm:w-auto sm:border-t-0 sm:pt-0">
              <nav
                aria-label="Navegación principal"
                className="flex flex-wrap items-center justify-center gap-2"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-gerdau/40 hover:bg-surface-panel hover:text-gerdau focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau sm:text-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Volver al Inicio
                </Link>

                <div className="inline-flex items-center rounded-lg border border-surface-border bg-surface-panel p-0.5">
                  <Link
                    to="/despachador"
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau sm:text-sm ${
                      isDispatcher
                        ? 'bg-gerdau text-white shadow-sm'
                        : 'text-slate-600 hover:text-gerdau'
                    }`}
                    aria-current={isDispatcher ? 'page' : undefined}
                  >
                    <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                    Despachador
                  </Link>
                  <Link
                    to="/balanza"
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sider-red sm:text-sm ${
                      isScale
                        ? 'bg-sider-red text-white shadow-sm'
                        : 'text-slate-600 hover:text-sider-red'
                    }`}
                    aria-current={isScale ? 'page' : undefined}
                  >
                    <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                    Balanza
                  </Link>
                </div>
              </nav>
            </div>
          )}

          {/* Esquina Superior Derecha: Logo SIDERPERU */}
          <Link
            to="/"
            aria-label="Siderperú - Ir al inicio"
            className="order-2 flex shrink-0 items-center rounded-lg p-1 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sider-red sm:order-3"
          >
            <img
              src="/images/siderlogo.png"
              alt="Logo Siderperú"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>
        </div>
      </div>

      {/* Línea corporativa */}
      {isHome ? (
        <div className="h-1 w-full bg-gradient-to-r from-gerdau-dark via-gerdau-light to-sky-500" />
      ) : (
        <div className="flex h-1 w-full">
          <div className="h-full w-1/2 bg-gerdau" />
          <div className="h-full w-10 bg-sider-amber" />
          <div className="h-full flex-1 bg-sider-red" />
        </div>
      )}
    </header>
  );
}

