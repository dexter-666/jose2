import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex flex-1 items-center justify-center bg-surface-panel p-6">
          <div className="max-w-md rounded-2xl border border-orange-200 bg-white p-6 text-center shadow-md">
            <h2 className="text-lg font-extrabold text-slate-900">
              Se detectó una actualización inesperada
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Presiona el botón para sincronizar la vista nuevamente.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700"
            >
              Reintentar
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
