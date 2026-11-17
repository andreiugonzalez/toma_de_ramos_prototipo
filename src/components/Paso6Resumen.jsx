import { PLANES, ESTUDIANTE, TIPOS_ASIGNATURA, TIPOS_SECCION } from '../data/asignaturas.js';
import HorarioSemanal, { formatoHorario, getColorPorAsignatura, buscarSeccionPorId } from './HorarioSemanal.jsx';
import BarraNavegacion from './BarraNavegacion.jsx';

export default function Paso6Resumen({ planId, ramosActivos, seccionesSeleccionadas, asignaturas, creditosMax, onAnterior, onSiguiente }) {
  const plan = PLANES.find(p => p.id === planId);
  const incorporadas = [...seccionesSeleccionadas];
  const ramosConSeccion = ramosActivos.filter(a => incorporadas.some(id => id.startsWith(a.id + '::')));
  const creditosTotales = ramosConSeccion.reduce((acc, a) => acc + a.creditos, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-5">
        <span className="chip bg-primary-100 text-primary-700 border border-primary-200">PASO 6 DE 8</span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-2">Resumen de tu Selección</h1>
        <p className="text-slate-600 mt-1 text-sm md:text-base">Revisa el detalle antes de confirmar tu inscripción.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold mb-1">Estudiante</div>
          <div className="font-bold text-slate-800">{ESTUDIANTE.nombre}</div>
          <div className="text-sm text-slate-500">{ESTUDIANTE.rut} · Expediente {ESTUDIANTE.expediente}</div>
        </div>
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold mb-1">Plan de Estudios</div>
          <div className="font-bold text-slate-800">{plan ? plan.nombre : '—'}</div>
          <div className="text-sm text-slate-500">{plan ? plan.facultad : ''}</div>
        </div>
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold mb-1">Totales</div>
          <div className="text-slate-800">
            <span className="font-black text-2xl">{ramosConSeccion.length}</span> ramos ·
            <span className="font-black text-2xl ml-2">{creditosTotales}</span> de {creditosMax} créditos
          </div>
          <div className="text-sm text-slate-500">{incorporadas.length} secciones incorporadas</div>
        </div>
      </div>

      <div className="card p-5 mb-6">
        <h2 className="font-bold text-slate-800 mb-4">Asignaturas y secciones seleccionadas</h2>
        <div className="space-y-4">
          {ramosConSeccion.map(asig => {
            const color = getColorPorAsignatura(asig.id);
            const secciones = incorporadas.filter(id => id.startsWith(asig.id + '::'));
            return (
              <div key={asig.id} className={`rounded-xl border-l-4 ${color.border} ${color.bgLight} border border-slate-100 p-4`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">[{asig.codigo}]</span>
                    <span className={`font-bold ${color.text}`}>{asig.nombre}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="chip bg-white border border-slate-200 text-slate-600">{TIPOS_ASIGNATURA[asig.tipo]}</span>
                    <span className="chip bg-white border border-slate-200 text-slate-600">Curso {asig.curso}</span>
                    <span className="chip bg-white border border-slate-200 text-slate-600">{asig.creditos} créditos</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {secciones.map(fullId => {
                    const [, seccId] = fullId.split('::');
                    const secc = buscarSeccionPorId(asig.id, seccId);
                    if (!secc) return null;
                    return (
                      <div key={fullId} className="bg-white rounded-lg border border-slate-100 p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`chip ${color.bg} text-white font-bold`}>{secc.codigo}</span>
                          <span className="text-xs text-slate-500">{TIPOS_SECCION[secc.tipo]}</span>
                        </div>
                        <div className="text-sm text-slate-700">{secc.profesor}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{secc.sala} · {formatoHorario(secc.horarios)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {ramosConSeccion.length === 0 && (
            <div className="text-center py-8 text-sm text-slate-400">No hay secciones incorporadas todavía.</div>
          )}
        </div>
      </div>

      <HorarioSemanal seccionesSeleccionadas={seccionesSeleccionadas} asignaturas={asignaturas} seccionHoverId={null} />

      <BarraNavegacion onAnterior={onAnterior} onSiguiente={onSiguiente} textoSiguiente="Ir a confirmar" />
    </div>
  );
}
