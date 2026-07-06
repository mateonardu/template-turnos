/**
 * Backend de turnos: servidor Express básico.
 * Uso: npm run dev  →  http://localhost:3001
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { serviciosRouter } from './routes/servicios.js';
import { disponibilidadRouter } from './routes/disponibilidad.js';
import { turnosRouter } from './routes/turnos.js';
import { webhooksRouter } from './routes/webhooks.js';

const app = express();

// El frontend Vite corre en 5173.
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/servicios', serviciosRouter);
app.use('/api/disponibilidad', disponibilidadRouter);
app.use('/api/turnos', turnosRouter);
app.use('/api/webhooks', webhooksRouter);

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`✅ API de turnos corriendo en http://localhost:${PORT}`);
});
