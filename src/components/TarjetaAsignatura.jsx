import { useState } from 'react';
import { TIPOS_ASIGNATURA, TIPOS_SECCION, DIAS, HORAS } from '../data/asignaturas.js';
import { getColorPorAsignatura, formatoHorario, hayChoqueHorario } from './HorarioSemanal.jsx';

function BadgeTipo({ tipo }) {
  const configs = {
    OBLIGATORIA: 'bg-red-100 text-red-700 border-red-200',
    ELECTIVA: 'bg-blue-100 text-blue-700 border-blue-200',
    LIBRE: 'bg-violet-100 text-violet-700 border-violet-200'
  };
  return (
    <span className={`chip border ${configs[tipo] || configs.OBLIGATORIA}`}>
      {TIPOS_ASIGNATURA[tipo] || tipo}
    </span>
  );
}

function BadgeTipoSeccion({ tipo }) {
  const configs = {
    TEORIA: 'bg-slate-100 text-slate-700 border-slate-200',
    LABORATORIO: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    TALLER: 'bg-amber-100 text-amber-700 border-amber-200'
  };
  return (
    <span className={`chip border ${configs[tipo] || configs.TEORIA}`}>
      {TIPOS_SECCION[tipo] || tipo}
    </span>
  );
}

function CuposBar({ disponibles, total }) {
  const porcentaje = (disponibles / total) * 100;
  const color = porcentaje > 40 ? 'bg-emerald-500' : porcentaje > 15 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = porcentaje > 40 ? 'text-emerald-600' : porcentaje > 15 ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5 items-baseline">
        <span className="text-slate-500 font-semibold uppercase tracking-wide text-[11px]">Cupos disponibles:</span>
        <span className="font-mono font-bold">
          <span className={textColor}>{disponibles}</span>
          <span className="text-slate-400 mx-0.5">/</span>
          <span className="text-slate-700">{total}</span>
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  );
}

export default function TarjetaAsignatura({
  asignatura,
  seleccionada,
  seccionesSeleccionadas,
  onToggleAsignatura,
  onSeleccionarSeccion,
  onQuitarSeccion,
  onHoverSeccion,
  onVerDetalle
}) {
  const [expandido, setExpandido] = useState(true);
  const color = getColorPorAsignatura(asignatura.id);
  const seccionesAsig = seccionesSeleccionadas
    .filter(s => s.startsWith(asignatura.id + '::'))
    .map(s => s.split('::')[1]);

  return (
    <div className={`card transition-all duration-300 ${seleccionada ? `ring-2 ${color.ring} shadow-card` : 'shadow-soft'}`}>
      <div
        className="p-5 flex items-start gap-4"
      >
        <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={seleccionada}
              onChange={(e) => onToggleAsignatura(asignatura.id, e.target.checked)}
              className="w-5 h-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer transition-all group-hover:border-primary-400"
            />
          </label>
        </div>

        <div
          className={`w-1.5 rounded-full flex-shrink-0 self-stretch ${color.bg} min-h-[64px] transition-all ${seleccionada ? 'shadow-sm' : 'opacity-70'}`}
        />

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setExpandido(!expandido)}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 border border-slate-200">
              [{asignatura.codigo}]
            </span>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">
              Asignatura: <span className={color.text}>{asignatura.nombre}</span>
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BadgeTipo tipo={asignatura.tipo} />
            {asignatura.curso > 0 && (
              <span className="chip bg-slate-100 text-slate-700 border border-slate-200">
                <span className="font-bold mr-1">Curso:</span>{asignatura.curso}
              </span>
            )}
            <span className="chip bg-slate-50 text-slate-600 border border-slate-200">
              <span className="font-bold mr-1">Créditos:</span>{asignatura.creditos}
            </span>
            <span className="chip bg-slate-50 text-slate-600 border border-slate-200">
              <span className="font-bold mr-1">Secciones:</span>{asignatura.secciones.length}
            </span>
            {seccionesAsig.length > 0 && (
              <span className={`chip ${color.bgLight} ${color.text} border ${color.border} font-semibold`}>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {seccionesAsig.length} seleccionada{seccionesAsig.length > 1 ? 's' : ''}
              </span>
            )}
            {!seleccionada && (
              <span className="chip bg-slate-100 text-slate-500 border border-slate-200">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Marca el checkbox para incluir este ramo
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpandido(!expandido)}
          className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
            expandido
              ? `bg-${color.bg?.replace('bg-', '')}/10 ${color.text}`
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          aria-label={expandido ? 'Contraer secciones' : 'Expandir secciones'}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${expandido ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandido ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 pt-0 border-t border-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {asignatura.secciones.map(seccion => {
              const seccFullId = `${asignatura.id}::${seccion.id}`;
              const isSeleccionada = seccionesAsig.includes(seccion.id);
              const hayChoque = !isSeleccionada && hayChoqueHorario(seccionesSeleccionadas, seccion, seccFullId);
              const casiLleno = seccion.cuposDisponibles <= 10 && seccion.cuposDisponibles > 0;
              const sinCupo = seccion.cuposDisponibles === 0;

              return (
                <div
                  key={seccion.id}
                  className={`relative rounded-2xl border-2 transition-all duration-200 flex flex-col ${
                    isSeleccionada
                      ? `${color.border} ${color.bgLight}`
                      : hayChoque
                      ? 'border-red-200 bg-red-50/40'
                      : sinCupo
                      ? 'border-slate-200 bg-slate-50 opacity-70'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-card'
                  }`}
                  onMouseEnter={() => onHoverSeccion && onHoverSeccion(seccFullId)}
                  onMouseLeave={() => onHoverSeccion && onHoverSeccion(null)}
                >
                  {isSeleccionada && (
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${color.bg} text-white flex items-center justify-center shadow-lg z-10 ring-4 ring-white`}>
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {hayChoque && (
                    <div className="absolute -top-2 -right-2 chip bg-red-500 text-white text-[10px] z-10 ring-4 ring-white shadow-md font-bold">
                      ¡Choque!
                    </div>
                  )}
                  {casiLleno && !isSeleccionada && !hayChoque && !sinCupo && (
                    <div className="absolute -top-2 -right-2 chip bg-amber-500 text-white text-[10px] z-10 ring-4 ring-white shadow-md font-bold animate-pulse">
                      ¡Últimos!
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl ${color.bgLight} ${color.border} border-2 flex items-center justify-center flex-shrink-0`}>
                          <span className={`font-black text-sm ${color.text}`}>{seccion.codigo.split('-')[1] || seccion.codigo.slice(-1)}</span>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-slate-500">{seccion.codigo}</div>
                          <BadgeTipoSeccion tipo={seccion.tipo} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4 flex-1">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-0.5 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profesor:
                        </div>
                        <div className="text-sm font-semibold text-slate-800 leading-tight">
                          {seccion.profesor}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-0.5 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Sala:
                        </div>
                        <div className="text-sm font-semibold text-slate-800">
                          {seccion.sala}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-0.5 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Horario:
                        </div>
                        <div className="text-xs font-semibold text-slate-700 leading-relaxed space-y-0.5">
                          {seccion.horarios.map((h, i) => {
                            const horaInicio = HORAS[h.horaInicio];
                            const horaFin = HORAS[h.horaInicio + h.duracion] || HORAS[HORAS.length - 1];
                            return (
                              <div key={i} className="flex items-center gap-1.5">
                                <span className={`chip ${color.bgLight} ${color.text} border ${color.border} text-[10px] py-0`}>
                                  {DIAS[h.dia]}
                                </span>
                                <span className="font-mono">{horaInicio} - {horaFin}</span>
                                <span className="text-slate-400 text-[10px]">({h.duracion}h)</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <CuposBar disponibles={seccion.cuposDisponibles} total={seccion.cupos} />
                    </div>

                    <div className="space-y-2 mt-auto">
                      <button
                        onClick={() => onVerDetalle && onVerDetalle(seccion)}
                        className={`w-full btn text-sm py-2 transition-all ${
                          isSeleccionada
                            ? `bg-white ${color.text} border ${color.border} hover:${color.bgLight}`
                            : hayChoque
                            ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            : sinCupo
                            ? 'bg-white text-slate-400 border border-slate-200 cursor-not-allowed'
                            : `bg-white text-slate-700 border-2 border-slate-200 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/50 font-semibold`
                        }`}
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver a detalle
                      </button>

                      {isSeleccionada ? (
                        <button
                          onClick={() => onQuitarSeccion(seccFullId)}
                          className="w-full btn bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-sm py-2 font-semibold"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Quitar sección
                        </button>
                      ) : (
                        <button
                          onClick={() => !sinCupo && !hayChoque && onSeleccionarSeccion(seccFullId, seccion)}
                          disabled={sinCupo || hayChoque || !seleccionada}
                          className={`w-full btn text-sm py-2 font-semibold ${
                            !seleccionada
                              ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200'
                              : hayChoque
                              ? 'bg-red-100 text-red-700 border border-red-200 cursor-not-allowed'
                              : sinCupo
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              : `${color.bg} hover:opacity-90 text-white shadow-md shadow-${color.bg.replace('bg-', '')}/30`
                          }`}
                        >
                          {!seleccionada ? (
                            <>
                              <svg className="w-4 h-4 mr-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Marca el ramo primero
                            </>
                          ) : sinCupo ? (
                            'Sin cupos disponibles'
                          ) : hayChoque ? (
                            <>
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Choque de horario
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Seleccionar sección
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
