const API_URL = `${import.meta.env.VITE_API_URL}/api/alumnos`;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function obtenerAlumnos({
  busqueda = '',
  grado = '',
  seccion = '',
} = {}) {
  const parametros = new URLSearchParams();

  if (busqueda) {
    parametros.append('busqueda', busqueda);
  }

  if (grado) {
    parametros.append('grado', grado);
  }

  if (seccion) {
    parametros.append('seccion', seccion);
  }

  const url = parametros.toString()
    ? `${API_URL}?${parametros.toString()}`
    : API_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      'No se pudieron obtener los alumnos',
    );
  }

  return response.json();
}

export async function obtenerAlumno(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error('No se pudo obtener el alumno');
  }

  return response.json();
}

export async function crearAlumno(alumno) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(alumno),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el alumno');
  }

  return response.json();
}

export async function actualizarAlumno(id, alumno) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(alumno),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar el alumno');
  }

  return response.json();
}

export async function eliminarAlumno(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar el alumno');
  }

  return true;
}