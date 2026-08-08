const API_URL = 'http://localhost:3000/api/auth';

function obtenerHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// Obtener todos los usuarios
export async function obtenerUsuarios() {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: 'GET',
    headers: obtenerHeaders(),
  });

  const datos = await response.json();

  if (!response.ok) {
    throw new Error(
      datos.error || 'No se pudieron obtener los usuarios',
    );
  }

  return datos;
}

// Registrar un nuevo usuario
export async function registrarUsuario({
  nombre,
  email,
  password,
  rol,
}) {
  const response = await fetch(`${API_URL}/registro`, {
    method: 'POST',
    headers: obtenerHeaders(),
    body: JSON.stringify({
      nombre,
      email,
      password,
      rol,
    }),
  });

  const datos = await response.json();

  if (!response.ok) {
    throw new Error(
      datos.error || 'Error al registrar usuario',
    );
  }

  return datos;
}

// Cambiar contraseña
export async function cambiarPassword(
  id,
  passwordActual,
  passwordNueva,
) {
  const response = await fetch(
    `${API_URL}/usuarios/${id}/password`,
    {
      method: 'PATCH',
      headers: obtenerHeaders(),
      body: JSON.stringify({
        passwordActual,
        passwordNueva,
      }),
    },
  );

  if (!response.ok) {
    let datos = {};

    try {
      datos = await response.json();
    } catch {
      // Respuesta sin contenido
    }

    throw new Error(
      datos.error || 'No se pudo cambiar la contraseña',
    );
  }

  return true;
}