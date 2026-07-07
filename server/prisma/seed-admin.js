/**
 * Crea (o actualiza) el usuario administrador a partir de
 * ADMIN_USUARIO y ADMIN_PASSWORD del .env.
 * Uso: npm run seed:admin
 */

import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const usuario = process.env.ADMIN_USUARIO;
const password = process.env.ADMIN_PASSWORD;

if (!usuario || !password) {
  console.error('❌ Faltan ADMIN_USUARIO y/o ADMIN_PASSWORD en el .env');
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 10);

const admin = await prisma.admin.upsert({
  where: { usuario },
  update: { passwordHash },
  create: { usuario, passwordHash },
});

console.log(`✅ Admin listo: "${admin.usuario}" (id ${admin.id})`);
await prisma.$disconnect();
