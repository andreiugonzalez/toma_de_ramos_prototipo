import { useEffect, useRef, useState } from 'react';

// Contador de la cita (15 min por defecto) con alertas cada 5 minutos.
export default function useTemporizadorCita(duracionMin = 15, onAlerta) {
  const total = duracionMin * 60;
  const [restante, setRestante] = useState(total);
  const alertasEmitidas = useRef(new Set());
  const onAlertaRef = useRef(onAlerta);
  onAlertaRef.current = onAlerta;

  useEffect(() => {
    const id = setInterval(() => {
      setRestante(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (restante === 0 || (restante % 300 === 0 && restante !== total)) {
      if (!alertasEmitidas.current.has(restante)) {
        alertasEmitidas.current.add(restante);
        onAlertaRef.current?.(restante);
      }
    }
  }, [restante, total]);

  const minutos = Math.floor(restante / 60);
  const segundos = restante % 60;
  const formato = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  const critico = restante <= 5 * 60;

  return { restante, formato, critico, total };
}
