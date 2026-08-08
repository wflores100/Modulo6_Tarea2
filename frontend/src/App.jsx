import { useEffect, useState } from 'react';

import Login from './components/Login.jsx';
import Alumnos from './components/Alumnos.jsx';
import Usuarios from './components/Usuarios.jsx';

import {
  obtenerPerfil,
  cerrarSesion,
} from './services/auth.js';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState('alumnos');

  useEffect(() => {
    verificarSesion();
  }, []);

  async function verificarSesion() {
    const token = localStorage.getItem('token');

    if (!token) {
      setCargando(false);
      return;
    }

    try {
      const perfil = await obtenerPerfil();

      setUsuario(perfil);
    } catch (error) {
      console.error('Sesión inválida:', error);

      cerrarSesion();
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }

  async function manejarLogin() {
    try {
      const perfil = await obtenerPerfil();

      setUsuario(perfil);
      setVista('alumnos');
    } catch (error) {
      console.error(
        'Error obteniendo perfil:',
        error,
      );

      cerrarSesion();
      setUsuario(null);
    }
  }

  function manejarCerrarSesion() {
    cerrarSesion();
    setUsuario(null);
    setVista('alumnos');
  }

  if (cargando) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (!usuario) {
    return <Login onLogin={manejarLogin} />;
  }

  return (
    <div>
      <header
        style={{
          padding: '20px 30px',
          borderBottom: '1px solid #ddd',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2>Colegio San Marcos</h2>

            <p>
              Usuario:{' '}
              <strong>{usuario.nombre}</strong>
            </p>

            <p>
              Rol:{' '}
              <strong>{usuario.rol}</strong>
            </p>
          </div>

          <button onClick={manejarCerrarSesion}>
            Cerrar sesión
          </button>
        </div>

        <nav
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            onClick={() => setVista('alumnos')}
          >
            Alumnos
          </button>

          {usuario.rol === 'ADMIN' && (
            <button
              onClick={() => setVista('usuarios')}
            >
              Usuarios
            </button>
          )}
        </nav>
      </header>

      <main>
        {vista === 'alumnos' && <Alumnos />}

        {vista === 'usuarios' &&
          usuario.rol === 'ADMIN' && (
            <Usuarios />
          )}
      </main>
    </div>
  );
}

export default App;