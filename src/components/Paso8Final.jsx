import { useState } from 'react';
import { ESTUDIANTE } from '../data/asignaturas.js';
import { guardarFeedback } from '../firebase.js';

export default function Paso8Final({ planId, resumen, onVolverInicio }) {
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentarios, setComentarios] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await guardarFeedback({
        nombre: nombre.trim() || 'Anónimo',
        carrera: carrera.trim(),
        calificacion,
        comentarios: comentarios.trim(),
        plan: planId,
        expediente: ESTUDIANTE.expediente,
        ...resumen
      });
      setResultado(res.destino);
    } catch (err) {
      setResultado('error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-11 h-11 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="chip bg-primary-100 text-primary-700 border border-primary-200">PASO 8 DE 8</span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-3">
          ¡Muchas gracias por probar el prototipo!
        </h1>
        <p className="text-slate-600 mt-2 text-sm md:text-base">
          Tu retroalimentación nos ayuda a mejorar la experiencia de toma de ramos.
        </p>
      </div>

      {resultado ? (
        <div className="card p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">
            {resultado === 'error' ? 'No se pudo enviar' : '¡Gracias por tu respuesta!'}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {resultado === 'error'
              ? 'Ocurrió un problema al guardar. Intenta nuevamente.'
              : 'Tu retroalimentación fue registrada correctamente.'}
          </p>
          <button onClick={onVolverInicio} className="btn-secondary text-sm mx-auto">Volver al inicio</button>
        </div>
      ) : (
        <form onSubmit={enviar} className="card p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nombre <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Carrera <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              placeholder="Ej: Ingeniería en Programación"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">¿Cómo calificas tu experiencia?</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCalificacion(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`${n} estrellas`}
                >
                  <svg
                    className={`w-9 h-9 ${(hover || calificacion) >= n ? 'text-amber-400' : 'text-slate-200'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
              ))}
              {calificacion > 0 && <span className="ml-2 text-sm font-semibold text-slate-600">{calificacion}/5</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Comentarios <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              rows={4}
              placeholder="Cuéntanos qué te pareció el proceso y qué mejorarías."
              className="input-field resize-none"
            />
          </div>

          <div className="flex justify-center sm:justify-end pt-2">
            <button type="submit" disabled={enviando} className="btn-primary text-sm px-6 w-full sm:w-auto">
              {enviando ? 'Enviando...' : 'Enviar retroalimentación'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
