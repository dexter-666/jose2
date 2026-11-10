import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppHeader } from './components/AppHeader/AppHeader';
import { StockProvider } from './context/StockContext';
import { DispatcherView } from './views/DispatcherView';
import { HomeView } from './views/HomeView';
import { ScaleView } from './views/ScaleView';

export function App() {
  return (
    <StockProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="flex min-h-screen flex-col bg-surface-panel text-slate-900">
          <AppHeader />
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/despachador" element={<DispatcherView />} />
            <Route path="/balanza" element={<ScaleView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <footer className="border-t border-blue-100 bg-white py-3 text-center text-xs text-slate-500">
            <strong className="font-semibold text-gerdau">Gerdau</strong> –{' '}
            <strong className="font-semibold text-gerdau-light">Siderperú</strong>
          </footer>
        </div>
      </BrowserRouter>
    </StockProvider>
  );
}

export default App;
