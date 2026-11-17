import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Stepper from './components/Stepper.jsx';
import Paso1Bienvenida from './components/Paso1Bienvenida.jsx';
import Paso2DatosPersonales from './components/Paso2DatosPersonales.jsx';
import Paso3PlanEstudios from './components/Paso3PlanEstudios.jsx';
import Paso4Asignaturas from './components/Paso4Asignaturas.jsx';
import Paso5Secciones from './components/Paso5Secciones.jsx';
import Paso6Resumen from './components/Paso6Resumen.jsx';
import Paso7Confirmacion from './components/Paso7Confirmacion.jsx';
import Paso8Final from './components/Paso8Final.jsx';
import { ASIGNATURAS, ESTUDIANTE, PLANES, PASOS } from './data/asignaturas.js';
import useTemporizadorCita from './hooks/useTemporizadorCita.js';

export default function App() {
  const [pasoActual, setPasoActual] = useState(1);
  const [planSeleccionado, setPlanSeleccionado] = useState('IP2023');
  const [asignaturasActivas, setAsignaturasActivas] = useState(new Set([
    'PRO101', 'MAT101', 'ELE301'
  ]));
  const [seccionesSeleccionadas, setSeccionesSeleccionadas] = useState(new Set([
    'PRO101::PRO101-1',
    'MAT101::MAT101-1',
    'ELE301::ELE301-1'
  ]));
  const [toast, setToast] = useState(null);

  const mostrarToast = (mensaje, tipo = 'info') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3200);
  };

  const { formato: tiempoFormato, critico } = useTemporizadorCita(ESTUDIANTE.duracionCitaMin, (restante) => {
    const minutos = Math.round(restante / 60);
    mostrarToast(minutos > 0 ? `⏰ Su cita finalizará en ${minutos} minuto(s)` : '⏰ El tiempo de su cita ha finalizado', minutos <= 5 ? 'error' : 'warn');
  });

  const plan = PLANES.find(p => p.id === planSeleccionado);
  const creditosMax = plan ? plan.creditosMaxSemestre : 35;
  const ramosActivos = useMemo(() => ASIGNATURAS.filter(a => asignaturasActivas.has(a.id)), [asignaturasActivas]);

  const irAPaso = (n) => {
    setPasoActual(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAsignatura = (asigId, checked) => {
    setAsignaturasActivas(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(asigId);
      } else {
        next.delete(asigId);
        setSeccionesSeleccionadas(prevS => {
          const nextS = new Set(prevS);
          [...nextS].filter(s => s.startsWith(asigId + '::')).forEach(s => nextS.delete(s));
          return nextS;
        });
      }
      return next;
    });
  };

  const resumenFinal = {
    asignaturas: ramosActivos.filter(a => seccionesSeleccionadas.size > 0).length,
    secciones: seccionesSeleccionadas.size,
    creditos: ramosActivos
      .filter(a => [...seccionesSeleccionadas].some(id => id.startsWith(a.id + '::')))
      .reduce((acc, a) => acc + a.creditos, 0)
  };

  const renderPaso = () => {
    switch (pasoActual) {
      case 1:
        return <Paso1Bienvenida onSiguiente={() => irAPaso(2)} />;
      case 2:
        return <Paso2DatosPersonales onAnterior={() => irAPaso(1)} onSiguiente={() => irAPaso(3)} />;
      case 3:
        return (
          <Paso3PlanEstudios
            planSeleccionado={planSeleccionado}
            onSeleccionarPlan={setPlanSeleccionado}
            onAnterior={() => irAPaso(2)}
            onSiguiente={() => irAPaso(4)}
          />
        );
      case 4:
        return (
          <Paso4Asignaturas
            asignaturas={ASIGNATURAS}
            activas={asignaturasActivas}
            onToggleAsignatura={handleToggleAsignatura}
            onAnterior={() => irAPaso(3)}
            onSiguiente={() => irAPaso(5)}
            creditosMax={creditosMax}
          />
        );
      case 5:
        return (
          <Paso5Secciones
            asignaturas={ASIGNATURAS}
            ramosActivos={ramosActivos}
            seccionesSeleccionadas={seccionesSeleccionadas}
            onChangeSecciones={setSeccionesSeleccionadas}
            onAnterior={() => irAPaso(4)}
            onSiguiente={() => irAPaso(6)}
            mostrarToast={mostrarToast}
            creditosMax={creditosMax}
          />
        );
      case 6:
        return (
          <Paso6Resumen
            planId={planSeleccionado}
            ramosActivos={ramosActivos}
            seccionesSeleccionadas={seccionesSeleccionadas}
            asignaturas={ASIGNATURAS}
            creditosMax={creditosMax}
            onAnterior={() => irAPaso(5)}
            onSiguiente={() => irAPaso(7)}
          />
        );
      case 7:
        return (
          <Paso7Confirmacion
            planId={planSeleccionado}
            ramosActivos={ramosActivos}
            seccionesSeleccionadas={seccionesSeleccionadas}
            creditosMax={creditosMax}
            onAnterior={() => irAPaso(6)}
            onConfirmar={() => {
              mostrarToast('✓ Inscripción confirmada. ¡Revisa tu correo institucional!', 'success');
              irAPaso(8);
            }}
          />
        );
      case 8:
        return (
          <Paso8Final
            planId={planSeleccionado}
            resumen={resumenFinal}
            onVolverInicio={() => irAPaso(1)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Header estudiante={ESTUDIANTE} tiempoFormato={tiempoFormato} critico={critico} />
      <Stepper pasoActual={pasoActual} onCambiarPaso={irAPaso} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        {renderPaso()}
      </main>

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
