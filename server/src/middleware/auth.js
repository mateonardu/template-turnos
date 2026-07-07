import jwt from 'jsonwebtoken';

/**
 * Protege rutas de admin: exige un JWT válido en
 * "Authorization: Bearer {token}" y deja el payload en req.admin.
 */
export function auth(req, res, next) {
  const encabezado = req.headers.authorization ?? '';
  const token = encabezado.startsWith('Bearer ') ? encabezado.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión inválida o vencida' });
  }
}
