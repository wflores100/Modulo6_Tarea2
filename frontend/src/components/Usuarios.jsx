import { useEffect, useState } from 'react';
import {
  obtenerUsuarios,
  registrarUsuario,
  cambiarPassword,
} from '../services/usuarios.js';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [usuarioPassword, setUsuarioPassword] = useState(null);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [rol, setRol] = useState('COORDINADOR');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      setCargando(true);
      setError('');

      const datos = await obtenerUsuarios();

      setUsuarios(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarRegistro(event) {
    event.preventDefault();

    try {
      setError('');
      setMensaje('');

      await registrarUsuario({
        nombre,
        email,
        password,
        rol,
    });

      setNombre('');
      setEmail('');
      setPassword('');
      setRol('COORDINADOR');


      setMensaje('Usuario registrado correctamente');

      await cargarUsuarios();
    } catch (error) {
      setError(error.message);
    }
  }

  function abrirCambioPassword(usuario) {
    setUsuarioPassword(usuario);
    setPasswordActual('');
    setPasswordNueva('');
    setError('');
    setMensaje('');
  }

  function cerrarCambioPassword() {
    setUsuarioPassword(null);
    setPasswordActual('');
    setPasswordNueva('');
  }

  async function manejarCambioPassword(event) {
    event.preventDefault();

    try {
      setError('');
      setMensaje('');

      await cambiarPassword(
        usuarioPassword.id,
        passwordActual,
        passwordNueva,
      );

      setMensaje(
        'Contraseña actualizada correctamente',
      );

      cerrarCambioPassword();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="usuarios-container">
      <h1>Gestión de Usuarios</h1>

      {error && (
        <div className="mensaje-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="mensaje-exito">
          {mensaje}
        </div>
      )}

      <section className="registro-usuario">
        <h2>Registrar usuario</h2>

        <form onSubmit={manejarRegistro}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(event) =>
              setNombre(event.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            minLength="8"
            maxLength="72"
            required
          />

          <select
            value={rol}
            onChange={(event) => setRol(event.target.value)}
>
            <option value="COORDINADOR">COORDINADOR</option>
            <option value="ADMIN">ADMIN</option>
            </select>

          <button type="submit">
            Registrar usuario
          </button>
        </form>
      </section>

      <section>
        <h2>Lista de usuarios</h2>

        {cargando ? (
          <p>Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>

                  <td>
                    <button
                      onClick={() =>
                        abrirCambioPassword(usuario)
                      }
                    >
                      Cambiar contraseña
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {usuarioPassword && (
        <section className="password-panel">
          <h2>
            Cambiar contraseña
          </h2>

          <p>
            Usuario:{' '}
            <strong>
              {usuarioPassword.nombre}
            </strong>
          </p>

          <form onSubmit={manejarCambioPassword}>
            <input
              type="password"
              placeholder="Contraseña actual"
              value={passwordActual}
              onChange={(event) =>
                setPasswordActual(
                  event.target.value,
                )
              }
              required
            />

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={passwordNueva}
              onChange={(event) =>
                setPasswordNueva(
                  event.target.value,
                )
              }
              minLength="8"
              maxLength="72"
              required
            />

            <select
                value={rol}
                onChange={(event) => setRol(event.target.value)}
            >
            <option value="COORDINADOR">COORDINADOR</option>
            <option value="ADMIN">ADMIN</option>
            </select>

            <button type="submit">
              Cambiar contraseña
            </button>

            <button
              type="button"
              onClick={cerrarCambioPassword}
            >
              Cancelar
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default Usuarios;