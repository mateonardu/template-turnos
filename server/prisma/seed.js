/**
 * Datos de prueba coherentes con src/config/site.config.js ("Estética Aura").
 * Uso: npm run seed
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Los 4 servicios de siteConfig.servicios.
const SERVICIOS = [
  {
    nombre: 'Limpieza facial profunda',
    descripcion: 'Higiene, exfoliación, extracción y máscara según tu tipo de piel.',
    duracionMin: 60,
    precio: 28000,
    porcentajeSena: 30,
  },
  {
    nombre: 'Perfilado de cejas',
    descripcion: 'Diseño y perfilado con henna o laminado, según tu estilo.',
    duracionMin: 45,
    precio: 18000,
    porcentajeSena: 30,
  },
  {
    nombre: 'Lifting de pestañas',
    descripcion: 'Curvado y tinte de pestañas naturales, efecto por 6 semanas.',
    duracionMin: 75,
    precio: 24000,
    porcentajeSena: 50,
  },
  {
    nombre: 'Manicura semipermanente',
    descripcion: 'Esmaltado semipermanente con fortalecimiento de uñas.',
    duracionMin: 60,
    precio: 15000,
    porcentajeSena: 0,
  },
];

// siteConfig.horarios, con diaSemana 0=domingo a 6=sábado.
const HORARIOS = [
  { diaSemana: 0, abre: '', cierra: '', cerrado: true }, // domingo
  { diaSemana: 1, abre: '', cierra: '', cerrado: true }, // lunes
  { diaSemana: 2, abre: '09:00', cierra: '19:00', cerrado: false }, // martes
  { diaSemana: 3, abre: '09:00', cierra: '19:00', cerrado: false }, // miércoles
  { diaSemana: 4, abre: '09:00', cierra: '19:00', cerrado: false }, // jueves
  { diaSemana: 5, abre: '09:00', cierra: '20:00', cerrado: false }, // viernes
  { diaSemana: 6, abre: '10:00', cierra: '18:00', cerrado: false }, // sábado
];

/**
 * Próxima fecha futura que caiga en el día de semana pedido (0=domingo).
 * Nunca devuelve hoy, siempre al menos mañana.
 */
function proximoDia(diaSemana) {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  const delta = (diaSemana - fecha.getDay() + 7) % 7 || 7;
  fecha.setDate(fecha.getDate() + delta);
  return fecha;
}

/** Suma minutos a una hora "HH:MM" y devuelve "HH:MM". */
function sumarMinutos(hhmm, minutos) {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + minutos;
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

async function main() {
  // Orden de borrado: primero Turno, que referencia a Servicio.
  await prisma.turno.deleteMany();
  await prisma.bloqueo.deleteMany();
  await prisma.horarioSemana.deleteMany();
  await prisma.servicio.deleteMany();

  const servicios = [];
  for (const data of SERVICIOS) {
    servicios.push(await prisma.servicio.create({ data }));
  }

  await prisma.horarioSemana.createMany({ data: HORARIOS });

  // 3 turnos confirmados en fechas futuras, en días que el local abre.
  const ejemplos = [
    {
      servicio: servicios[0], // limpieza facial
      diaSemana: 2, // martes
      horaInicio: '10:00',
      nombreCliente: 'Camila Rodríguez',
      telefonoCliente: '+54 9 11 5555-1111',
      emailCliente: 'camila.rodriguez@example.com',
    },
    {
      servicio: servicios[1], // perfilado de cejas
      diaSemana: 5, // viernes
      horaInicio: '15:30',
      nombreCliente: 'Julieta Medina',
      telefonoCliente: '+54 9 11 5555-2222',
      emailCliente: null,
    },
    {
      servicio: servicios[2], // lifting de pestañas
      diaSemana: 6, // sábado
      horaInicio: '11:00',
      nombreCliente: 'Sofía González',
      telefonoCliente: '+54 9 11 5555-3333',
      emailCliente: 'sofia.gonzalez@example.com',
    },
  ];

  for (const { servicio, diaSemana, horaInicio, ...cliente } of ejemplos) {
    await prisma.turno.create({
      data: {
        servicioId: servicio.id,
        fecha: proximoDia(diaSemana),
        horaInicio,
        horaFin: sumarMinutos(horaInicio, servicio.duracionMin),
        ...cliente,
        montoTotal: servicio.precio,
        montoSena: Math.round((servicio.precio * servicio.porcentajeSena) / 100),
        estado: 'confirmado',
      },
    });
  }

  console.log(`✅ Seed completo: ${servicios.length} servicios, ${HORARIOS.length} horarios, ${ejemplos.length} turnos`);
}

main()
  .catch((error) => {
    console.error('❌ Error en seed:', error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
