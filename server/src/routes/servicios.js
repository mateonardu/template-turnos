import { Router } from 'express';
import { prisma } from '../db.js';

export const serviciosRouter = Router();

/** GET /api/servicios — servicios activos, ordenados por id. */
serviciosRouter.get('/', async (req, res) => {
  const servicios = await prisma.servicio.findMany({
    where: { activo: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      duracionMin: true,
      precio: true,
      porcentajeSena: true,
    },
  });
  res.json(servicios);
});
