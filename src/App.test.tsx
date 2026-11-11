import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { STORAGE_KEY } from './services/stockSync';

describe('Stock por Balanza application', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders both corporate logos and role cards on the landing view', () => {
    render(<App />);

    expect(screen.getByAltText('Logo Gerdau')).toHaveAttribute('src', '/images/gerdaulogo.png');
    expect(screen.getByAltText('Logo Siderperú')).toHaveAttribute('src', '/images/siderlogo.png');
    expect(screen.getByRole('heading', { name: /stock de almacenes/i })).toBeInTheDocument();
    expect(screen.getByText(/actualizar medidas disponibles por almacén/i)).toBeInTheDocument();
    expect(screen.getByText(/visualizar medidas disponibles por almacén/i)).toBeInTheDocument();
    expect(screen.queryByText(/4 almacenes/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/estado actual de planta/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/productos siderúrgicos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sistema de control · stock por balanza/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/turno|última|\d{1,2}:\d{2}/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /abrir editable almacén/i })).toHaveAttribute(
      'href',
      '/despachador'
    );
    expect(screen.getByRole('link', { name: /abrir monitor balanza/i })).toHaveAttribute(
      'href',
      '/balanza'
    );
  });

  it('allows Despachador to manage measures in the 4 fixed warehouses', () => {
    window.history.pushState({}, '', '/despachador');
    render(<App />);

    expect(screen.getByText(/modo edición - despachador/i)).toBeInTheDocument();
    expect(screen.getByText(/hora de modificación:/i)).toBeInTheDocument();
    expect(screen.queryByText(/turno/i)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 08' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 09' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 15 - BAHIA' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 15 - CURVA' })).toBeInTheDocument();

    // Add a measure in PT 08 via "+ Agregar medida" (staged until confirmed)
    const pt08Card = screen.getByRole('heading', { name: 'PT 08' }).closest('article')!;
    fireEvent.click(within(pt08Card).getByRole('button', { name: /agregar medida/i }));
    const optionBtn = within(pt08Card).getByRole('button', { name: /1" x 12 m/i });
    fireEvent.click(optionBtn);

    expect(within(pt08Card).getByRole('button', { name: /1" x 12 m/i })).toBeInTheDocument();
    expect(screen.getByText(/cambios sin confirmar/i)).toBeInTheDocument();

    // Not persisted to Balanza until Confirmado / Verificado is clicked
    const beforeConfirm = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(beforeConfirm.warehouses.PT_08).not.toContain('1in_x_12_m');
    expect(beforeConfirm.lastVerifiedAt).toBeNull();

    // Bottom-right Confirmado / Verificado saves columns and stamps confirmation time
    fireEvent.click(screen.getByRole('button', { name: /confirmado \/ verificado/i }));
    expect(screen.getByText(/cambios guardados y confirmados hacia balanza/i)).toBeInTheDocument();
    expect(screen.getByText(/sincronizado con balanza/i)).toBeInTheDocument();

    const afterConfirm = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(afterConfirm.warehouses.PT_08).toContain('1in_x_12_m');
    expect(afterConfirm.lastVerifiedAt).toBeTruthy();
  });

  it('renders Balanza strictly read-only, shows Última modificación from confirmation, and syncs live', () => {
    window.history.pushState({}, '', '/balanza');
    render(<App />);

    expect(screen.getByText(/solo lectura/i)).toBeInTheDocument();
    expect(screen.getByText(/última modificación:/i)).toBeInTheDocument();
    expect(screen.queryByText(/turno/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/disponibilidad de stock por almacén/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/almacén producto terminado/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/delgado → grueso/i)).not.toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /agregar medida/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/tipos de medida/i)).toHaveLength(4);

    // Search "1/2 x 9" highlights matching columns
    const searchInput = screen.getByPlaceholderText(/^buscar medida\.\.\.$/i);
    fireEvent.change(searchInput, { target: { value: '1/2 x 9' } });
    expect(screen.getByText(/disponible en:/i)).toBeInTheDocument();
    expect(screen.getAllByText('Disponible').length).toBeGreaterThanOrEqual(1);

    // Simulate confirmation from Despachador tab via storage event
    const current = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    current.revision += 1;
    current.warehouses.PT_08 = ['6_mm', '1_2in_x_9_m'];
    current.lastVerifiedAt = new Date(2026, 10, 10, 16, 55, 12).toISOString();
    const serialized = JSON.stringify(current);
    window.localStorage.setItem(STORAGE_KEY, serialized);

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: serialized,
        })
      );
    });

    expect(screen.getByText('04:55:12 PM')).toBeInTheDocument();
    const pt08Card = screen.getByRole('heading', { name: 'PT 08' }).closest('article')!;
    expect(within(pt08Card).getByText('1/2" x 9 m')).toBeInTheDocument();
    expect(within(pt08Card).queryByText('12 mm')).not.toBeInTheDocument();
  });

  it('supports adding custom measures in thin-to-thick order from Despachador', () => {
    window.history.pushState({}, '', '/despachador');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /nueva medida/i }));
    const labelInput = screen.getByLabelText(/medida \/ descripción del producto/i);
    fireEvent.change(labelInput, { target: { value: '10 mm' } });
    fireEvent.change(screen.getByLabelText(/asignar inmediatamente a almacén/i), {
      target: { value: 'PT_08' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar medida/i }));

    expect(screen.getByText(/medida "10 mm" agregada/i)).toBeInTheDocument();
    const pt08Card = screen.getByRole('heading', { name: 'PT 08' }).closest('article')!;
    const buttons = within(pt08Card)
      .getAllByRole('button')
      .map((b) => b.textContent?.trim() ?? '');
    const idx38 = buttons.findIndex((t) => t.includes('3/8" x 12 m'));
    const idx10 = buttons.findIndex((t) => t.includes('10 mm'));
    const idx12 = buttons.findIndex((t) => t.includes('12 mm'));
    expect(idx38).toBeGreaterThan(-1);
    expect(idx10).toBeGreaterThan(idx38);
    expect(idx12).toBeGreaterThan(idx10);
  });

  it('syncs across devices via /api/stock when cloud Redis is configured', async () => {
    const confirmedIso = new Date(2026, 10, 10, 17, 15, 30).toISOString();
    const remoteState = {
      version: 1,
      catalog: [
        { id: '6_mm', label: '6 mm', diameterMm: 6, lengthM: 0 },
        { id: '1_2in_x_9_m', label: '1/2" x 9 m', diameterMm: 12.7, lengthM: 9 },
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

    window.history.pushState({}, '', '/balanza');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/sincronizado en la nube/i)).toBeInTheDocument();
      expect(screen.getByText('05:15:30 PM')).toBeInTheDocument();
    });

    const pt09Card = screen.getByRole('heading', { name: 'PT 09' }).closest('article')!;
    expect(within(pt09Card).getByText('1/2" x 9 m')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/stock', expect.objectContaining({ method: 'GET' }));
  });

  it('does not crash Balanza when remote sync meta omits empty arrays', async () => {
    const firstConfirmedIso = new Date(2026, 10, 11, 11, 10, 0).toISOString();
    const secondConfirmedIso = new Date(2026, 10, 11, 11, 15, 0).toISOString();

    const baseState = {
      version: 1,
      catalog: [
        { id: '6_mm', label: '6 mm', diameterMm: 6, lengthM: 0 },
        { id: '8_mm', label: '8 mm', diameterMm: 8, lengthM: 0 },
      ],
      warehouses: {
        PT_08: ['6_mm'],
        PT_09: ['8_mm'],
        PT_15_BAHIA: [],
        PT_15_CURVA: [],
      },
      shift: '07:00',
      lastUpdatedAt: firstConfirmedIso,
      lastVerifiedAt: firstConfirmedIso,
      revision: 2,
    };

    let pollCount = 0;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      pollCount += 1;
      if (pollCount === 1) {
        return new Response(
          JSON.stringify({ configured: true, unchanged: false, state: baseState, meta: null }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({
          configured: true,
          unchanged: false,
          state: {
            ...baseState,
            warehouses: { ...baseState.warehouses, PT_08: [] },
            lastUpdatedAt: secondConfirmedIso,
            lastVerifiedAt: secondConfirmedIso,
            revision: 3,
          },
          // Simulate Firebase/remote payload missing affectedMeasureIds
          meta: {
            sourceTabId: 'remote-tab',
            action: 'verify',
            affectedWarehouses: ['PT_08'],
            timestamp: secondConfirmedIso,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });

    window.history.pushState({}, '', '/balanza');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('11:10:00 AM')).toBeInTheDocument();
    });

    // Trigger visibilitychange so second remote snapshot with omitted affectedMeasureIds arrives
    await act(async () => {
      window.dispatchEvent(new Event('focus'));
    });

    await waitFor(() => {
      expect(screen.getByText('11:15:00 AM')).toBeInTheDocument();
      expect(screen.getByText(/stock confirmado por despacho/i)).toBeInTheDocument();
    });
  });
});
