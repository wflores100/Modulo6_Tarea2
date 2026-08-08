import { useEffect, useState } from 'react';

import {
  obtenerAlumnos,
  crearAlumno,
  actualizarAlumno,
  eliminarAlumno,
} from '../services/alumnos.js';

import './Alumnos.css';

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    grado: '',
    seccion: '',
  });

  const [alumnoEditando, setAlumnoEditando] = useState(null);

  const [filtroGrado, setFiltroGrado] = useState('');
  const [filtroSeccion, setFiltroSeccion] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Cargar alumnos desde PostgreSQL
  async function cargarAlumnos() {
    try {
      setCargando(true);
      setError('');

     const datos = await obtenerAlumnos({
  busqueda,
  grado: filtroGrado,
  seccion: filtroSeccion,
});

      setAlumnos(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  // Cargar alumnos al iniciar y cada vez que cambien los filtros
  useEffect(() => {
  cargarAlumnos();
}, [busqueda, filtroGrado, filtroSeccion]);

  // Manejar cambios del formulario
  function manejarCambio(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  // Limpiar formulario
  function limpiarFormulario() {
    setFormulario({
      nombre: '',
      apellido: '',
      grado: '',
      seccion: '',
    });

    setAlumnoEditando(null);
  }

  // Agregar o actualizar alumno
  async function manejarSubmit(event) {
    event.preventDefault();

    try {
      setError('');

      if (alumnoEditando) {
        await actualizarAlumno(
          alumnoEditando.id,
          formulario,
        );
      } else {
        await crearAlumno(formulario);
      }

      limpiarFormulario();

      await cargarAlumnos();
    } catch (error) {
      setError(error.message);
    }
  }

  // Preparar alumno para editar
  function editarAlumno(alumno) {
    setAlumnoEditando(alumno);

    setFormulario({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      grado: alumno.grado,
      seccion: alumno.seccion,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // Eliminar alumno
  async function manejarEliminar(id) {
    const confirmar = window.confirm(
      '¿Está seguro de eliminar este alumno?',
    );

    if (!confirmar) {
      return;
    }

    try {
      setError('');

      await eliminarAlumno(id);

      await cargarAlumnos();

      // Si estábamos editando el alumno eliminado
      if (alumnoEditando?.id === id) {
        limpiarFormulario();
      }
    } catch (error) {
      setError(error.message);
    }
  }

  // Limpiar filtros
  function limpiarFiltros() {
    setFiltroGrado('');
    setFiltroSeccion('');
  }

  return (
    <div className="contenedor-alumnos">
      <h1 className="titulo">Gestión de Alumnos</h1>

      {/* Mensaje de error */}
      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {/* ========================= */}
      {/* FORMULARIO */}
      {/* ========================= */}

      <h2>
        {alumnoEditando
          ? 'Editar alumno'
          : 'Agregar alumno'}
      </h2>

      <form className="formulario" onSubmit={manejarSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={manejarCambio}
          required
        />

        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formulario.apellido}
          onChange={manejarCambio}
          required
        />

        <input
          type="text"
          name="grado"
          placeholder="Grado"
          value={formulario.grado}
          onChange={manejarCambio}
          required
        />

        <input
          type="text"
          name="seccion"
          placeholder="Sección"
          value={formulario.seccion}
          onChange={manejarCambio}
          required
        />

        <button type="submit" className="btn-principal">
          {alumnoEditando
            ? 'Guardar cambios'
            : 'Agregar alumno'}
        </button>

        {alumnoEditando && (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="btn-cancelar"
            >
            Cancelar
        </button>
        )}
      </form>

      <div className="tarjeta">
  <h2>Buscar alumnos</h2>

  <div className="busqueda">
    <input
      type="text"
      placeholder="Buscar por nombre o apellido..."
      value={busqueda}
      onChange={(event) => setBusqueda(event.target.value)}
    />

    {busqueda && (
      <button
        type="button"
        className="btn-limpiar"
        onClick={() => setBusqueda('')}
      >
        Limpiar búsqueda
      </button>
    )}
  </div>
</div>

      {/* ========================= */}
      {/* FILTROS */}
      {/* ========================= */}

      <h2 className="titulo-seccion">Filtrar alumnos</h2>

<div className="filtros">
  <label>
    Grado:
    <select
      value={filtroGrado}
      onChange={(event) =>
        setFiltroGrado(event.target.value)
      }
    >
      <option value="">Todos</option>
      <option value="6to">6to</option>
      <option value="7to">7to</option>
      <option value="8vo">8vo</option>
      <option value="9no">9no</option>
    </select>
  </label>

  <label>
    Sección:
    <select
      value={filtroSeccion}
      onChange={(event) =>
        setFiltroSeccion(event.target.value)
      }
    >
      <option value="">Todas</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="D">D</option>
    </select>
  </label>

  <button
    type="button"
    className="btn-limpiar"
    onClick={limpiarFiltros}
  >
    Limpiar filtros
  </button>
</div>
      {/* ========================= */}
      {/* LISTA DE ALUMNOS */}
      {/* ========================= */}

      <h2>Lista de alumnos</h2>
        <p className="cantidad-alumnos">
  {alumnos.length === 1
    ? '1 alumno encontrado'
    : `${alumnos.length} alumnos encontrados`}
</p>
      {cargando ? (
  <p className="mensaje-info">Cargando alumnos...</p>
) : alumnos.length === 0 ? (
  <p className="mensaje-vacio">
    No se encontraron alumnos con los criterios seleccionados.
  </p>
) : (
        <div className="tabla-contenedor">
         <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Grado</th>
              <th>Sección</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td>{alumno.id}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.apellido}</td>
                <td>{alumno.grado}</td>
                <td>{alumno.seccion}</td>

                <td>
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={() => editarAlumno(alumno)}
                    >
                    Editar
                    </button>

                  <button
                     type="button"
                     className="btn-eliminar"
                     onClick={() => manejarEliminar(alumno.id)}
                    >
                    Eliminar
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default Alumnos;