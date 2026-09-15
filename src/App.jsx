import { useState, useMemo } from 'react';
import Header from './components/Header.jsx';
import Stepper from './components/Stepper.jsx';
import HorarioSemanal, { hayChoqueHorario } from './components/HorarioSemanal.jsx';
import TarjetaAsignatura from './components/TarjetaAsignatura.jsx';
import PanelResumen, { BarraFiltros } from './components/PanelResumen.jsx';
import ModalDetalleSeccion from './components/ModalDetalleSeccion.jsx';
import { ASIGNATURAS } from './data/asignaturas.js';

export default function App() {
  const [pasoActual, setPasoActual] = useState(4);
  const [seccionesSeleccionadas, setSeccionesSeleccionadas] = useState(new Set([
    'PRO101::PRO101-1',
    'PRO102::PRO102-1',
    'MAT101::MAT101-1',
    'FIS101::FIS101-1'
  ]));
  const [asignaturasActivas, setAsignaturasActivas] = useState(new Set([
    'PRO101', 'PRO102', 'MAT101', 'FIS101', 'PRO201', 'BDA201', 'ARQ201', 'ING201'
  ]));
  const [seccionHoverId, setSeccionHoverId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [soloSeleccionadas, setSoloSeleccionadas] = useState(false);
  const [toast, setToast] = useState(null);
  const [modalData, setModalData] = useState(null);

  const mostrarToast = (mensaje, tipo = 'info') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleAsignatura = (asigId, checked) => {
    setAsignaturasActivas(prev => {
      const next = new Set(prev);
      if (checked) next.add(asigId);
      else {
        next.delete(asigId);
        setSeccionesSeleccionadas(prevS => {
          const nextS = new Set(prevS);
          [...nextS].filter(s => s.startsWith(asigId + '::')).forEach(s => nextS.delete(s));
          return nextS;
        });
        mostrarToast(`✓ Asignatura marcada como ${checked ? 'incluida' : 'excluida'}`, 'info');
      }
      return next;
    });
  };

  const handleSeleccionarSeccion = (seccFullId, seccion, asig) => {
    const [asigId] = seccFullId.split('::');

    if (hayChoqueHorario(seccionesSeleccionadas, seccion, seccFullId)) {
      mostrarToast('⚠ No se puede agregar: hay choque de horario', 'error');
      return;
    }
    if (seccion.cuposDisponibles === 0) {
      mostrarToast('⚠ Esta sección no tiene cupos disponibles', 'error');
      return;
    }

    const seccionesArr = Array.isArray(seccionesSeleccionadas) ? seccionesSeleccionadas : [...seccionesSeleccionadas];
    const nuevasSecciones = new Set(seccionesSeleccionadas);
    const delMismoTipo = seccionesArr
      .filter(s => s.startsWith(asigId + '::'))
      .map(s => {
        const [, seccId] = s.split('::');
        const sec = ASIGNATURAS.find(a => a.id === asigId)?.secciones.find(sc => sc.id === seccId);
        return { id: s, tipo: sec?.tipo };
      });

    const mismoTipo = delMismoTipo.find(x => x.tipo === seccion.tipo);
    if (mismoTipo) {
      nuevasSecciones.delete(mismoTipo.id);
      mostrarToast('ℹ Se reemplazó tu sección anterior del mismo tipo', 'info');
    }

    nuevasSecciones.add(seccFullId);
    setSeccionesSeleccionadas(nuevasSecciones);
    setAsignaturasActivas(prev => new Set([...prev, asigId]));
    mostrarToast(`✓ ${asig?.nombre} - ${seccion.codigo} agregada`, 'success');
  };

  const handleQuitarSeccion = (seccFullId) => {
    const [asigId, seccId] = seccFullId.split('::');
    const asig = ASIGNATURAS.find(a => a.id === asigId);
    const secc = asig?.secciones.find(s => s.id === seccId);
    const nuevas = new Set(seccionesSeleccionadas);
    nuevas.delete(seccFullId);
    setSeccionesSeleccionadas(nuevas);
    mostrarToast(`✗ ${asig?.nombre} - ${secc?.codigo} quitada`, 'warn');
  };

  const handleVerDetalle = (asignatura, seccion) => {
    const seccionesArr = Array.isArray(seccionesSeleccionadas) ? seccionesSeleccionadas : [...seccionesSeleccionadas];
    const isSeleccionada = seccionesArr.includes(`${asignatura.id}::${seccion.id}`);
    const hayChoque = !isSeleccionada && hayChoqueHorario(seccionesSeleccionadas, seccion, `${asignatura.id}::${seccion.id}`);
    setModalData({
      asignatura,
      seccion,
      seleccionada: isSeleccionada,
      hayChoque,
      sinCupo: seccion.cuposDisponibles === 0
    });
  };

  const asignaturasFiltradas = useMemo(() => {
    return ASIGNATURAS.filter(a => {
      if (busqueda) {
        const q = busqueda.toLowerCase().trim();
        if (!a.nombre.toLowerCase().includes(q) && !a.codigo.toLowerCase().includes(q)) return false;
      }
      if (filtroCurso !== 'todos' && a.curso !== parseInt(filtroCurso, 10)) return false;
      if (filtroTipo !== 'todos' && a.tipo !== filtroTipo) return false;
      if (soloDisponibles && !a.secciones.some(s => s.cuposDisponibles > 0)) return false;
      if (soloSeleccionadas && ![...seccionesSeleccionadas].some(s => s.startsWith(a.id + '::')) && !asignaturasActivas.has(a.id)) return false;
      return true;
    });
  }, [busqueda, filtroCurso, filtroTipo, soloDisponibles, soloSeleccionadas, seccionesSeleccionadas, asignaturasActivas]);

  const seccionesSet = useMemo(() => seccionesSeleccionadas, [seccionesSeleccionadas]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Header />
      <Stepper pasoActual={pasoActual} onCambiarPaso={setPasoActual} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="chip bg-primary-100 text-primary-700 border border-primary-200">
                  PASO 4 DE 5
                </span>
                <span className="chip bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Modo demostración
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                Elección de Secciones y Horario
              </h1>
              <p className="text-slate-600 mt-1 max-w-3xl text-sm md:text-base">
                Selecciona las secciones de cada asignatura. Al final verás tu horario armado.
                Usa el botón <span className="font-semibold text-primary-700">"Ver a detalle"</span> para ver toda la información de cada sección.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPasoActual(Math.max(1, pasoActual - 1))}
                className="btn-secondary text-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              <button
                onClick={() => {
                  if (seccionesSeleccionadas.size === 0) {
                    mostrarToast('⚠ Selecciona al menos una sección para continuar', 'error');
                    return;
                  }
                  setPasoActual(5);
                }}
                className="btn-primary text-sm"
              >
                Siguiente
                <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-8">
            <BarraFiltros
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              filtroCurso={filtroCurso}
              setFiltroCurso={setFiltroCurso}
              filtroTipo={filtroTipo}
              setFiltroTipo={setFiltroTipo}
              soloDisponibles={soloDisponibles}
              setSoloDisponibles={setSoloDisponibles}
              soloSeleccionadas={soloSeleccionadas}
              setSoloSeleccionadas={setSoloSeleccionadas}
              totalAsignaturas={ASIGNATURAS.length}
              mostradas={asignaturasFiltradas.length}
            />

            {asignaturasFiltradas.length === 0 ? (
              <div className="card p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-lg font-semibold text-slate-700 mb-1">No se encontraron asignaturas</div>
                <div className="text-sm text-slate-500">Prueba ajustando los filtros de búsqueda.</div>
              </div>
            ) : (
              <div className="space-y-4">
                {asignaturasFiltradas.map(asig => (
                  <TarjetaAsignatura
                    key={asig.id}
                    asignatura={asig}
                    seleccionada={asignaturasActivas.has(asig.id)}
                    seccionesSeleccionadas={[...seccionesSet]}
                    onToggleAsignatura={handleToggleAsignatura}
                    onSeleccionarSeccion={(id, sec) => handleSeleccionarSeccion(id, sec, asig)}
                    onQuitarSeccion={handleQuitarSeccion}
                    onHoverSeccion={setSeccionHoverId}
                    onVerDetalle={(sec) => handleVerDetalle(asig, sec)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <PanelResumen
              seccionesSeleccionadas={seccionesSet}
              asignaturas={ASIGNATURAS}
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
              <p className="text-sm text-slate-500 mt-1">
                Resultado final con las {seccionesSet.size} secciones que has seleccionado
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="chip bg-blue-50 text-blue-700 border border-blue-200">
                Lunes a Viernes 8:00 - 21:00
              </span>
            </div>
          </div>
          <HorarioSemanal
            seccionesSeleccionadas={seccionesSet}
            asignaturas={ASIGNATURAS}
            seccionHoverId={seccionHoverId}
          />
        </div>
      </main>

      {modalData && (
        <ModalDetalleSeccion
          data={modalData}
          onClose={() => setModalData(null)}
          onSeleccionar={() => {
            const { asignatura, seccion } = modalData;
            handleSeleccionarSeccion(`${asignatura.id}::${seccion.id}`, seccion, asignatura);
            setModalData(null);
          }}
          onQuitar={() => {
            const { asignatura, seccion } = modalData;
            handleQuitarSeccion(`${asignatura.id}::${seccion.id}`);
            setModalData(null);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`px-5 py-3 rounded-xl shadow-card border-l-4 flex items-center gap-3 max-w-sm ${
            toast.tipo === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-900' :
            toast.tipo === 'error' ? 'bg-red-50 border-red-500 text-red-900' :
            toast.tipo === 'warn' ? 'bg-amber-50 border-amber-500 text-amber-900' :
            'bg-blue-50 border-blue-500 text-blue-900'
          }`}>
            <div className="flex-1 text-sm font-medium">{toast.mensaje}</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes modal-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-modal-in { animation: modal-in 0.25s ease-out; }
        .animate-backdrop-in { animation: backdrop-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
