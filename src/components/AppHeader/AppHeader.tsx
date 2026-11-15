import { ArrowLeft, Edit3, LogOut, Monitor } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AppHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const isHome = pathname === '/';
  const isDispatcher = pathname === '/despachador';
  const isScale = pathname === '/balanza';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 liquid-glass-bar transition-all duration-300">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Barra Principal: Distribución balanceada (Izquierda: Gerdau, Centro: Liquid Glass Dock, Derecha: Siderperú) */}
        <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-y-2 py-2 sm:min-h-[84px]">
          {/* Esquina Izquierda: Logo GERDAU */}
          <div className="order-1 flex shrink-0 items-center justify-start">
            <Link
              to="/"
              aria-label="Gerdau - Ir al inicio"
              className="flex shrink-0 items-center rounded-xl p-1 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau"
            >
              <img
                src="/images/gerdaulogo.png"
                alt="Logo Gerdau"
                className="h-12 w-auto object-contain sm:h-14 lg:h-16"
              />
            </Link>
          </div>

          {/* Centro: Dock Liquid Glass (Centrado en desktop, fila dedicada en mobile) */}
          {!isHome && (
            <div className="order-3 flex w-full items-center justify-center md:order-2 md:w-auto">
              <nav
                aria-label="Navegación principal"
                className="liquid-glass-dock flex max-w-full items-center gap-1.5 overflow-x-auto p-1.5 shadow-md custom-scrollbar sm:gap-2"
              >
                {/* Botón Volver al Inicio */}
                <Link
                  to="/"
                  className="liquid-glass-pill inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:px-3.5 sm:text-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-orange-600" aria-hidden="true" />
                  <span>Volver al Inicio</span>
                </Link>

                {isAuthenticated && (
                  <>
                    {/* Divisor sutil de vidrio */}
                    <div
                      className="h-5 w-px bg-slate-300/60 shadow-[1px_0_0_rgba(255,255,255,0.8)]"
                      aria-hidden="true"
                    />

                    {/* Alternador de Vistas */}
                    <div className="inline-flex shrink-0 items-center rounded-full bg-slate-200/60 p-0.5 shadow-inner backdrop-blur-sm sm:p-1">
                      <Link
                        to="/despachador"
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 sm:px-3.5 sm:text-sm ${
                          isDispatcher
                            ? 'liquid-glass-active text-white'
                            : 'text-slate-700 hover:text-orange-800'
                        }`}
                        aria-current={isDispatcher ? 'page' : undefined}
                      >
                        <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Despachador</span>
                      </Link>
                      <Link
                        to="/balanza"
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:px-3.5 sm:text-sm ${
                          isScale
                            ? 'liquid-glass-active text-white'
                            : 'text-slate-700 hover:text-orange-800'
                        }`}
                        aria-current={isScale ? 'page' : undefined}
                      >
                        <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Balanza</span>
                      </Link>
                    </div>

                    {/* Divisor sutil de vidrio */}
                    <div
                      className="h-5 w-px bg-slate-300/60 shadow-[1px_0_0_rgba(255,255,255,0.8)]"
                      aria-hidden="true"
                    />

                    {/* Botón Cerrar Sesión */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      title="Cerrar sesión para alternar perfil"
                      className="liquid-glass-pill inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-red-200 hover:bg-red-50/90 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 sm:px-3.5 sm:text-sm"
                    >
                      <LogOut className="h-3.5 w-3.5 text-orange-600 transition-colors group-hover:text-red-600" aria-hidden="true" />
                      <span>Cerrar sesión</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}

          {/* Esquina Derecha: Logo SIDERPERU */}
          <div className="order-2 flex shrink-0 items-center justify-end md:order-3">
            <Link
              to="/"
              aria-label="Siderperú - Ir al inicio"
              className="flex shrink-0 items-center rounded-xl p-1 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sider-red"
            >
              <img
                src="/images/siderlogo.png"
                alt="Logo Siderperú"
                className="h-9 w-auto object-contain sm:h-11 lg:h-13"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Borde refractivo Liquid Glass */}
      <div
        className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-90 shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
        aria-hidden="true"
      />
      {isHome ? (
        <div className="h-1 w-full bg-gradient-to-r from-gerdau-dark via-gerdau-light to-sky-500" />
      ) : (
        <div className="h-1 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400" />
      )}
    </header>
  );
}
