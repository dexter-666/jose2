interface ConnectionDotProps {
  connected: boolean;
}

export function ConnectionDot({ connected }: ConnectionDotProps) {
  return (
    <span
      role="status"
      aria-label={connected ? 'Conectado' : 'Sin conexión'}
      title={connected ? 'Conectado' : 'Sin conexión'}
      className="relative inline-flex h-5 w-5 items-center justify-center"
    >
      {connected ? (
        <>
          <span
            className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-orange-400 opacity-65"
            aria-hidden="true"
          />
          <span
            className="relative inline-flex h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-500/25 transition-all duration-300"
            aria-hidden="true"
          />
        </>
      ) : (
        <span
          className="relative inline-flex h-3 w-3 rounded-full bg-slate-300 ring-2 ring-slate-200 transition-all duration-300"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

