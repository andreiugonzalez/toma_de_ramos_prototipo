import { useMemo, useState } from 'react';
import { TIPOS_ASIGNATURA } from '../data/asignaturas.js';
import BarraNavegacion from './BarraNavegacion.jsx';
import ModalInformacion from './ModalInformacion.jsx';

const GRUPOS = [
  { tipo: 'OBLIGATORIA', label: 'Asignaturas Obligatorias', descripcion: 'Ramos del plan que debes cursar.', color: 'red' },
  { tipo: 'ELECTIVA', label: 'Asignaturas Electivas', descripcion: 'Ramos optativos para completar tu formación.', color: 'blue' },
  { tipo: 'LIBRE', label: 'Asignaturas Libres', descripcion: 'Cursos de libre elección de otras facultades.', color: 'violet' }
];

export function infoRamo(asig) {
  const seccionesDisponibles = asig.secciones.filter(s => s.cuposDisponibles > 0 && !s.suspendida).length;
  return {
    titulo: `${asig.codigo} · ${asig.nombre}`,
    subtitulo: `${TIPOS_ASIGNATURA[asig.tipo] || asig.tipo} · ${asig.creditos} créditos${asig.curso > 0 ? ` · Curso ${asig.curso}` : ''}`,
    contenido: [
      `Asignatura de carácter ${(TIPOS_ASIGNATURA[asig.tipo] || asig.tipo).toLowerCase()} con una carga académica de ${asig.creditos} créditos.`,
      `Tiene ${asig.secciones.length} sección(es) en total y ${seccionesDisponibles} con cupos disponibles para este periodo.`,
      'Al marcarla, la asignatura se incluirá en tu proceso y podrás elegir una sección en el Paso 5. Debes seleccionar al menos una sección por tipo (teoría, laboratorio o taller).',
      'El horario definitivo se valida automáticamente contra choques con tus otras asignaturas.'
    ]
  };
}

export default function Paso4Asignaturas({
  asignaturas,
  activas,
  onToggleAsignatura,
  onAnterior,
  onSiguiente,
  creditosMax
}) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [orden, setOrden] = useState('asc');
  const [abiertos, setAbiertos] = useState(() => new Set(GRUPOS.map(g => g.tipo)));
  const [infoModal, setInfoModal] = useState(null);

  const filtradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    const lista = asignaturas.filter(a => {
      if (filtroTipo !== 'todos' && a.tipo !== filtroTipo) return false;
      if (q && !a.nombre.toLowerCase().includes(q) && !a.codigo.toLowerCase().includes(q)) return false;
      return true;
    });
    return [...lista].sort((a, b) => orden === 'asc'
      ? a.nombre.localeCompare(b.nombre, 'es')
      : b.nombre.localeCompare(a.nombre, 'es'));
  }, [asignaturas, busqueda, filtroTipo, orden]);

  const activasList = asignaturas.filter(a => activas.has(a.id));
  const creditosSeleccionados = activasList.reduce((acc, a) => acc + a.creditos, 0);

  const toggleGrupo = (tipo) => setAbiertos(prev => {
    const next = new Set(prev);
    next.has(tipo) ? next.delete(tipo) : next.add(tipo);
    return next;
  });

  const ayuda = [
    { key: 'reglamento', titulo: 'Reglamento de toma de ramos', contenido: ['El proceso se realiza exclusivamente en línea durante el periodo informado.', 'Debes inscribir entre un mínimo de 2 y un máximo de 8 asignaturas por semestre, respetando el tope de créditos de tu plan.'] },
    { key: 'inscripcion', titulo: 'Cómo inscribir asignaturas', contenido: ['Marca el checkbox de cada asignatura que desees cursar.', 'En el siguiente paso elegirás las secciones y el horario.', 'Verifica los requisitos (prerrequisitos aprobados) antes de marcarla.'] },
    { key: 'secretaria', titulo: 'Contacto Secretaría de Estudios', contenido: ['Correo: secretaria.ingenieria@ucentral.cl', 'Atención: Lunes a viernes de 09:00 a 17:30 hrs.', 'Mesa de ayuda: anexo 4210.'] },
    { key: 'faq', titulo: 'Preguntas frecuentes', contenido: ['¿Puedo modificar mi selección? Sí, mientras no finalices el proceso.', '¿Qué pasa si una sección se suspende? Podrás elegir otra sección disponible.', '¿Cómo sé si cumplo los prerrequisitos? El sistema lo validará automáticamente.'] }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-5">
        <span className="chip bg-primary-100 text-primary-700 border border-primary-200">PASO 4 DE 8</span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-2">Selección de Asignaturas</h1>
        <p className="text-slate-600 mt-1 text-sm md:text-base">
          Marca las asignaturas que cursarás. Usa los filtros de tipología y orden, y el ícono <span className="font-semibold">“i”</span> para ver información detallada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="card p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5 relative">
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
              <div className="md:col-span-4">
                <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="select-field w-full">
                  <option value="todos">Todas las tipologías</option>
                  {Object.entries(TIPOS_ASIGNATURA).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <select value={orden} onChange={(e) => setOrden(e.target.value)} className="select-field w-full">
                  <option value="asc">Orden ascendente (A-Z)</option>
                  <option value="desc">Orden descendente (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {GRUPOS.map(grupo => {
            const items = filtradas.filter(a => a.tipo === grupo.tipo);
            if (items.length === 0) return null;
            const abierto = abiertos.has(grupo.tipo);
            const seleccionadasGrupo = items.filter(a => activas.has(a.id)).length;
            return (
              <div key={grupo.tipo} className="card overflow-hidden">
                <button
                  onClick={() => toggleGrupo(grupo.tipo)}
                  className="w-full flex items-center justify-between gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-1.5 self-stretch rounded-full bg-${grupo.color}-500`} />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800">{grupo.label}</div>
                      <div className="text-xs text-slate-500">{grupo.descripcion} · {items.length} asignatura(s)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {seleccionadasGrupo > 0 && (
                      <span className="chip bg-primary-100 text-primary-700 border border-primary-200">{seleccionadasGrupo} marcada(s)</span>
                    )}
                    <svg className={`w-5 h-5 text-slate-400 transition-transform ${abierto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {abierto && (
                  <div className="border-t border-slate-100 divide-y divide-slate-50">
                    {items.map(asig => {
                      const seleccionada = activas.has(asig.id);
                      return (
                        <div key={asig.id} className={`flex items-start gap-3 p-4 transition-colors ${seleccionada ? 'bg-primary-50/50' : 'hover:bg-slate-50'}`}>
                          <input
                            type="checkbox"
                            checked={seleccionada}
                            onChange={(e) => onToggleAsignatura(asig.id, e.target.checked)}
                            className="mt-1 w-5 h-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 border border-slate-200">[{asig.codigo}]</span>
                              <span className="font-bold text-slate-800">{asig.nombre}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
                              <span>Créditos: <span className="font-semibold text-slate-700">{asig.creditos}</span></span>
                              {asig.curso > 0 && <span>Curso: <span className="font-semibold text-slate-700">{asig.curso}</span></span>}
                              <span>Secciones: <span className="font-semibold text-slate-700">{asig.secciones.length}</span></span>
                            </div>
                          </div>
                          <button
                            onClick={() => setInfoModal(infoRamo(asig))}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-primary-100 text-slate-500 hover:text-primary-700 flex items-center justify-center transition-colors flex-shrink-0"
                            aria-label={`Información de ${asig.nombre}`}
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filtradas.length === 0 && (
            <div className="card p-10 text-center">
              <div className="text-lg font-semibold text-slate-700 mb-1">No se encontraron asignaturas</div>
              <div className="text-sm text-slate-500">Prueba ajustando los filtros de búsqueda.</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="card p-5 lg:sticky lg:top-4">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Tu selección
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-primary-50 rounded-lg p-3 text-center border border-primary-100">
                <div className="text-2xl font-black text-primary-700">{activasList.length}</div>
                <div className="text-[11px] text-primary-600 font-medium">Asignaturas</div>
              </div>
              <div className={`rounded-lg p-3 text-center border ${creditosSeleccionados > creditosMax ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className={`text-2xl font-black ${creditosSeleccionados > creditosMax ? 'text-red-700' : 'text-emerald-700'}`}>{creditosSeleccionados}</div>
                <div className={`text-[11px] font-medium ${creditosSeleccionados > creditosMax ? 'text-red-600' : 'text-emerald-600'}`}>de {creditosMax} créditos</div>
              </div>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {activasList.length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-400">Aún no has marcado asignaturas.</div>
              ) : (
                activasList.map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                    <div className="min-w-0">
                      <div className="text-xs font-mono font-bold text-slate-500">{a.codigo}</div>
                      <div className="text-sm font-semibold text-slate-700 truncate">{a.nombre}</div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 flex-shrink-0">{a.creditos} cr.</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 3-4 3-4 3m0 3h.01" />
                <circle cx="12" cy="12" r="9" />
              </svg>
              Ayuda y enlaces
            </h3>
            <div className="space-y-1">
              {ayuda.map(enlace => (
                <button
                  key={enlace.key}
                  onClick={() => setInfoModal({ titulo: enlace.titulo, contenido: enlace.contenido })}
                  className="w-full flex items-center justify-between gap-2 text-left text-sm text-slate-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <span>{enlace.titulo}</span>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BarraNavegacion
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
        deshabilitarSiguiente={activasList.length === 0}
        hintSiguiente={activasList.length === 0 ? 'Marca al menos una asignatura para continuar' : undefined}
      />

      <ModalInformacion data={infoModal} onClose={() => setInfoModal(null)} />
    </div>
  );
}
