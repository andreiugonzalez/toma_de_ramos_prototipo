import { useEffect } from 'react';

export default function ModalInformacion({ data, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-in" />
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-modal-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 p-5 sm:p-6 border-b border-slate-100 bg-primary-50">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-800 leading-tight">{data.titulo}</h3>
            {data.subtitulo && <p className="text-xs text-slate-500 mt-0.5">{data.subtitulo}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
          {Array.isArray(data.contenido) ? (
            <ul className="space-y-3">
              {data.contenido.map((texto, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <span>{texto}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed">{data.contenido}</p>
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button onClick={onClose} className="btn-primary px-6 text-sm">Entendido</button>
        </div>
      </div>
    </div>
  );
}
