import { useEffect, useMemo, useState } from 'react';
import { leerFeedback, firebaseConfigurado } from '../firebase.js';

const REGLAS_FIRESTORE = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /feedback_prototipo/{docId} {
      allow create: if true;
      allow read: if true;
      allow update, delete: if false;
    }
  }
}`;

const PALETA = [
  'from-primary-500 to-primary-700',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-700',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600'
];

function colorPara(texto) {
  const t = texto || '';
  let suma = 0;
  for (let i = 0; i < t.length; i++) suma += t.charCodeAt(i);
  return PALETA[suma % PALETA.length];
}

function iniciales(nombre) {
  if (!nombre || nombre === 'Anónimo') return '?';
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function formatearFecha(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function Estrellas({ valor, tamano = 'md' }) {
  const clase = tamano === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const n = Number(valor) || 0;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${clase} ${i <= n ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 00-1.176 0l-3.366 2.445c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
        </svg>
      ))}
    </div>
  );
}

function TarjetaRespuesta({ r }) {
  const nombre = r.nombre || 'Anónimo';
  const anonimo = nombre === 'Anónimo';
  const comentario = (r.comentarios || '').trim();
  const fecha = formatearFecha(r.fecha);

  return (
    <article className="card p-5 flex flex-col gap-4 hover:shadow-card transition-shadow duration-300 animate-slide-up">
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br ${
            anonimo ? 'from-slate-400 to-slate-600' : colorPara(nombre)
          }`}
        >
          {iniciales(nombre)}
        </div>
        <div className="min-w-0 flex-1">
          <div className={`font-bold truncate ${anonimo ? 'text-slate-400 italic' : 'text-slate-800'}`}>
            {nombre}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 min-w-0">
            {r.carrera && (
              <>
                <span className="text-primary-600 font-semibold truncate" title={r.carrera}>
                  {r.carrera}
                </span>
                {fecha && <span className="text-slate-300 flex-shrink-0">•</span>}
              </>
            )}
            {fecha && <span className="truncate">{fecha}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Estrellas valor={r.calificacion} />
        <span className="text-xs font-semibold text-slate-500">
          {Number(r.calificacion) > 0 ? `${r.calificacion}/5` : 'Sin calificar'}
        </span>
      </div>

      {comentario ? (
        <div className="relative bg-slate-50 border border-slate-100 rounded-xl p-4">
          <svg className="w-5 h-5 text-primary-200 absolute top-3 left-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H5.5A3.67 3.67 0 019.17 7.5V6H7.17zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6.83H15.5A3.67 3.67 0 0119.17 7.5V6h-2z" />
          </svg>
          <p className="text-sm text-slate-700 leading-relaxed pl-6 whitespace-pre-wrap break-words">
            {comentario}
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-300 italic">Sin comentarios.</p>
      )}

      {(r.plan || r.creditos != null || r.secciones != null) && (
        <div className="flex flex-wrap gap-1.5 pt-1 mt-auto border-t border-slate-100">
          {r.plan && (
            <span className="chip bg-primary-50 text-primary-700 border border-primary-100">{r.plan}</span>
          )}
          {r.creditos != null && (
            <span className="chip bg-slate-50 text-slate-600 border border-slate-200">{r.creditos} créditos</span>
          )}
          {r.secciones != null && (
            <span className="chip bg-slate-50 text-slate-600 border border-slate-200">{r.secciones} sección(es)</span>
          )}
        </div>
      )}
    </article>
  );
}

export default function PanelRespuestas() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [filtro, setFiltro] = useState(0);
  const [busqueda, setBusqueda] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await leerFeedback();
      setRespuestas(datos);
    } catch (e) {
      if (e?.message === 'firebase-no-configurado') setError('no-config');
      else if (e?.code === 'permission-denied') setError('permisos');
      else setError('desconocido');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const stats = useMemo(() => {
    const conNota = respuestas.filter((r) => Number(r.calificacion) > 0);
    const suma = conNota.reduce((acc, r) => acc + Number(r.calificacion), 0);
    const distribucion = [5, 4, 3, 2, 1].map((n) => ({
      n,
      cantidad: respuestas.filter((r) => Number(r.calificacion) === n).length
    }));
    return {
      total: respuestas.length,
      conNota: conNota.length,
      promedio: conNota.length ? suma / conNota.length : 0,
      distribucion
    };
  }, [respuestas]);

  const filtradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return respuestas.filter((r) => {
      if (filtro && Number(r.calificacion) !== filtro) return false;
      if (q && !(r.nombre || '').toLowerCase().includes(q) && !(r.comentarios || '').toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [respuestas, filtro, busqueda]);

  const maxDist = Math.max(1, ...stats.distribucion.map((d) => d.cantidad));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="bg-ucenslate text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-ucenslate font-black text-sm sm:text-base tracking-tighter">UCEN</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight truncate">
                  Respuestas de la experiencia
                </h1>
                <p className="text-blue-100 text-[11px] sm:text-sm truncate">
                  Toma de Ramos · Retroalimentación de usuarios del prototipo
                </p>
              </div>
            </div>
            <button
              onClick={cargar}
              disabled={cargando}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 flex-shrink-0"
            >
              <svg className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        {error === 'no-config' && (
          <div className="card p-8 text-center max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Firebase no está configurado</h2>
            <p className="text-sm text-slate-500">
              Falta el archivo <code className="bg-slate-100 px-1 rounded">.env</code> con las credenciales del proyecto.
            </p>
          </div>
        )}

        {error === 'permisos' && (
          <div className="card p-6 sm:p-8 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Falta permitir la lectura en Firestore</h2>
            <p className="text-sm text-slate-600 mb-4">
              Tus reglas actuales bloquean la lectura desde la app. En Firebase ve a{' '}
              <strong>Firestore Database → Reglas</strong>, pega esto y pulsa <strong>Publicar</strong>:
            </p>
            <pre className="bg-slate-900 text-slate-100 text-xs rounded-xl p-4 overflow-x-auto whitespace-pre">
{REGLAS_FIRESTORE}
            </pre>
          </div>
        )}

        {error === 'desconocido' && (
          <div className="card p-8 text-center max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-2">No se pudieron cargar las respuestas</h2>
            <p className="text-sm text-slate-500 mb-4">Revisa tu conexión e inténtalo de nuevo.</p>
            <button onClick={cargar} className="btn-primary text-sm mx-auto">Reintentar</button>
          </div>
        )}

        {!error && cargando && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-2 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-24 mb-4" />
                <div className="h-16 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {!error && !cargando && respuestas.length === 0 && (
          <div className="card p-12 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Aún no hay respuestas</h2>
            <p className="text-sm text-slate-500">
              Cuando alguien complete el formulario del Paso 8, aparecerá aquí.
            </p>
          </div>
        )}

        {!error && !cargando && respuestas.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a3 3 0 10-2.5-4.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">{stats.total}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Respuestas</div>
                </div>
              </div>

              <div className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 00-1.176 0l-3.366 2.445c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">{stats.promedio.toFixed(1)}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Promedio ({stats.conNota})</div>
                </div>
              </div>

              <div className="card p-5">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Distribución</div>
                <div className="space-y-1">
                  {stats.distribucion.map((d) => (
                    <div key={d.n} className="flex items-center gap-2">
                      <span className="text-[11px] w-3 text-slate-500 font-semibold">{d.n}</span>
                      <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 00-1.176 0l-3.366 2.445c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
                      </svg>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${(d.cantidad / maxDist) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] w-4 text-right text-slate-500 font-mono">{d.cantidad}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
              <div className="relative w-full sm:max-w-xs">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre o comentario..."
                  className="input-field pl-9"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFiltro(0)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    filtro === 0 ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Todas
                </button>
                {[5, 4, 3, 2, 1].map((n) => (
                  <button
                    key={n}
                    onClick={() => setFiltro(n)}
                    className={`px-2.5 py-1.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1 ${
                      filtro === n ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {n}
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 00-1.176 0l-3.366 2.445c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {filtradas.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-sm text-slate-500">No hay respuestas que coincidan con el filtro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtradas.map((r) => (
                  <TarjetaRespuesta key={r.id} r={r} />
                ))}
              </div>
            )}
          </>
        )}

        {!firebaseConfigurado && !error && (
          <p className="text-center text-xs text-slate-400 mt-8">
            Firebase no está configurado: no hay datos remotos que mostrar.
          </p>
        )}
      </main>
    </div>
  );
}
