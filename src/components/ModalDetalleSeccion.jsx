import { useEffect } from 'react';
import { DIAS, HORAS, TIPOS_ASIGNATURA, TIPOS_SECCION } from '../data/asignaturas.js';
import { getColorPorAsignatura } from './HorarioSemanal.jsx';

export default function ModalDetalleSeccion({ data, onClose, onSeleccionar, onQuitar }) {
  const { asignatura, seccion, seleccionada, hayChoque, sinCupo } = data;
  const color = getColorPorAsignatura(asignatura.id);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const disponibilidad = seccion.cuposDisponibles;
  const total = seccion.cupos;
  const porcentajeDisp = (disponibilidad / total) * 100;
  const disponibilidadColor = porcentajeDisp > 40 ? 'emerald' : porcentajeDisp > 15 ? 'amber' : 'red';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-in" />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl animate-modal-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-br ${color.bgLight}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-wrap items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl ${color.bg} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="chip bg-white shadow-sm text-slate-600 border border-white font-mono font-bold">
                  {asignatura.codigo}
                </span>
                <span className={`chip border ${color.bg} text-white font-bold`}>
                  {seccion.codigo}
                </span>
                <span className="chip bg-white border border-slate-200 text-slate-700 shadow-sm">
                  {TIPOS_SECCION[seccion.tipo] || seccion.tipo}
                </span>
                <span className="chip bg-white border border-slate-200 text-slate-700 shadow-sm">
                  {TIPOS_ASIGNATURA[asignatura.tipo] || asignatura.tipo}
                </span>
                {asignatura.curso > 0 && (
                  <span className="chip bg-white border border-slate-200 text-slate-700 shadow-sm">
                    Curso {asignatura.curso}
                  </span>
                )}
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black ${color.text} leading-tight mb-2`}>
                {asignatura.nombre}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Sección:</span>
                <span>{seccion.codigo} · {TIPOS_SECCION[seccion.tipo]}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {seleccionada && (
              <span className={`chip ${color.bg} text-white shadow-md animate-pulse`}>
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Seleccionada actualmente
              </span>
            )}
            {hayChoque && (
              <span className="chip bg-red-500 text-white shadow-md">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Choque de horario con otra sección
              </span>
            )}
            {sinCupo && (
              <span className="chip bg-slate-700 text-white shadow-md">
                Sin cupos disponibles
              </span>
            )}
            {porcentajeDisp <= 20 && !sinCupo && !hayChoque && !seleccionada && (
              <span className="chip bg-amber-500 text-white shadow-md animate-pulse">
                ⚠ Últimos cupos disponibles
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label="Profesor:"
              value={seccion.profesor}
              accent={color.text}
            />
            <InfoItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              label="Sala:"
              value={seccion.sala}
              accent={color.text}
            />
            <InfoItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              label="Asignatura:"
              value={`${asignatura.codigo} - ${asignatura.nombre}`}
              accent={color.text}
            />
            <InfoItem
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
              label="Créditos:"
              value={`${asignatura.creditos} créditos · ${TIPOS_ASIGNATURA[asignatura.tipo]}`}
              accent={color.text}
            />
          </div>

          <div className={`rounded-2xl border p-5 sm:p-6 ${color.bgLight} ${color.border}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-9 h-9 rounded-lg ${color.bg} text-white flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-lg font-bold ${color.text}`}>
                Horarios de esta sección
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seccion.horarios.map((h, i) => {
                const horaInicio = HORAS[h.horaInicio];
                const horaFin = HORAS[h.horaInicio + h.duracion] || HORAS[HORAS.length - 1];
                return (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-white/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`font-bold text-base ${color.text}`}>{DIAS[h.dia]}</div>
                      <div className="chip bg-slate-100 text-slate-600 text-xs">
                        Bloque {h.duracion}h
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-mono font-bold text-slate-800 text-lg tracking-tight">
                        {horaInicio}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="font-mono font-bold text-slate-800 text-lg tracking-tight">
                        {horaFin}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Sala: <span className="font-semibold text-slate-700">{seccion.sala}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Disponibilidad de cupos</h3>
              </div>
              <div className="text-lg font-black text-slate-800 font-mono">
                <span className={`text-${disponibilidadColor}-600`}>{disponibilidad}</span>
                <span className="text-slate-400 mx-0.5">/</span>
                <span>{total}</span>
              </div>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-${disponibilidadColor}-500 transition-all duration-700`}
                style={{ width: `${porcentajeDisp}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-slate-500">
                <span className={`font-semibold text-${disponibilidadColor}-600`}>
                  {porcentajeDisp.toFixed(0)}% disponible
                </span>
              </span>
              <span className="text-slate-400">
                {total - disponibilidad} cupos tomados
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="btn-secondary px-6 flex-1 sm:flex-none order-2 sm:order-1"
          >
            Cerrar
          </button>
          {seleccionada ? (
            <button
              onClick={onQuitar}
              className="btn border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 px-6 flex-1 sm:flex-none order-1 sm:order-2 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Quitar esta sección
            </button>
          ) : (
            <button
              onClick={onSeleccionar}
              disabled={hayChoque || sinCupo}
              className={`btn ${
                hayChoque
                  ? 'bg-red-100 text-red-700 border border-red-200 cursor-not-allowed'
                  : sinCupo
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : `${color.bg} hover:opacity-90 text-white shadow-lg shadow-${color.bg.replace('bg-', '')}/30`
              } px-6 flex-1 sm:flex-none order-1 sm:order-2`}
            >
              {hayChoque ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Choque de horario
                </>
              ) : sinCupo ? (
                'Sin cupos'
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
}

function InfoItem({ icon, label, value, accent }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 hover:bg-slate-100/60 transition-colors">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-slate-400">{icon}</span>
        <span className={`text-xs font-bold uppercase tracking-wide ${accent}`}>{label}</span>
      </div>
      <div className="text-sm font-semibold text-slate-800 leading-snug">{value}</div>
    </div>
  );
}
