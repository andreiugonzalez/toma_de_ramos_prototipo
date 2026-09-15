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
  { id: 1, nombre: 'Bienvenida', descripcion: 'Datos personales' },
  { id: 2, nombre: 'Plan de Estudios', descripcion: 'Selecciona tu plan' },
  { id: 3, nombre: 'Asignaturas', descripcion: 'Elige ramos' },
  { id: 4, nombre: 'Secciones y Horario', descripcion: 'Elige secciones' },
  { id: 5, nombre: 'Resumen', descripcion: 'Confirma tu selección' }
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
    id: 'PRO102',
    codigo: 'PRO102',
    nombre: 'Estructuras de Datos',
    tipo: 'OBLIGATORIA',
    curso: 1,
    creditos: 6,
    secciones: [
      {
        id: 'PRO102-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Dra. Ana Pavez',
        sala: 'A-201',
        cupos: 45,
        cuposDisponibles: 40,
        horarios: [
          { dia: 0, horaInicio: 3, duracion: 3 },
          { dia: 2, horaInicio: 3, duracion: 2 }
        ]
      },
      {
        id: 'PRO102-2',
        codigo: 'LAB-1',
        tipo: 'LABORATORIO',
        profesor: 'Ing. Juan Torres',
        sala: 'Lab-02',
        cupos: 30,
        cuposDisponibles: 25,
        horarios: [
          { dia: 1, horaInicio: 6, duracion: 3 }
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
    id: 'FIS101',
    codigo: 'FIS101',
    nombre: 'Física I',
    tipo: 'OBLIGATORIA',
    curso: 1,
    creditos: 6,
    secciones: [
      {
        id: 'FIS101-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Dra. Paula Herrera',
        sala: 'Auditorio',
        cupos: 60,
        cuposDisponibles: 45,
        horarios: [
          { dia: 2, horaInicio: 6, duracion: 3 },
          { dia: 4, horaInicio: 0, duracion: 2 }
        ]
      },
      {
        id: 'FIS101-2',
        codigo: 'LAB-1',
        tipo: 'LABORATORIO',
        profesor: 'Ing. Diego Fernández',
        sala: 'Lab-03',
        cupos: 25,
        cuposDisponibles: 20,
        horarios: [
          { dia: 5, horaInicio: 0, duracion: 3 }
        ]
      }
    ]
  },
  {
    id: 'PRO201',
    codigo: 'PRO201',
    nombre: 'Programación II (POO)',
    tipo: 'OBLIGATORIA',
    curso: 2,
    creditos: 6,
    secciones: [
      {
        id: 'PRO201-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Ing. María González',
        sala: 'A-202',
        cupos: 45,
        cuposDisponibles: 5,
        horarios: [
          { dia: 1, horaInicio: 9, duracion: 3 },
          { dia: 3, horaInicio: 9, duracion: 2 }
        ]
      },
      {
        id: 'PRO201-2',
        codigo: 'TEO-2',
        tipo: 'TEORIA',
        profesor: 'Ing. Cristian López',
        sala: 'A-101',
        cupos: 45,
        cuposDisponibles: 22,
        horarios: [
          { dia: 0, horaInicio: 9, duracion: 3 },
          { dia: 2, horaInicio: 9, duracion: 2 }
        ]
      },
      {
        id: 'PRO201-3',
        codigo: 'TAL-1',
        tipo: 'TALLER',
        profesor: 'Mg. Sofía Ramírez',
        sala: 'Lab-01',
        cupos: 30,
        cuposDisponibles: 15,
        horarios: [
          { dia: 4, horaInicio: 9, duracion: 3 }
        ]
      }
    ]
  },
  {
    id: 'BDA201',
    codigo: 'BDA201',
    nombre: 'Bases de Datos',
    tipo: 'OBLIGATORIA',
    curso: 2,
    creditos: 6,
    secciones: [
      {
        id: 'BDA201-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Ing. Diego Fernández',
        sala: 'A-201',
        cupos: 45,
        cuposDisponibles: 35,
        horarios: [
          { dia: 0, horaInicio: 6, duracion: 2 },
          { dia: 2, horaInicio: 6, duracion: 3 }
        ]
      },
      {
        id: 'BDA201-2',
        codigo: 'LAB-1',
        tipo: 'LABORATORIO',
        profesor: 'Ing. Juan Torres',
        sala: 'Lab-02',
        cupos: 30,
        cuposDisponibles: 28,
        horarios: [
          { dia: 3, horaInicio: 6, duracion: 3 }
        ]
      }
    ]
  },
  {
    id: 'ARQ201',
    codigo: 'ARQ201',
    nombre: 'Arquitectura de Computadores',
    tipo: 'OBLIGATORIA',
    curso: 2,
    creditos: 5,
    secciones: [
      {
        id: 'ARQ201-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Dr. Carlos Mendoza',
        sala: 'B-101',
        cupos: 45,
        cuposDisponibles: 38,
        horarios: [
          { dia: 1, horaInicio: 6, duracion: 2 },
          { dia: 4, horaInicio: 9, duracion: 2 }
        ]
      }
    ]
  },
  {
    id: 'ING201',
    codigo: 'ING201',
    nombre: 'Inglés Técnico',
    tipo: 'OBLIGATORIA',
    curso: 2,
    creditos: 4,
    secciones: [
      {
        id: 'ING201-1',
        codigo: 'TAL-1',
        tipo: 'TALLER',
        profesor: 'Mg. Sofía Ramírez',
        sala: 'Sala Múltiple',
        cupos: 35,
        cuposDisponibles: 2,
        horarios: [
          { dia: 0, horaInicio: 3, duracion: 2 },
          { dia: 2, horaInicio: 3, duracion: 2 }
        ]
      },
      {
        id: 'ING201-2',
        codigo: 'TAL-2',
        tipo: 'TALLER',
        profesor: 'Dra. Paula Herrera',
        sala: 'Sala Múltiple',
        cupos: 35,
        cuposDisponibles: 30,
        horarios: [
          { dia: 3, horaInicio: 3, duracion: 2 },
          { dia: 4, horaInicio: 3, duracion: 2 }
        ]
      }
    ]
  },
  {
    id: 'ELE301',
    codigo: 'ELE301',
    nombre: 'Desarrollo Web Full Stack',
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
  },
  {
    id: 'ELE302',
    codigo: 'ELE302',
    nombre: 'Inteligencia Artificial',
    tipo: 'ELECTIVA',
    curso: 3,
    creditos: 5,
    secciones: [
      {
        id: 'ELE302-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Dra. Ana Pavez',
        sala: 'A-202',
        cupos: 40,
        cuposDisponibles: 36,
        horarios: [
          { dia: 0, horaInicio: 9, duracion: 3 },
          { dia: 2, horaInicio: 9, duracion: 2 }
        ]
      },
      {
        id: 'ELE302-2',
        codigo: 'LAB-1',
        tipo: 'LABORATORIO',
        profesor: 'Ing. Roberto Silva',
        sala: 'Lab-01',
        cupos: 25,
        cuposDisponibles: 22,
        horarios: [
          { dia: 4, horaInicio: 6, duracion: 3 }
        ]
      }
    ]
  },
  {
    id: 'LIB001',
    codigo: 'LIB001',
    nombre: 'Emprendimiento e Innovación',
    tipo: 'LIBRE',
    curso: 0,
    creditos: 3,
    secciones: [
      {
        id: 'LIB001-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Mg. Laura Rojas',
        sala: 'Auditorio',
        cupos: 80,
        cuposDisponibles: 65,
        horarios: [
          { dia: 5, horaInicio: 4, duracion: 3 }
        ]
      }
    ]
  },
  {
    id: 'LIB002',
    codigo: 'LIB002',
    nombre: 'Psicología General',
    tipo: 'LIBRE',
    curso: 0,
    creditos: 3,
    secciones: [
      {
        id: 'LIB002-1',
        codigo: 'TEO-1',
        tipo: 'TEORIA',
        profesor: 'Dra. Paula Herrera',
        sala: 'B-101',
        cupos: 60,
        cuposDisponibles: 58,
        horarios: [
          { dia: 2, horaInicio: 9, duracion: 3 }
        ]
      }
    ]
  }
];
