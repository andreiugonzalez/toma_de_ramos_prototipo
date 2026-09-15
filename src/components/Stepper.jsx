const PASOS = [
  { id: 1, nombre: 'Bienvenida', descripcion: 'Datos personales' },
  { id: 2, nombre: 'Plan de Estudios', descripcion: 'Selecciona tu plan' },
  { id: 3, nombre: 'Asignaturas', descripcion: 'Elige ramos' },
  { id: 4, nombre: 'Secciones y Horario', descripcion: 'Elige secciones' },
  { id: 5, nombre: 'Resumen', descripcion: 'Confirma tu selección' }
];

export default function Stepper({ pasoActual, onCambiarPaso }) {
  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-primary-600 transition-all duration-500 -z-0"
            style={{ width: `${((pasoActual - 1) / (PASOS.length - 1)) * 100}%` }}
          />

          {PASOS.map((paso) => {
            const isActivo = paso.id === pasoActual;
            const isCompletado = paso.id < pasoActual;
            const isClickable = paso.id <= pasoActual;

            return (
              <div
                key={paso.id}
                className={`flex flex-col items-center relative z-10 flex-1 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => isClickable && onCambiarPaso(paso.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                    isCompletado
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : isActivo
                      ? 'bg-white border-primary-600 text-primary-600 ring-4 ring-primary-100 shadow-glow'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompletado ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    paso.id
                  )}
                </div>
                <div className={`mt-2 text-center max-w-28 px-1 ${isActivo ? 'opacity-100' : isCompletado ? 'opacity-90' : 'opacity-60'}`}>
                  <div className={`text-xs font-semibold ${isActivo ? 'text-primary-700' : 'text-slate-700'}`}>
                    {paso.nombre}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                    {paso.descripcion}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
