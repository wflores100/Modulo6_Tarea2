import { prisma } from '../config/prisma.js';

// findAll - Devuelve todos los alumnos, con opción de filtrar por grado o sección
// findAll - Devuelve alumnos con filtros de búsqueda, grado y sección
export const findAll = ({ busqueda, grado, seccion } = {}) => {
  return prisma.alumno.findMany({
    where: {
      ...(grado ? { grado } : {}),
      ...(seccion ? { seccion } : {}),

      ...(busqueda
        ? {
            OR: [
              {
                nombre: {
                  contains: busqueda,
                  mode: 'insensitive',
                },
              },
              {
                apellido: {
                  contains: busqueda,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    },
  });
};

// findById - Devuelve un alumno por su ID
export const findById = (id) => {
  return prisma.alumno.findUnique({
    where: { id },
  });
};

// findByNombreCompleto - Devuelve un alumno por su nombre completo
export const findByNombreCompleto = (nombre, apellido) => {
  return prisma.alumno.findFirst({
    where: { nombre, apellido },
  });
};

// save - Agrega un nuevo alumno a la base de datos
export const save = ({ nombre, apellido, grado, seccion }) => {
  return prisma.alumno.create({
    data: { nombre, apellido, grado, seccion },
  });
};

// update - Actualiza un alumno existente
export const updateById = (id, campos) => {
  return prisma.alumno.update({
    where: { id },
    data: campos,
  });
};

// delete - Elimina un alumno por su ID
export const deleteById = (id) => {
  return prisma.alumno.delete({
    where: { id },
  });
};