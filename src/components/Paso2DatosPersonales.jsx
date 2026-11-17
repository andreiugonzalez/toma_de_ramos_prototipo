import { ESTUDIANTE } from '../data/asignaturas.js';
import BarraNavegacion from './BarraNavegacion.jsx';

export default function Paso2DatosPersonales({ onAnterior, onSiguiente }) {
  const datos = [
    ['Nombre completo', ESTUDIANTE.nombre],
    ['RUT', ESTUDIANTE.rut],
    ['Plan de Estudios', ESTUDIANTE.plan],
    ['Escuela', ESTUDIANTE.escuela],
    ['Facultad', ESTUDIANTE.facultad],
    ['Periodo de Matrícula', ESTUDIANTE.periodoMatricula],
    ['Expediente', ESTUDIANTE.expediente],
    ['Última modificación', ESTUDIANTE.ultimaModificacion]
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5">
        <span className="chip bg-primary-100 text-primary-700 border border-primary-200">PASO 2 DE 8</span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-2">Verificación de Datos Personales</h1>
        <p className="text-slate-600 mt-1 text-sm md:text-base">Confirma que tus datos académicos sean correctos antes de continuar.</p>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-black">
            {ESTUDIANTE.iniciales}
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800">{ESTUDIANTE.nombre}</div>
            <div className="text-sm text-slate-500">{ESTUDIANTE.rut}</div>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {datos.map(([label, valor]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-slate-100 py-3">
              <dt className="text-sm text-slate-500">{label}</dt>
              <dd className="text-sm font-semibold text-slate-800 text-right">{valor}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Si detectas un error, contacta a tu Escuela antes de continuar con la toma de ramos.</span>
        </div>
      </div>

      <BarraNavegacion onAnterior={onAnterior} onSiguiente={onSiguiente} />
    </div>
  );
}
