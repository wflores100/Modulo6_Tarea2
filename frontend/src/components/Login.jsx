import { useState } from 'react';
import { iniciarSesion } from '../services/auth.js';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function manejarSubmit(event) {
    event.preventDefault();

    try {
      setCargando(true);
      setError('');

      const datos = await iniciarSesion(email, password);

      onLogin(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            CEU
          </div>

          <h1>Complejo Educativo Uruguay</h1>

          <p>Sistema de Gestión Escolar</p>
        </div>

        <div className="login-content">
          <h2>Iniciar sesión</h2>

          <p className="login-subtitle">
            Ingresa tus credenciales para continuar
          </p>

          {error && (
            <div className="mensaje-error">
              {error}
            </div>
          )}

          <form onSubmit={manejarSubmit}>
            <div className="campo-login">
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="campo-login">
              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              className="boton-login"
              type="submit"
              disabled={cargando}
            >
              {cargando
                ? 'Ingresando...'
                : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <div className="login-footer">
          <span>Complejo Educativo Uruguay</span>
        </div>
      </div>
    </div>
  );
}

export default Login;