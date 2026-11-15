import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, LogIn, ShieldAlert, User } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginView() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role'); // 'despachador' | 'balanza' | null

  const initialUsername =
    roleParam === 'despachador'
      ? 'Despachador'
      : roleParam === 'balanza'
        ? 'Balancero'
        : '';

  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus password input if username is prefilled, otherwise focus username
  useEffect(() => {
    if (roleParam === 'despachador') {
      setUsername('Despachador');
      passwordInputRef.current?.focus();
    } else if (roleParam === 'balanza') {
      setUsername('Balancero');
      passwordInputRef.current?.focus();
    } else {
      usernameInputRef.current?.focus();
    }
  }, [roleParam]);

  // Si ya tiene sesión activa y no está intentando cambiar a otro rol específico, redirigir
  if (user && (!roleParam || user.role === roleParam)) {
    return <Navigate to={user.role === 'despachador' ? '/despachador' : '/balanza'} replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = login(username, password);
    setIsLoading(false);

    if (result.success) {
      const fromPath = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      if (result.role === 'despachador') {
        navigate(fromPath && fromPath.includes('despachador') ? fromPath : '/despachador', { replace: true });
      } else {
        navigate(fromPath && fromPath.includes('balanza') ? fromPath : '/balanza', { replace: true });
      }
    } else {
      setErrorMessage(result.error ?? 'Credenciales inválidas');
    }
  };

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF9F2] via-[#FFF1E0] to-[#FFE8CC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-industrial-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="animate-page-enter relative w-full max-w-md">
        {/* Tarjeta de Inicio de Sesión Ordenada */}
        <div className="overflow-hidden rounded-3xl border border-orange-200 bg-white/95 shadow-xl shadow-orange-950/5 backdrop-blur-sm">
          {/* Barra superior ordenada: Volver a Selección de Roles y Rol Destino */}
          <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/70 px-6 py-3.5 sm:px-8">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-xs font-bold text-slate-700 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md py-0.5"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-orange-200/90 bg-white text-orange-600 shadow-2xs transition-transform group-hover:-translate-x-0.5">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>Volver a Selección de Roles</span>
            </Link>

            <span className="inline-flex items-center rounded-full border border-orange-200/90 bg-white px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-orange-800 shadow-2xs">
              {roleParam === 'despachador' ? 'Despachador' : roleParam === 'balanza' ? 'Balanza' : 'Acceso'}
            </span>
          </div>

          <div className="p-7 sm:p-9">
            {/* Cabecera de la tarjeta */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-md shadow-orange-600/30">
                <Lock className="h-7 w-7" aria-hidden="true" />
              </div>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Control de Medidas
              </h1>
              <p className="mt-1 text-xs font-semibold text-orange-900/80 sm:text-sm">
                {roleParam === 'despachador'
                  ? 'Ingresa credenciales para Despachador (Almacén)'
                  : roleParam === 'balanza'
                    ? 'Ingresa credenciales para Monitor Balanza'
                    : 'Inicia sesión para acceder a tu perfil asignado'}
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {/* Mensaje de error */}
              {errorMessage && (
                <div
                  role="alert"
                  className="animate-dropdown-enter flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-semibold text-red-800"
                >
                  <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Campo Usuario */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-extrabold tracking-wide text-slate-700 uppercase"
                >
                  Usuario
                </label>
                <div className="relative mt-1.5 flex items-center">
                  <User
                    className="pointer-events-none absolute left-3.5 h-4 w-4 text-orange-600"
                    aria-hidden="true"
                  />
                  <input
                    ref={usernameInputRef}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Despachador o Balancero"
                    className="w-full rounded-xl border-2 border-orange-200 bg-orange-50/30 py-2.5 pl-10 pr-3.5 text-sm font-semibold text-slate-900 transition-colors placeholder:text-slate-400 focus:border-orange-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-extrabold tracking-wide text-slate-700 uppercase"
                >
                  Contraseña
                </label>
                <div className="relative mt-1.5 flex items-center">
                  <Lock
                    className="pointer-events-none absolute left-3.5 h-4 w-4 text-orange-600"
                    aria-hidden="true"
                  />
                  <input
                    ref={passwordInputRef}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border-2 border-orange-200 bg-orange-50/30 py-2.5 pl-10 pr-10 text-sm font-semibold text-slate-900 transition-colors placeholder:text-slate-400 focus:border-orange-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                    className="absolute right-2.5 rounded-lg p-1 text-slate-400 transition-colors hover:bg-orange-100 hover:text-orange-900"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Botón Ingresar */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-black tracking-wide text-white shadow-lg shadow-orange-600/25 transition-all hover:bg-orange-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
