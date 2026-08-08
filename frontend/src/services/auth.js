const API_URL = 'http://localhost:3000/api/auth';

export async function iniciarSesion(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const datos = await response.json();

  if (!response.ok) {
    throw new Error(
      datos.error || 'Email o contraseña incorrectos'
    );
  }

  // Guardar el token
  localStorage.setItem('token', datos.token);

  // Guardar los datos del usuario
  localStorage.setItem(
    'usuario',
    JSON.stringify(datos.usuario)
  );

  return datos;
}

export async function obtenerPerfil() {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay una sesión iniciada');
  }

  const response = await fetch(`${API_URL}/perfil`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const datos = await response.json();

  if (!response.ok) {
    localStorage.removeItem('token');

    throw new Error(
      datos.error || 'No se pudo obtener el perfil'
    );
  }

  return datos;
}

export function obtenerToken() {
  return localStorage.getItem('token');
}

export function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}