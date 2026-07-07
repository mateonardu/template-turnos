import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { auth } from '../middleware/auth.js';
import { parseFecha } from '../utils/fechas.js';

export const adminRouter = Router();

const ESTADOS = ['pendiente', 'confirmado', 'cancelado'];

/** POST /api/admin/login — devuelve un JWT válido por 7 días. */
adminRouter.post('/login', async (req, res) => {
  const { usuario, password } = req.body ?? {};
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Faltan usuario y/o contraseña' });
  }

  const admin = await prisma.admin.findUnique({ where: { usuario } });
  // Mensaje genérico a propósito: no revelar si existe el usuario.
  const valido = admin && (await bcrypt.compare(password, admin.passwordHash));
  if (!valido) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  const token = jwt.sign(
    { id: admin.id, usuario: admin.usuario },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, usuario: admin.usuario });
});

/**
 * GET /api/admin/turnos?fecha=YYYY-MM-DD&estado=confirmado
 * Sin fecha devuelve los turnos de hoy. Ordenados por horaInicio.
 */
adminRouter.get('/turnos', auth, async (req, res) => {
  const { fecha, estado } = req.query;

  const rango = parseFecha(fecha ?? hoyISO());
  if (!rango) {
    return res
      .status(400)
      .json({ error: `Fecha inválida: ${fecha}. Formato esperado: YYYY-MM-DD` });
  }
  if (estado && !ESTADOS.includes(estado)) {
    return res
      .status(400)
      .json({ error: `Estado inválido: ${estado}. Válidos: ${ESTADOS.join(', ')}` });
  }

  const turnos = await prisma.turno.findMany({
    where: {
      fecha: { gte: rango.inicioDia, lt: rango.finDia },
      ...(estado && { estado }),
    },
    include: { servicio: { select: { nombre: true, duracionMin: true } } },
    orderBy: { horaInicio: 'asc' },
  });
  res.json(turnos);
});

/**
 * PATCH /api/admin/turnos/:id/cancelar — solo turnos confirmados
 * o pendientes (no cancelar dos veces).
 */
adminRouter.patch('/turnos/:id/cancelar', auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: `Id de turno inválido: ${req.params.id}` });
  }

  const { count } = await prisma.turno.updateMany({
    where: { id, estado: { in: ['confirmado', 'pendiente'] } },
    data: { estado: 'cancelado' },
  });
  if (count === 0) {
    const existe = await prisma.turno.findUnique({ where: { id } });
    return existe
      ? res.status(409).json({ error: 'El turno ya estaba cancelado' })
      : res.status(404).json({ error: `Turno no encontrado: ${id}` });
  }

  const turno = await prisma.turno.findUnique({
    where: { id },
    include: { servicio: { select: { nombre: true } } },
  });
  res.json(turno);
});

/** GET /api/admin/bloqueos — bloqueos de hoy en adelante, por fecha. */
adminRouter.get('/bloqueos', auth, async (req, res) => {
  const hoy = parseFecha(hoyISO());
  const bloqueos = await prisma.bloqueo.findMany({
    where: { fecha: { gte: hoy.inicioDia } },
    orderBy: { fecha: 'asc' },
  });
  res.json(bloqueos);
});

/** POST /api/admin/bloqueos — body: { fecha: "YYYY-MM-DD", motivo? } */
adminRouter.post('/bloqueos', auth, async (req, res) => {
  const { fecha, motivo } = req.body ?? {};
  const rango = parseFecha(fecha);
  if (!rango) {
    return res
      .status(400)
      .json({ error: `Fecha inválida: ${fecha}. Formato esperado: YYYY-MM-DD` });
  }

  const bloqueo = await prisma.bloqueo.create({
    data: { fecha: rango.inicioDia, motivo: motivo?.trim() || null },
  });
  res.status(201).json(bloqueo);
});

/** DELETE /api/admin/bloqueos/:id */
adminRouter.delete('/bloqueos/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: `Id de bloqueo inválido: ${req.params.id}` });
  }

  try {
    await prisma.bloqueo.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Bloqueo no encontrado: ${id}` });
    }
    throw error;
  }
  res.json({ ok: true });
});

/** Fecha de hoy "YYYY-MM-DD" en hora local. */
function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
