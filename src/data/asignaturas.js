export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const HORAS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

export const TIPOS_ASIGNATURA = {
  OBLIGATORIA: 'Obligatoria',
  ELECTIVA: 'Electiva',
  LIBRE: 'Asignatura Libre'
};

export const TIPOS_SECCION = {
  TEORIA: 'Teoría',
  LABORATORIO: 'Laboratorio',
  TALLER: 'Taller'
};

export const SALAS = [
  'A-101', 'A-102', 'A-201', 'A-202',
  'B-101', 'B-102', 'Lab-01', 'Lab-02', 'Lab-03',
  'Auditorio', 'Sala Múltiple'
];

export const PROFESORES = [
  'Dr. Carlos Mendoza',
  'Ing. María González',
  'Ing. Roberto Silva',
  'Dra. Ana Pavez',
  'Ing. Juan Torres',
  'Mg. Laura Rojas',
  'Ing. Diego Fernández',
  'Mg. Sofía Ramírez',
  'Ing. Cristian López',
  'Dra. Paula Herrera'
];

export const PASOS = [
  { id: 1, nombre: 'Bienvenida', descripcion: 'Inicio del proceso' },
  { id: 2, nombre: 'Datos Personales', descripcion: 'Verifica tus datos' },
  { id: 3, nombre: 'Plan de Estudios', descripcion: 'Selecciona tu plan' },
  { id: 4, nombre: 'Asignaturas', descripcion: 'Elige tus ramos' },
  { id: 5, nombre: 'Secciones y Horario', descripcion: 'Elige secciones' },
  { id: 6, nombre: 'Resumen', descripcion: 'Revisa tu selección' },
  { id: 7, nombre: 'Confirmación', descripcion: 'Confirma tu inscripción' },
  { id: 8, nombre: 'Final', descripcion: 'Comparte tu experiencia' }
];

export const ESTUDIANTE = {
  nombre: 'Juan Ignacio Soto Ramírez',
  rut: '20.118.457-3',
  iniciales: 'JS',
  plan: 'Ingeniería en Programación 2023',
  escuela: 'Escuela de Ingeniería en Programación',
  facultad: 'Facultad de Ingeniería y Tecnología',
  universidad: 'Universidad Central de Chile',
  ultimaModificacion: '15/11/2026 22:14',
  periodoMatricula: '2026-02 / 1',
  expediente: '202118457',
  duracionCitaMin: 15
};

export const PLANES = [
  {
    id: 'IP2023',
    codigo: '[IP23]',
    nombre: 'INGENIERÍA EN PROGRAMACIÓN PLAN 2023',
    facultad: 'Facultad de Ingeniería y Tecnología',
    totalCreditos: 380,
    creditosMaxSemestre: 35,
    matriculable: true,
    estado: 'Vigente'
  }
];

export const NOTAS_PLAN_ESTUDIOS = [
  'Puedes matricularte únicamente en el plan de estudios que tengas formalmente asignado. Si no aparece el plan correcto, contacta a tu Escuela antes de continuar.',
  'La toma de ramos requiere estar al día en el pago de aranceles y matrícula. De existir una restricción financiera, el sistema bloqueará la inscripción de asignaturas.',
  'Los estudiantes con suspensión vigente, licencia médica o causal disciplinaria deberán regularizar su situación en la Secretaría de Estudios.',
  'La selección de asignaturas de planes en extinción está sujeta a la disponibilidad de secciones y a la autorización de la Escuela.'
];

export const ASIGNATURAS = [
  {
    id: 'PRO101',
    codigo: 'PRO101',
    nombre: 'Programación I',
    tipo: 'OBLIGATORIA',
    curso: 1,
    creditos: 6,
    secciones: [
      {
        id: 'PRO101-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Dr. Carlos Mendoza',
        sala: 'A-101',
        cupos: 45,
        cuposDisponibles: 32,
        horarios: [
          { dia: 0, horaInicio: 0, duracion: 3 },
          { dia: 2, horaInicio: 0, duracion: 2 }
        ]
      },
      {
        id: 'PRO101-2',
        codigo: 'TEO-2',
        tipo: 'TEORIA',
        profesor: 'Ing. María González',
        sala: 'A-102',
        cupos: 45,
        cuposDisponibles: 8,
        horarios: [
          { dia: 1, horaInicio: 3, duracion: 3 },
          { dia: 3, horaInicio: 3, duracion: 2 }
        ]
      },
      {
        id: 'PRO101-3',
        codigo: 'LAB-1',
        tipo: 'LABORATORIO',
        profesor: 'Ing. Roberto Silva',
        sala: 'Lab-01',
        cupos: 30,
        cuposDisponibles: 18,
        horarios: [
          { dia: 4, horaInicio: 2, duracion: 3 }
        ]
      }
    ]
  },
  {
    id: 'MAT101',
    codigo: 'MAT101',
    nombre: 'Matemáticas I',
    tipo: 'OBLIGATORIA',
    curso: 1,
    creditos: 6,
    secciones: [
      {
        id: 'MAT101-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Mg. Laura Rojas',
        sala: 'B-101',
        cupos: 45,
        cuposDisponibles: 12,
        horarios: [
          { dia: 1, horaInicio: 0, duracion: 3 },
          { dia: 3, horaInicio: 0, duracion: 2 }
        ]
      },
      {
        id: 'MAT101-2',
        codigo: 'TEO-2',
        tipo: 'TEORIA',
        profesor: 'Dr. Carlos Mendoza',
        sala: 'B-102',
        cupos: 45,
        cuposDisponibles: 28,
        horarios: [
          { dia: 0, horaInicio: 6, duracion: 3 },
          { dia: 4, horaInicio: 6, duracion: 2 }
        ]
      }
    ]
  },
  {
    id: 'ELE301',
    codigo: 'ELE301',
    nombre: 'Taller de Desarrollo Web Full Stack',
    tipo: 'ELECTIVA',
    curso: 3,
    creditos: 5,
    secciones: [
      {
        id: 'ELE301-1',
        codigo: 'TAL-1',
        tipo: 'TALLER',
        profesor: 'Ing. Cristian López',
        sala: 'Lab-03',
        cupos: 30,
        cuposDisponibles: 24,
        horarios: [
          { dia: 1, horaInicio: 9, duracion: 2 },
          { dia: 3, horaInicio: 9, duracion: 3 }
        ]
      }
    ]
  }
];
