import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/requireRole.js';
import * as AuthController from '../controllers/auth.controller.js';

const router = Router();

router.post('/registro', AuthController.registrar);
router.post('/login', AuthController.login);
router.get('/perfil', requireAuth, AuthController.perfil);
router.patch('/usuarios/:id/password', AuthController.cambiarPassword);
router.get(
  '/usuarios',
  requireAuth,
  requireRole('ADMIN'),
  AuthController.listarUsuarios,
);

export default router;
