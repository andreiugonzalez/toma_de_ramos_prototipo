import { ESTUDIANTE, PASOS } from '../data/asignaturas.js';
import BarraNavegacion from './BarraNavegacion.jsx';

export default function Paso1Bienvenida({ onSiguiente }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <span className="chip bg-primary-100 text-primary-700 border border-primary-200">PASO 1 DE 8</span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-3">
          Bienvenido/a al proceso de Toma de Ramos
        </h1>
        <p className="text-slate-600 mt-2 text-sm md:text-base">
          {ESTUDIANTE.nombre}, este asistente te guiará durante los {PASOS.length} pasos para inscribir tus asignaturas del periodo {ESTUDIANTE.periodoMatricula}.
        </p>
      </div>

      <div className="card p-6 sm:p-8 mb-6">
        <h2 className="font-bold text-slate-800 mb-4">¿Qué harás en este proceso?</h2>
        <ul className="space-y-3">
          {PASOS.slice(1).map(paso => (
            <li key={paso.id} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {paso.id}
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-700">{paso.nombre}</div>
                <div className="text-xs text-slate-500">{paso.descripcion}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Tienes <span className="font-bold">15 minutos</span> para completar el proceso. El temporizador aparece en la barra superior.</span>
        </div>
      </div>

      <BarraNavegacion
        onAnterior={() => {}}
        onSiguiente={onSiguiente}
        deshabilitarAnterior
        textoSiguiente="Comenzar"
      />
    </div>
  );
}
