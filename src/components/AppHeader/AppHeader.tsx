import { Edit3, LogOut, Monitor, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AppHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isHome = pathname === '/' || pathname === '/login';
  const isDispatcher = pathname === '/despachador';
  const isScale = pathname === '/balanza';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[88px] flex-wrap items-center justify-between gap-3 py-3">
          {/* Esquina Superior Izquierda: Logo GERDAU */}
          <Link
            to={isAuthenticated ? (user?.role === 'despachador' ? '/despachador' : '/balanza') : '/login'}
            aria-label="Gerdau - Ir al inicio"
            className="flex shrink-0 items-center rounded-lg p-1 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gerdau"
          >
            <img
              src="/images/gerdaulogo.png"
              alt="Logo Gerdau"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </Link>

          {/* Centro: Perfil Activo, Navegación y Cerrar Sesión */}
          {isAuthenticated && (
            <div className="order-3 flex w-full items-center justify-center gap-2.5 border-t border-surface-border pt-2 sm:order-2 sm:w-auto sm:border-t-0 sm:pt-0">
              <nav
                aria-label="Navegación principal"
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {/* Badge de usuario autenticado */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-100/90 px-3 py-1 text-xs font-bold text-orange-950">
                  <User className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
                  <span>{user?.displayName ?? user?.username}</span>
                </span>

                {/* Alternador de Vistas */}
                <div className="inline-flex items-center rounded-lg border border-orange-200 bg-orange-50/80 p-0.5">
                  <Link
                    to="/despachador"
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 sm:text-sm ${
                      isDispatcher
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-orange-900/75 hover:text-orange-800'
                    }`}
                    aria-current={isDispatcher ? 'page' : undefined}
                  >
                    <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                    Despachador
                  </Link>
                  <Link
                    to="/balanza"
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:text-sm ${
                      isScale
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-orange-900/75 hover:text-orange-700'
                    }`}
                    aria-current={isScale ? 'page' : undefined}
                  >
                    <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                    Balanza
                  </Link>
                </div>

                {/* Botón Cerrar Sesión */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Cerrar sesión para alternar perfil"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-xs font-bold text-orange-800 shadow-sm transition-all hover:border-orange-500 hover:bg-orange-100 hover:text-orange-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 sm:text-sm"
                >
                  <LogOut className="h-3.5 w-3.5 text-orange-600" aria-hidden="true" />
                  <span>Cerrar sesión</span>
                </button>
              </nav>
            </div>
          )}

          {/* Esquina Superior Derecha: Logo SIDERPERU */}
          <Link
            to={isAuthenticated ? (user?.role === 'despachador' ? '/despachador' : '/balanza') : '/login'}
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
        <div className="h-1 w-full bg-gradient-to-r from-orange-700 via-orange-500 to-orange-300" />
      )}
    </header>
  );
}
