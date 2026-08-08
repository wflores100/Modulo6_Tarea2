import { AppError } from '../errors/appError.js';

export const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      throw new AppError('No autenticado', 401);
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      throw new AppError(
        'No tienes permisos para realizar esta acción',
        403,
      );
    }

    next();
  };
};