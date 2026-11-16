import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppHeader } from './components/AppHeader/AppHeader';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { StockProvider } from './context/StockContext';
import { DispatcherView } from './views/DispatcherView';
import { HomeView } from './views/HomeView';
import { LoginView } from './views/LoginView';
import { ScaleView } from './views/ScaleView';

export function App() {
  return (
    <AuthProvider>
      <StockProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="flex min-h-screen flex-col bg-surface-panel text-slate-900">
            <AppHeader />
            <ErrorBoundary>
              <Routes>
                {/* Vista Principal de Bienvenida y Selección de Rol mantenida exactamente igual */}
                <Route path="/" element={<HomeView />} />
                {/* Pantalla de Autenticación al ingresar a Despachador o Balanza */}
                <Route path="/login" element={<LoginView />} />
                <Route
                  path="/despachador"
                  element={
                    <ProtectedRoute requiredRole="despachador">
                      <DispatcherView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/balanza"
                  element={
                    <ProtectedRoute requiredRole="balanza">
                      <ScaleView />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
            <footer className="border-t border-blue-100 bg-white py-3 text-center text-xs text-slate-500">
              <strong className="font-semibold text-gerdau">Gerdau</strong> –{' '}
              <strong className="font-semibold text-gerdau-light">Siderperú</strong>
            </footer>
          </div>
        </BrowserRouter>
      </StockProvider>
    </AuthProvider>
  );
}

export default App;
