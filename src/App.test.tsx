import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { STORAGE_KEY } from './services/stockSync';

describe('Stock por Balanza application', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('renders both corporate logos and role cards on the landing view', () => {
    render(<App />);

    expect(screen.getByAltText('Logo Gerdau')).toHaveAttribute('src', '/images/gerdaulogo.png');
    expect(screen.getByAltText('Logo Siderperú')).toHaveAttribute('src', '/images/siderlogo.png');
    expect(screen.getByRole('heading', { name: /stock por balanza/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ingresar a despacho/i })).toHaveAttribute(
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
    expect(screen.getByRole('heading', { name: 'PT 08' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 09' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 15 - BAHIA' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PT 15 - CURVA' })).toBeInTheDocument();

    // Verify stock button confirms sync feedback
    fireEvent.click(screen.getByRole('button', { name: /verificar \/ actualizar stock/i }));
    expect(
      screen.getByText(/stock verificado y sincronizado en tiempo real con balanza/i)
    ).toBeInTheDocument();

    // Add a measure in PT 08 via "+ Agregar medida"
    const pt08Card = screen.getByRole('heading', { name: 'PT 08' }).closest('article')!;
    fireEvent.click(within(pt08Card).getByRole('button', { name: /agregar medida/i }));
    const optionBtn = within(pt08Card).getByRole('button', { name: /1" x 12 m/i });
    fireEvent.click(optionBtn);

    expect(within(pt08Card).getByRole('button', { name: /1" x 12 m/i })).toBeInTheDocument();
  });

  it('renders Balanza strictly read-only, filters on search, and syncs live from storage events', () => {
    window.history.pushState({}, '', '/balanza');
    render(<App />);

    expect(screen.getByText(/solo lectura/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /agregar medida/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/tipos de medida/i)).toHaveLength(4);

    // Search "1/2 x 9" highlights matching columns
    const searchInput = screen.getByPlaceholderText(/buscar medida sap/i);
    fireEvent.change(searchInput, { target: { value: '1/2 x 9' } });
    expect(screen.getByText(/disponible en:/i)).toBeInTheDocument();
    expect(screen.getAllByText('Disponible').length).toBeGreaterThanOrEqual(1);

    // Simulate real-time update from Despachador tab via storage event
    const current = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    current.revision += 1;
    current.warehouses.PT_08 = ['6_mm', '1_2in_x_9_m'];
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

    expect(screen.getByText(/medida "10 mm" agregada al catálogo/i)).toBeInTheDocument();
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
});
