import { useMemo, useState } from 'react';
import { TIPOS_SECCION } from '../data/asignaturas.js';
import TarjetaAsignatura from './TarjetaAsignatura.jsx';
import PanelResumen from './PanelResumen.jsx';
import HorarioSemanal, { hayChoqueHorario, buscarSeccionPorId } from './HorarioSemanal.jsx';
import ModalDetalleSeccion from './ModalDetalleSeccion.jsx';
import BarraNavegacion from './BarraNavegacion.jsx';

export default function Paso5Secciones({
  asignaturas,
  ramosActivos,
  seccionesSeleccionadas,
  onChangeSecciones,
  onAnterior,
  onSiguiente,
  mostrarToast,
  creditosMax
}) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [ocultarSuspendidas, setOcultarSuspendidas] = useState(true);
  const [seccionHoverId, setSeccionHoverId] = useState(null);
  const [modalData, setModalData] = useState(null);

  const ramosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return ramosActivos
      .filter(a => {
        if (filtroCurso !== 'todos' && a.curso !== parseInt(filtroCurso, 10)) return false;
        if (q && !a.nombre.toLowerCase().includes(q) && !a.codigo.toLowerCase().includes(q)) return false;
        return true;
      })
      .map(a => ({
        ...a,
        secciones: a.secciones.filter(s => {
          if (filtroTipo !== 'todos' && s.tipo !== filtroTipo) return false;
          if (ocultarSuspendidas && s.suspendida) return false;
          return true;
        })
      }))
      .filter(a => a.secciones.length > 0);
  }, [ramosActivos, busqueda, filtroCurso, filtroTipo, ocultarSuspendidas]);

  const quitar = (fullId) => {
    const [asigId, seccId] = fullId.split('::');
    const asig = asignaturas.find(a => a.id === asigId);
    const secc = asig?.secciones.find(s => s.id === seccId);
    const nuevas = new Set(seccionesSeleccionadas);
    nuevas.delete(fullId);
    onChangeSecciones(nuevas);
    mostrarToast(`✗ ${asig?.nombre} - ${secc?.codigo} quitada del horario`, 'warn');
  };

  const agregarSeccion = (fullId, seccion) => {
    if (seccion.suspendida) {
      mostrarToast('Esta sección está suspendida', 'error');
      return;
    }
    if (seccion.cuposDisponibles === 0) {
      mostrarToast('Esta sección no tiene cupos disponibles', 'error');
      return;
    }
    const [asigId] = fullId.split('::');
    const resultantes = new Set(seccionesSeleccionadas);
    [...resultantes].forEach(id => {
      const [aId, sId] = id.split('::');
      if (aId === asigId && buscarSeccionPorId(aId, sId)?.tipo === seccion.tipo) resultantes.delete(id);
    });
    if (hayChoqueHorario(resultantes, seccion, fullId)) {
      mostrarToast('Choque de horario con otra sección de tu horario', 'error');
      return;
    }
    resultantes.add(fullId);
    onChangeSecciones(resultantes);
    mostrarToast('✓ Sección agregada a tu horario', 'success');
  };

  const toggleSeccion = (fullId, seccion) => {
    if (seccionesSeleccionadas.has(fullId)) {
      quitar(fullId);
    } else {
      agregarSeccion(fullId, seccion);
    }
  };

  const seleccionMasiva = () => {
    const resultantes = new Set(seccionesSeleccionadas);
    let agregadas = 0;
    ramosFiltrados.forEach(asig => {
      asig.secciones.forEach(sec => {
        const fullId = `${asig.id}::${sec.id}`;
        if (resultantes.has(fullId) || sec.suspendida || sec.cuposDisponibles === 0) return;
        [...resultantes].forEach(id => {
          const [aId, sId] = id.split('::');
          if (aId === asig.id && buscarSeccionPorId(aId, sId)?.tipo === sec.tipo) resultantes.delete(id);
        });
        if (hayChoqueHorario(resultantes, sec, fullId)) return;
        resultantes.add(fullId);
        agregadas++;
      });
    });
    onChangeSecciones(resultantes);
    mostrarToast(
      agregadas > 0 ? `✓ ${agregadas} sección(es) agregada(s) a tu horario` : 'No hay secciones nuevas por agregar',
      agregadas > 0 ? 'success' : 'info'
    );
  };

  const handleVerDetalle = (asig, seccion) => {
    const fullId = `${asig.id}::${seccion.id}`;
    const incorporada = seccionesSeleccionadas.has(fullId);
    setModalData({
      asignatura: asig,
      seccion,
      seleccionada: incorporada,
      hayChoque: !incorporada && hayChoqueHorario(seccionesSeleccionadas, seccion, fullId),
      sinCupo: seccion.cuposDisponibles === 0,
      suspendida: !!seccion.suspendida
    });
  };

  const cerrarModalTras = (accion) => {
    const { asignatura, seccion } = modalData;
    accion(`${asignatura.id}::${seccion.id}`, seccion);
    setModalData(null);
  };

  if (ramosActivos.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-10 text-center">
          <div className="text-lg font-semibold text-slate-700 mb-1">No tienes asignaturas seleccionadas</div>
          <div className="text-sm text-slate-500 mb-6">Vuelve al Paso 4 y marca al menos una asignatura para continuar.</div>
          <button onClick={onAnterior} className="btn-secondary text-sm mx-auto">Volver a Selección de Asignaturas</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <span className="chip bg-primary-100 text-primary-700 border border-primary-200">PASO 5 DE 8</span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-2">Elección de Secciones y Horario</h1>
        <p className="text-slate-600 mt-1 text-sm md:text-base">
          Presiona <span className="font-semibold text-primary-700">“Agregar al horario”</span> en la sección que quieras y se sumará a tu horario al instante. Usa “Ver a detalle” para revisar toda la información.
        </p>
      </div>

      <div className="card p-4 mb-6 md:sticky md:top-0 z-30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4 relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Buscar ramo o código..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="input-field pl-9" />
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
              <option value="todos">Toda tipología</option>
              {Object.entries(TIPOS_SECCION).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4 flex flex-wrap items-center gap-2 md:justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={ocultarSuspendidas} onChange={(e) => setOcultarSuspendidas(e.target.checked)} className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
              <span className="whitespace-nowrap">Ocultar suspendidas</span>
            </label>
            <button onClick={seleccionMasiva} className="btn-secondary text-sm">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Selección masiva
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100">
          <div className="text-sm text-slate-600">
            <span className="font-bold text-emerald-600">{seccionesSeleccionadas.size}</span> sección(es) en tu horario
          </div>
          <div className="text-xs text-slate-400">
            Los cambios se reflejan al instante en el horario y en el resumen
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 space-y-4">
          {ramosFiltrados.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-lg font-semibold text-slate-700 mb-1">No se encontraron ramos</div>
              <div className="text-sm text-slate-500">Prueba ajustando los filtros.</div>
            </div>
          ) : (
            ramosFiltrados.map(asig => (
              <TarjetaAsignatura
                key={asig.id}
                asignatura={asig}
                incorporadas={seccionesSeleccionadas}
                onToggleSeccion={toggleSeccion}
                onVerDetalle={(sec) => handleVerDetalle(asig, sec)}
                onHoverSeccion={setSeccionHoverId}
              />
            ))
          )}
        </div>

        <div className="lg:col-span-4">
          <PanelResumen
            ramosActivos={ramosActivos}
            seccionesSeleccionadas={seccionesSeleccionadas}
            asignaturas={asignaturas}
            creditosMaximos={creditosMax}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Tu Horario Semanal Armado
            </h2>
            <p className="text-sm text-slate-500 mt-1">Resultado en tiempo real con las {seccionesSeleccionadas.size} secciones incorporadas</p>
          </div>
        </div>
        <HorarioSemanal seccionesSeleccionadas={seccionesSeleccionadas} asignaturas={asignaturas} seccionHoverId={seccionHoverId} />
      </div>

      <BarraNavegacion
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
        deshabilitarSiguiente={seccionesSeleccionadas.size === 0}
        hintSiguiente={seccionesSeleccionadas.size === 0 ? 'Agrega al menos una sección para continuar' : undefined}
      />

      {modalData && (
        <ModalDetalleSeccion
          data={modalData}
          textoAccion="Agregar al horario"
          onClose={() => setModalData(null)}
          onSeleccionar={() => cerrarModalTras(toggleSeccion)}
          onQuitar={() => cerrarModalTras((fullId) => quitar(fullId))}
        />
      )}
    </div>
  );
}
