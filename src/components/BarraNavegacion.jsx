export default function BarraNavegacion({
  onAnterior,
  onSiguiente,
  textoAnterior = 'Anterior',
  textoSiguiente = 'Siguiente',
  deshabilitarAnterior = false,
  deshabilitarSiguiente = false,
  hintSiguiente
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-8 pt-6 border-t border-slate-100">
      <button
        onClick={onAnterior}
        disabled={deshabilitarAnterior}
        className="btn-secondary text-sm"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {textoAnterior}
      </button>

      <div className="flex flex-col items-stretch sm:items-end gap-1">
        <button
          onClick={onSiguiente}
          disabled={deshabilitarSiguiente}
          className="btn-primary text-sm"
        >
          {textoSiguiente}
          <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {hintSiguiente && <span className="text-[11px] text-slate-400">{hintSiguiente}</span>}
      </div>
    </div>
  );
}
