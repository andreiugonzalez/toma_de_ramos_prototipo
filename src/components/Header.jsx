export default function Header({ estudiante, tiempoFormato, critico }) {
  return (
    <header className="bg-gradient-to-r from-ucenslate via-ucenslate-light to-ucenslate text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <div className="text-ucenslate font-black text-base sm:text-xl leading-tight text-center">
                <div className="tracking-tighter">UCEN</div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-lg font-bold tracking-tight truncate">
                {estudiante.universidad}
              </div>
              <div className="text-blue-100 text-[11px] sm:text-sm truncate">{estudiante.facultad}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a
              href="/respuestas.html"
              title="Ver respuestas de la experiencia"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
              <span className="hidden sm:inline">Respuestas</span>
            </a>
            <div className="hidden sm:flex flex-col items-end bg-red-600/90 rounded-lg px-3 py-1.5 border border-red-300/40 shadow-inner">
              <div className="text-[11px] text-red-50 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Su cita finalizará en:
              </div>
              <div className={`font-mono font-black text-lg leading-tight ${critico ? 'animate-pulse' : ''}`}>
                {tiempoFormato}
              </div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base">
              {estudiante.iniciales}
            </div>
          </div>
        </div>

        <div className="sm:hidden pb-3">
          <div className="bg-red-600/90 rounded-lg px-3 py-1.5 border border-red-300/40 flex items-center justify-between">
            <span className="text-[11px] text-red-50">Su cita finalizará en:</span>
            <span className={`font-mono font-black ${critico ? 'animate-pulse' : ''}`}>{tiempoFormato}</span>
          </div>
        </div>

        <div className="pb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2 border-t border-white/10 pt-3">
          <DatoHeader label="Nombre" valor={estudiante.nombre} className="col-span-2 lg:col-span-1" />
          <DatoHeader label="Plan" valor={estudiante.plan} className="col-span-2 lg:col-span-1" />
          <DatoHeader label="Escuela" valor={estudiante.escuela} className="col-span-2 lg:col-span-1" />
          <DatoHeader label="Última modificación" valor={estudiante.ultimaModificacion} />
          <DatoHeader label="Periodo de Matrícula" valor={estudiante.periodoMatricula} />
          <DatoHeader label="Expediente" valor={estudiante.expediente} />
        </div>
      </div>
    </header>
  );
}

function DatoHeader({ label, valor, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="text-[10px] uppercase tracking-wide text-blue-200 font-semibold">{label}</div>
      <div className="text-xs sm:text-[13px] font-semibold text-white truncate" title={valor}>
        {valor}
      </div>
    </div>
  );
}
