import { PASOS } from '../data/asignaturas.js';

export default function Stepper({ pasoActual, onCambiarPaso }) {
  const pasoInfo = PASOS.find(p => p.id === pasoActual);

  return (
    <div className="w-full px-3 sm:px-4 py-4 sm:py-5 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between relative">
          <div className="absolute top-[13px] sm:top-[15px] left-0 right-0 h-0.5 bg-slate-200" />
          <div
            className="absolute top-[13px] sm:top-[15px] left-0 h-0.5 bg-primary-600 transition-all duration-500"
            style={{ width: `${((pasoActual - 1) / (PASOS.length - 1)) * 100}%` }}
          />

          {PASOS.map((paso) => {
            const isActivo = paso.id === pasoActual;
            const isCompletado = paso.id < pasoActual;
            const isClickable = paso.id <= pasoActual;

            return (
              <button
                key={paso.id}
                type="button"
                onClick={() => isClickable && onCambiarPaso(paso.id)}
                aria-label={`Paso ${paso.id}: ${paso.nombre}`}
                className={`flex flex-col items-center relative z-10 flex-1 px-0.5 bg-transparent ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                    isCompletado
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : isActivo
                      ? 'bg-white border-primary-600 text-primary-600 ring-4 ring-primary-100'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompletado ? (
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    paso.id
                  )}
                </div>
                <div className="mt-2 text-center w-full px-0.5 hidden sm:block">
                  <div className={`text-[10px] sm:text-[11px] font-semibold leading-tight ${isActivo ? 'text-primary-700' : 'text-slate-600'}`}>
                    {paso.nombre}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="sm:hidden mt-3 text-center">
          <span className="text-sm font-bold text-primary-700">Paso {pasoActual} de {PASOS.length}</span>
          {pasoInfo && <span className="text-sm text-slate-500"> · {pasoInfo.nombre}</span>}
        </div>
      </div>
    </div>
  );
}
