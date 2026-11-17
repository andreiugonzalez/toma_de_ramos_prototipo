import { useState } from 'react';
import { ESTUDIANTE, PLANES } from '../data/asignaturas.js';
import BarraNavegacion from './BarraNavegacion.jsx';

export default function Paso7Confirmacion({ planId, ramosActivos, seccionesSeleccionadas, creditosMax, onAnterior, onConfirmar }) {
  const [acepta, setAcepta] = useState(false);
  const plan = PLANES.find(p => p.id === planId);
  const incorporadas = [...seccionesSeleccionadas];
  const ramosConSeccion = ramosActivos.filter(a => incorporadas.some(id => id.startsWith(a.id + '::')));
  const creditosTotales = ramosConSeccion.reduce((acc, a) => acc + a.creditos, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5">
        <span className="chip bg-primary-100 text-primary-700 border border-primary-200">PASO 7 DE 8</span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-2">Confirmación de Inscripción</h1>
        <p className="text-slate-600 mt-1 text-sm md:text-base">Al confirmar, tus asignaturas y secciones quedarán inscritas en el periodo.</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
            <div className="text-3xl font-black text-primary-700">{ramosConSeccion.length}</div>
            <div className="text-[11px] text-primary-600 font-medium mt-0.5">Asignaturas</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="text-3xl font-black text-slate-700">{incorporadas.length}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">Secciones</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="text-3xl font-black text-emerald-700">{creditosTotales}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Créditos</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="text-3xl font-black text-slate-700">{creditosMax}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">Tope créditos</div>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Estudiante</dt>
            <dd className="font-semibold text-slate-800 text-right">{ESTUDIANTE.nombre}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Periodo</dt>
            <dd className="font-semibold text-slate-800 text-right">{ESTUDIANTE.periodoMatricula}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Plan</dt>
            <dd className="font-semibold text-slate-800 text-right">{plan ? plan.nombre : '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Expediente</dt>
            <dd className="font-semibold text-slate-800 text-right">{ESTUDIANTE.expediente}</dd>
          </div>
        </dl>

        <label className="flex items-start gap-3 mt-6 cursor-pointer rounded-xl bg-slate-50 border border-slate-200 p-4">
          <input
            type="checkbox"
            checked={acepta}
            onChange={(e) => setAcepta(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-slate-600">
            Declaro que la información revisada es correcta y acepto el reglamento de toma de ramos de la Universidad Central de Chile.
          </span>
        </label>
      </div>

      <BarraNavegacion
        onAnterior={onAnterior}
        onSiguiente={onConfirmar}
        textoSiguiente="Confirmar inscripción"
        deshabilitarSiguiente={!acepta || incorporadas.length === 0}
        hintSiguiente={!acepta ? 'Debes aceptar la declaración para confirmar' : undefined}
      />
    </div>
  );
}
