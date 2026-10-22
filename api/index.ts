import app from '../server/index';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const path = typeof req.query.path === 'string' ? req.query.path : '';
  if (path) req.url = `/api${path.startsWith('/') ? path : `/${path}`}`;
  return app(req, res);
}
