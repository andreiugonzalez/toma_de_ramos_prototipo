import { getColorPorAsignatura } from './HorarioSemanal.jsx';

export default function PanelResumen({ ramosActivos, seccionesSeleccionadas, asignaturas, creditosMaximos = 35 }) {
  const incorporadas = Array.isArray(seccionesSeleccionadas) ? seccionesSeleccionadas : [...seccionesSeleccionadas];

  const conSeccion = [];
  let creditosTotales = 0;
  ramosActivos.forEach(asig => {
    const secciones = incorporadas.filter(id => id.startsWith(asig.id + '::'));
    if (secciones.length > 0) creditosTotales += asig.creditos;
    conSeccion.push({ asig, secciones });
  });

  const totalSeleccionadas = incorporadas.length;
  const porcentajeCreditos = Math.min((creditosTotales / creditosMaximos) * 100, 100);
  const creditosColor = creditosTotales <= creditosMaximos * 0.75 ? 'bg-emerald-500' : creditosTotales <= creditosMaximos ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="card lg:sticky lg:top-4">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Ramos seleccionados
        </h3>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary-50 rounded-lg p-3 text-center border border-primary-100">
            <div className="text-2xl font-black text-primary-700">{ramosActivos.length}</div>
            <div className="text-[11px] text-primary-600 font-medium mt-0.5">Asignaturas</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
            <div className="text-2xl font-black text-slate-700">{totalSeleccionadas}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">Secciones</div>
          </div>
          <div className={`rounded-lg p-3 text-center border ${creditosTotales > creditosMaximos ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className={`text-2xl font-black ${creditosTotales > creditosMaximos ? 'text-red-700' : 'text-emerald-700'}`}>{creditosTotales}</div>
            <div className={`text-[11px] font-medium mt-0.5 ${creditosTotales > creditosMaximos ? 'text-red-600' : 'text-emerald-600'}`}>Créditos</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium">Límite de créditos</span>
            <span className={`font-bold ${creditosTotales > creditosMaximos ? 'text-red-600' : 'text-slate-700'}`}>
              {creditosTotales} / {creditosMaximos}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${creditosColor} transition-all duration-500`} style={{ width: `${porcentajeCreditos}%` }} />
          </div>
          {creditosTotales > creditosMaximos && (
            <p className="text-xs text-red-600 mt-1.5 font-medium">⚠ Has excedido el límite de créditos</p>
          )}
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 -mr-1">
          {conSeccion.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="text-sm font-medium text-slate-600 mb-1">Sin ramos seleccionados</div>
              <div className="text-xs text-slate-400">Vuelve al paso anterior para marcar asignaturas</div>
            </div>
          ) : (
            conSeccion.map(({ asig, secciones }) => {
              const color = getColorPorAsignatura(asig.id);
              return (
                <div key={asig.id} className={`rounded-lg p-3 border-l-4 ${color.border} ${color.bgLight} border-t border-r border-b border-slate-100`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`w-2 h-2 rounded-full ${color.bg}`} />
                        <span className="text-xs font-mono font-bold text-slate-500">{asig.codigo}</span>
                        {asig.curso > 0 && <span className="text-[10px] text-slate-400">· Curso {asig.curso}</span>}
                      </div>
                      <div className={`text-sm font-bold ${color.text} mt-0.5 truncate`}>{asig.nombre}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {asig.creditos} créditos · {secciones.length > 0 ? secciones.map(s => s.split('::')[1]).join(', ') : 'Sin sección elegida'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
