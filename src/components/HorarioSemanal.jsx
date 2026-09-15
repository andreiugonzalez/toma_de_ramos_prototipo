import { DIAS, HORAS, TIPOS_ASIGNATURA, TIPOS_SECCION, ASIGNATURAS } from '../data/asignaturas.js';

const COLORS = [
  { bg: 'bg-blue-500', bgLight: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', ring: 'ring-blue-200' },
  { bg: 'bg-emerald-500', bgLight: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  { bg: 'bg-purple-500', bgLight: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700', ring: 'ring-purple-200' },
  { bg: 'bg-rose-500', bgLight: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-700', ring: 'ring-rose-200' },
  { bg: 'bg-amber-500', bgLight: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', ring: 'ring-amber-200' },
  { bg: 'bg-cyan-500', bgLight: 'bg-cyan-50', border: 'border-cyan-500', text: 'text-cyan-700', ring: 'ring-cyan-200' },
  { bg: 'bg-indigo-500', bgLight: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-700', ring: 'ring-indigo-200' },
  { bg: 'bg-pink-500', bgLight: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-700', ring: 'ring-pink-200' },
  { bg: 'bg-teal-500', bgLight: 'bg-teal-50', border: 'border-teal-500', text: 'text-teal-700', ring: 'ring-teal-200' },
  { bg: 'bg-orange-500', bgLight: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700', ring: 'ring-orange-200' },
];

export function getColorPorAsignatura(asignaturaId) {
  let hash = 0;
  for (let i = 0; i < asignaturaId.length; i++) {
    hash = asignaturaId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

export function formatoHorario(horarios) {
  return horarios.map(h => {
    const horaInicio = HORAS[h.horaInicio];
    const horaFin = HORAS[h.horaInicio + h.duracion] || HORAS[HORAS.length - 1];
    return `${DIAS[h.dia].slice(0, 3)} ${horaInicio}-${horaFin}`;
  }).join(' · ');
}

export function hayChoqueHorario(seccionesSeleccionadas, seccionNueva, seccionIdActual = null) {
  const seccionesArr = Array.isArray(seccionesSeleccionadas) ? seccionesSeleccionadas : [...seccionesSeleccionadas];
  const horariosExistentes = [];
  seccionesArr.forEach(seccId => {
    if (seccId === seccionIdActual) return;
    const [asigId, secId] = seccId.split('::');
    const secc = buscarSeccionPorId(asigId, secId);
    if (secc) horariosExistentes.push(...secc.horarios);
  });

  for (const hNuevo of seccionNueva.horarios) {
    for (const hExistente of horariosExistentes) {
      if (hNuevo.dia !== hExistente.dia) continue;
      const nuevoInicio = hNuevo.horaInicio;
      const nuevoFin = hNuevo.horaInicio + hNuevo.duracion;
      const existInicio = hExistente.horaInicio;
      const existFin = hExistente.horaInicio + hExistente.duracion;
      if (nuevoInicio < existFin && nuevoFin > existInicio) return true;
    }
  }
  return false;
}

export function buscarSeccionPorId(asignaturaId, seccionId) {
  const asig = ASIGNATURAS.find(a => a.id === asignaturaId);
  return asig?.secciones.find(s => s.id === seccionId);
}

export default function HorarioSemanal({ seccionesSeleccionadas, asignaturas, seccionHoverId }) {
  const bloqueAlto = 56;
  const seccionesArr = Array.isArray(seccionesSeleccionadas) ? seccionesSeleccionadas : [...seccionesSeleccionadas];

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Tu Horario Semanal
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Vista previa en tiempo real de tu selección</p>
        </div>
        <div className="hidden md:flex gap-2 text-xs">
          {Object.entries(TIPOS_SECCION).map(([key, label]) => (
            <span key={key} className="chip bg-slate-100 text-slate-600 border border-slate-200">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[72px_repeat(6,1fr)] bg-slate-50 border-b border-slate-200">
            <div className="py-3 px-2 text-center text-xs font-semibold text-slate-500 border-r border-slate-200">
              HORA
            </div>
            {DIAS.map((dia, i) => (
              <div
                key={dia}
                className={`py-3 px-2 text-center text-xs font-bold text-slate-700 ${i < DIAS.length - 1 ? 'border-r border-slate-200' : ''}`}
              >
                {dia}
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-[72px_repeat(6,1fr)]">
            <div className="flex flex-col border-r border-slate-200">
              {HORAS.map((hora, i) => (
                <div
                  key={hora}
                  style={{ height: `${bloqueAlto}px` }}
                  className={`px-2 flex items-start justify-end pt-1 text-[11px] font-medium text-slate-500 border-b border-slate-100 ${i === 0 ? 'border-t-0' : ''}`}
                >
                  {hora}
                </div>
              ))}
            </div>

            {DIAS.map((_, diaIdx) => (
              <div
                key={diaIdx}
                className={`relative border-b-0 ${diaIdx < DIAS.length - 1 ? 'border-r border-slate-100' : ''}`}
              >
                {HORAS.map((_, horaIdx) => (
                  <div
                    key={horaIdx}
                    style={{ height: `${bloqueAlto}px` }}
                    className="border-b border-slate-100 bg-white hover:bg-primary-50/30 transition-colors"
                  />
                ))}

                {seccionesArr.map(seccFullId => {
                  const [asigId, seccId] = seccFullId.split('::');
                  const asig = asignaturas.find(a => a.id === asigId);
                  const secc = asig?.secciones.find(s => s.id === seccId);
                  if (!asig || !secc) return null;
                  const color = getColorPorAsignatura(asigId);

                  return secc.horarios
                    .filter(h => h.dia === diaIdx)
                    .map((horario, hidx) => {
                      const top = horario.horaInicio * bloqueAlto;
                      const height = horario.duracion * bloqueAlto - 4;
                      const isHover = seccionHoverId === seccFullId;
                      return (
                        <div
                          key={`${seccFullId}-${hidx}`}
                          className={`absolute left-1 right-1 rounded-lg border-l-4 ${color.border} ${color.bgLight} p-2 overflow-hidden shadow-sm transition-all duration-200 ${isHover ? 'ring-2 ' + color.ring + ' scale-[1.02] z-20' : 'z-10'}`}
                          style={{ top: top + 2, height }}
                        >
                          <div className="flex items-start gap-1.5 h-full flex-col">
                            <div className="flex items-center gap-1 w-full">
                              <span className={`w-2 h-2 rounded-full ${color.bg} flex-shrink-0`} />
                              <div className="text-[10px] font-bold text-slate-500 truncate">
                                {asig.codigo} · {secc.codigo}
                              </div>
                            </div>
                            <div className={`text-xs font-bold ${color.text} leading-tight line-clamp-2`}>
                              {asig.nombre}
                            </div>
                            <div className="mt-auto text-[10px] text-slate-600 space-y-0.5">
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="truncate">{secc.profesor.split(' ').slice(-1).join(' ')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{secc.sala}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
