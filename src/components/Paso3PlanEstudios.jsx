import { PLANES, NOTAS_PLAN_ESTUDIOS } from '../data/asignaturas.js';
import BarraNavegacion from './BarraNavegacion.jsx';

export default function Paso3PlanEstudios({ planSeleccionado, onSeleccionarPlan, onAnterior, onSiguiente }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <span className="chip bg-primary-100 text-primary-700 border border-primary-200">PASO 3 DE 8</span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-2">
          Selección del Plan de Estudios
        </h1>
        <p className="text-slate-600 mt-1 text-sm md:text-base">
          Revisa las restricciones vigentes y confirma el plan con el que realizarás tu toma de ramos.
        </p>
      </div>

      <div className="rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-400 text-white flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-amber-900 mb-2">Consideraciones normativas y financieras</h2>
            <ul className="space-y-2">
              {NOTAS_PLAN_ESTUDIOS.map((nota, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-amber-900/90 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span>{nota}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="font-bold text-slate-800 mb-1">Plan con el que puedes matricularte</h2>
        <p className="text-sm text-slate-500 mb-4">Selecciona un plan para continuar. Solo los planes vigentes permiten inscripción de asignaturas.</p>

        <div className="space-y-3">
          {PLANES.map((plan) => {
            const seleccionado = planSeleccionado === plan.id;
            return (
              <label
                key={plan.id}
                className={`flex items-start gap-4 rounded-xl border-2 p-4 transition-all ${
                  !plan.matriculable
                    ? 'border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed'
                    : seleccionado
                    ? 'border-primary-500 bg-primary-50 cursor-pointer'
                    : 'border-slate-200 bg-white hover:border-primary-300 cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={seleccionado}
                  disabled={!plan.matriculable}
                  onChange={() => plan.matriculable && onSeleccionarPlan(plan.id)}
                  className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-slate-500 text-sm">{plan.codigo}</span>
                    <span className="font-bold text-slate-800">{plan.nombre}</span>
                    {plan.matriculable ? (
                      <span className="chip bg-emerald-100 text-emerald-700 border border-emerald-200">Matriculable</span>
                    ) : (
                      <span className="chip bg-slate-200 text-slate-600 border border-slate-300">No matriculable</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
                    <span>{plan.facultad}</span>
                    <span>Estado: <span className="font-semibold text-slate-600">{plan.estado}</span></span>
                    <span>Créditos totales: <span className="font-semibold text-slate-600">{plan.totalCreditos}</span></span>
                    <span>Tope semestral: <span className="font-semibold text-slate-600">{plan.creditosMaxSemestre} créditos</span></span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <BarraNavegacion
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
        deshabilitarSiguiente={!planSeleccionado}
        hintSiguiente={!planSeleccionado ? 'Selecciona un plan para continuar' : undefined}
      />
    </div>
  );
}
