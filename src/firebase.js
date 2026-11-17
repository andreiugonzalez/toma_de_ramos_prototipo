import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';

// Configuración desde variables de entorno (.env). Si no hay credenciales,
// el prototipo guarda la retroalimentación en localStorage como respaldo.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const firebaseConfigurado = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let db = null;
if (firebaseConfigurado) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn('No se pudo inicializar Firebase, se usará almacenamiento local.', e);
  }
}

export async function guardarFeedback(datos) {
  const registro = { ...datos, fecha: new Date().toISOString() };
  if (db) {
    await addDoc(collection(db, 'feedback_prototipo'), { ...registro, creadoEn: serverTimestamp() });
    return { destino: 'firebase' };
  }
  const previos = JSON.parse(localStorage.getItem('feedback_prototipo') || '[]');
  previos.push(registro);
  localStorage.setItem('feedback_prototipo', JSON.stringify(previos));
  return { destino: 'local' };
}

// Lee todas las respuestas guardadas en Firestore (más recientes primero).
export async function leerFeedback() {
  if (!db) throw new Error('firebase-no-configurado');
  const q = query(collection(db, 'feedback_prototipo'), orderBy('fecha', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
