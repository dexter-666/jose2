import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const AUTH_KEY = 'gerdau_siderperu_auth_session_v1';

function loginAs(role: 'despachador' | 'balanza') {
  const session = {
    username: role === 'despachador' ? 'Despachador' : 'Balanzero',
    role,
    displayName: role === 'despachador' ? 'Despachador (Almacén)' : 'Balanzero (Balanza)',
  };
  window.sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

describe('Stock por Balanza application', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders both corporate logos and role cards on the main landing view', () => {
    render(<App />);

    expect(screen.getByAltText('Logo Gerdau')).toHaveAttribute('src', '/images/gerdaulogo.png');
    expect(screen.getByAltText('Logo Siderperú')).toHaveAttribute('src', '/images/siderlogo.png');
    expect(screen.getByRole('heading', { name: /stock de almacenes/i })).toBeInTheDocument();
    expect(screen.getByText(/actualizar medidas disponibles por almacén/i)).toBeInTheDocument();
    expect(screen.getByText(/visualizar medidas disponibles por almacén/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /abrir editable almacén/i })).toHaveAttribute(
      'href',
      '/despachador'
    );
    expect(screen.getByRole('link', { name: /abrir monitor balanza/i })).toHaveAttribute(
      'href',
      '/balanza'
    );
  });

  it('prompts for login when unauthenticated user enters Despachador', () => {
    window.history.pushState({}, '', '/despachador');
    render(<App />);

    // Redirige al login con foco en despachador
    expect(screen.getByRole('heading', { name: /control de stock/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^usuario$/i)).toHaveValue('Despachador');
    expect(screen.getByRole('link', { name: /volver a selección de roles/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/');
    expect(screen.queryByText(/perfiles y accesos autorizados/i)).not.toBeInTheDocument();

    // Ingresar credencial correcta Almacen2026
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'Almacen2026' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Accede a Despachador
    expect(screen.getByText(/modo edición - despachador/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();

    // Volver al Inicio disponible en la cabecera
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/');
  });

  it('prompts for login when unauthenticated user enters Balanza', () => {
    window.history.pushState({}, '', '/balanza');
    render(<App />);

    expect(screen.getByRole('heading', { name: /control de stock/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^usuario$/i)).toHaveValue('Balanzero');

    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'Balanza2026' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(screen.getByText(/solo lectura · monitor balanza/i)).toBeInTheDocument();
  });

  it('rejects invalid credentials with an error message', () => {
    window.history.pushState({}, '', '/login');
    render(<App />);

    fireEvent.change(screen.getByLabelText(/^usuario$/i), { target: { value: 'Despachador' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'WrongPass' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/credenciales inválidas/i);
  });

  it('displays the 8 classification groups in Despachador and allows managing measures', () => {
    loginAs('despachador');
    window.history.pushState({}, '', '/despachador');
    render(<App />);

    expect(screen.getByText(/modo edición - despachador/i)).toBeInTheDocument();
    expect(screen.getByText(/hora de modificación:/i)).toBeInTheDocument();

    // 8 grupos de clasificación requeridos
    expect(screen.getByRole('button', { name: /^nacional/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^fhab/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^importado/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^recox/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^dimensionado/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^especial/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^planchas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^perfiles/i })).toBeInTheDocument();

    // 4 Columnas con sus códigos
    expect(screen.getByRole('heading', { name: 'PT 08' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 09' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 15 - BAHIA' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 15 - CURVA' })).toBeInTheDocument();

    // Filtrar por grupo "Nacional"
    fireEvent.click(screen.getByRole('button', { name: /^nacional/i }));
    expect(screen.getByText(/filtrando por grupo:/i)).toBeInTheDocument();

    // Confirmado / Verificado guarda a Balanza
    fireEvent.click(screen.getByRole('button', { name: /confirmado \/ verificado/i }));
    expect(screen.getByText(/cambios guardados y confirmados hacia balanza/i)).toBeInTheDocument();
  });

  it('renders Balanza with product codes and exact technical descriptions', () => {
    loginAs('balanza');
    window.history.pushState({}, '', '/balanza');
    render(<App />);

    expect(screen.getByText(/solo lectura/i)).toBeInTheDocument();
    expect(screen.getByText(/última modificación:/i)).toBeInTheDocument();
    expect(screen.queryByText(/turno/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/disponibilidad de stock por almacén/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/almacén producto terminado/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/delgado → grueso/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/en stock/i)).not.toBeInTheDocument();

    // Cada registro obligatorio muestra el código de producto (PT08, etc.) y descripción técnica (Media x 9 y A 6 15)
    expect(screen.getAllByText('PT08').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Media x 9 y A 6 15').length).toBeGreaterThan(0);

    // Buscador
    const searchInput = screen.getByPlaceholderText(/^buscar medida\.\.\.$/i);
    fireEvent.change(searchInput, { target: { value: 'Media' } });
    expect(screen.getByText(/disponible en:/i)).toBeInTheDocument();
  });

  it('supports adding custom measures with category and technical description', () => {
    loginAs('despachador');
    window.history.pushState({}, '', '/despachador');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /nueva medida/i }));
    const labelInput = screen.getByLabelText(/medida \/ dimensión/i);
    fireEvent.change(labelInput, { target: { value: '10 mm' } });
    fireEvent.change(screen.getByLabelText(/grupo de clasificación/i), {
      target: { value: 'Nacional' },
    });
    fireEvent.change(screen.getByLabelText(/asignar a columna/i), {
      target: { value: 'PT_08' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar medida/i }));

    expect(screen.getByText(/medida "10 mm - Nacional" agregada/i)).toBeInTheDocument();
  });

  it('syncs across devices via /api/stock when cloud Redis is configured', async () => {
    const confirmedIso = new Date(2026, 10, 10, 17, 15, 30).toISOString();
    const remoteState = {
      version: 1,
      catalog: [
        { id: '6_mm', label: '6 mm', technicalDescription: '6 mm x 9 y NTP 341', group: 'Nacional', diameterMm: 6, lengthM: 0 },
        { id: '1_2in_x_9_m', label: '1/2" x 9 m', technicalDescription: 'Media x 9 y A 6 15', group: 'Nacional', diameterMm: 12.7, lengthM: 9 },
      ],
      warehouses: {
        PT_08: ['6_mm'],
        PT_09: ['1_2in_x_9_m'],
        PT_15_BAHIA: [],
        PT_15_CURVA: [],
      },
      shift: '15:00',
      lastUpdatedAt: confirmedIso,
      lastVerifiedAt: confirmedIso,
      revision: 4,
    };

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (url.startsWith('/api/stock') && (!init?.method || init.method === 'GET')) {
        return new Response(
          JSON.stringify({
            configured: true,
            unchanged: false,
            state: remoteState,
            meta: null,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify({ ok: true, configured: true }), { status: 200 });
    });

    loginAs('balanza');
    window.history.pushState({}, '', '/balanza');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('status', { name: 'Conectado' })).toBeInTheDocument();
      expect(screen.getByText('05:15:30 PM')).toBeInTheDocument();
    });

    const pt09Card = screen.getByRole('heading', { name: 'PT 09' }).closest('article')!;
    expect(within(pt09Card).getByText('Media x 9 y A 6 15')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/stock', expect.objectContaining({ method: 'GET' }));
  });
});
