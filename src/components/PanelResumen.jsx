import { TIPOS_ASIGNATURA } from '../data/asignaturas.js';
import { getColorPorAsignatura } from './HorarioSemanal.jsx';

export default function PanelResumen({ seccionesSeleccionadas, asignaturas, creditosMaximos = 35 }) {
  const asignaturasElegidas = new Set();
  let creditosTotales = 0;
  const lista = [];

  seccionesSeleccionadas.forEach(seccFullId => {
    const [asigId, seccId] = seccFullId.split('::');
    const asig = asignaturas.find(a => a.id === asigId);
    const secc = asig?.secciones.find(s => s.id === seccId);
    if (!asig || !secc) return;
    if (!asignaturasElegidas.has(asigId)) {
      asignaturasElegidas.add(asigId);
      creditosTotales += asig.creditos;
    }
    lista.push({ asig, secc, asigId, seccId });
  });

  const porcentajeCreditos = Math.min((creditosTotales / creditosMaximos) * 100, 100);
  const creditosColor = creditosTotales <= creditosMaximos * 0.75 ? 'bg-emerald-500' : creditosTotales <= creditosMaximos ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="card sticky top-4">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Resumen de Selección
        </h3>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary-50 rounded-lg p-3 text-center border border-primary-100">
            <div className="text-2xl font-black text-primary-700">{asignaturasElegidas.size}</div>
            <div className="text-[11px] text-primary-600 font-medium mt-0.5">Asignaturas</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
            <div className="text-2xl font-black text-slate-700">{seccionesSeleccionadas.size}</div>
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
            <div
              className={`h-full ${creditosColor} transition-all duration-500`}
              style={{ width: `${porcentajeCreditos}%` }}
            />
          </div>
          {creditosTotales > creditosMaximos && (
            <p className="text-xs text-red-600 mt-1.5 font-medium">
              ⚠ Has excedido el límite de créditos
            </p>
          )}
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 -mr-1">
          {lista.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-sm font-medium text-slate-600 mb-1">Sin ramos seleccionados</div>
              <div className="text-xs text-slate-400">Elige al menos una sección para comenzar</div>
            </div>
          ) : (
            lista.map(({ asig, secc, asigId, seccId }) => {
              const color = getColorPorAsignatura(asigId);
              return (
                <div
                  key={`${asigId}-${seccId}`}
                  className={`rounded-lg p-3 border-l-4 ${color.border} ${color.bgLight} border-t border-r border-b border-slate-100`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`w-2 h-2 rounded-full ${color.bg}`} />
                        <span className="text-xs font-mono font-bold text-slate-500">{asig.codigo}</span>
                        <span className="text-xs font-mono text-slate-400">· {secc.codigo}</span>
                      </div>
                      <div className={`text-sm font-bold ${color.text} mt-0.5 truncate`}>
                        {asig.nombre}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {secc.profesor} · {secc.sala}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
        <button
          className="w-full btn-success py-2.5 text-sm disabled:opacity-50"
          disabled={seccionesSeleccionadas.size === 0}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Confirmar selección
        </button>
      </div>
    </div>
  );
}

export function BarraFiltros({
  busqueda,
  setBusqueda,
  filtroCurso,
  setFiltroCurso,
  filtroTipo,
  setFiltroTipo,
  soloDisponibles,
  setSoloDisponibles,
  soloSeleccionadas,
  setSoloSeleccionadas,
  totalAsignaturas,
  mostradas
}) {
  return (
    <div className="card p-4 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-4 relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar asignatura o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div className="md:col-span-2">
          <select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)} className="select-field w-full">
            <option value="todos">Todos los cursos</option>
            <option value="1">Curso 1</option>
            <option value="2">Curso 2</option>
            <option value="3">Curso 3</option>
            <option value="0">Asig. Libres</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="select-field w-full">
            <option value="todos">Todos los tipos</option>
            {Object.entries(TIPOS_ASIGNATURA).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4 flex items-center gap-2 flex-wrap justify-start md:justify-end">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={soloDisponibles}
              onChange={(e) => setSoloDisponibles(e.target.checked)}
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="whitespace-nowrap">Con cupos</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={soloSeleccionadas}
              onChange={(e) => setSoloSeleccionadas(e.target.checked)}
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="whitespace-nowrap">Mis seleccionadas</span>
          </label>
          <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500 px-2">
            <span className="font-bold text-slate-700">{mostradas}</span>/<span>{totalAsignaturas}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
