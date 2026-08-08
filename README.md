# Complejo Educativo Uruguay

Sistema web de gestión escolar desarrollado para administrar alumnos y usuarios del **Complejo Educativo Uruguay**.

El proyecto utiliza una arquitectura separada de **frontend y backend**, con autenticación mediante JWT, control de acceso por roles y persistencia de datos mediante PostgreSQL y Prisma.

## Tecnologías

### Frontend
- React
- Vite
- JavaScript
- CSS
- Fetch API
- React Hooks (`useState`, `useEffect`)

### Backend
- Node.js
- Express
- JavaScript ES Modules
- JWT (`jsonwebtoken`)
- bcrypt
- Prisma ORM
- PostgreSQL

## Funcionalidades

### Autenticación
- Inicio de sesión con email y contraseña.
- Generación y verificación de tokens JWT.
- Perfil del usuario autenticado.
- Cambio de contraseña.
- Manejo centralizado de errores.

### Gestión de usuarios
Roles disponibles:
- `ADMIN`
- `COORDINADOR`

El administrador puede:
- Registrar usuarios.
- Registrar usuarios como `ADMIN` o `COORDINADOR`.
- Consultar la lista de usuarios.
- Cambiar contraseñas.

### Gestión de alumnos
Permite:
- Registrar alumnos.
- Editar alumnos.
- Eliminar alumnos.
- Buscar por nombre o apellido.
- Filtrar por grado.
- Filtrar por sección.
- Limpiar filtros.
- Mostrar la cantidad de alumnos encontrados.

## Arquitectura

### Backend

```text
backend/
└── src/
    ├── config/
    │   └── prisma.js
    ├── controllers/
    │   └── auth.controller.js
    ├── errors/
    │   └── appError.js
    ├── middlewares/
    │   ├── auth.js
    │   ├── requireRole.js
    │   └── errorHandler.js
    ├── repositories/
    │   └── usuario.repository.js
    ├── routes/
    │   └── auth.routes.js
    ├── services/
    │   └── auth.service.js
    ├── utils/
    │   ├── password.js
    │   └── token.js
    └── index.js
```

### Frontend

```text
frontend/
└── src/
    ├── components/
    │   ├── Alumnos.jsx
    │   ├── Alumnos.css
    │   ├── Login.jsx
    │   └── Usuarios.jsx
    ├── services/
    │   ├── auth.js
    │   └── alumnos.js
    └── ...
```

> Los nombres exactos de algunos archivos pueden variar según la organización actual del proyecto.

## Base de datos

La aplicación utiliza PostgreSQL mediante Prisma.

### Usuario

Campos principales:
- `id`
- `nombre`
- `email`
- `passwordHash`
- `rol`

### Alumno

La entidad de alumnos contiene la información necesaria para la gestión escolar, incluyendo:
- nombre
- apellido
- grado
- sección

Las contraseñas se almacenan mediante hash y nunca como texto plano.

## Variables de entorno

Crear un archivo `.env` en el backend:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/NOMBRE_BASE_DATOS"
JWT_SECRET="una_clave_secreta_segura"
```

No subir `.env` al repositorio.

En `.gitignore`:

```gitignore
.env
node_modules/
dist/
```

## Instalación

### Backend

```bash
cd backend
npm install
```

Configurar PostgreSQL y el archivo `.env`.

Ejecutar Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

Para visualizar los datos:

```bash
npx prisma studio
```

Iniciar el backend:

```bash
npm run dev
```

Servidor:

```text
http://localhost:3000
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite mostrará la dirección del frontend, normalmente:

```text
http://localhost:5173
```

## API

Ruta base:

```text
http://localhost:3000/api/auth
```

### Registrar usuario

```http
POST /api/auth/registro
```

Body:

```json
{
  "nombre": "Carlos",
  "email": "carlos@example.com",
  "password": "Password123",
  "rol": "COORDINADOR"
}
```

Los roles permitidos son:

```text
ADMIN
COORDINADOR
```

Si no se especifica el rol, el backend utiliza `COORDINADOR`.

### Iniciar sesión

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "admin@example.com",
  "password": "Password123"
}
```

La respuesta contiene los datos del usuario y el token JWT.

### Perfil

```http
GET /api/auth/perfil
Authorization: Bearer TOKEN
```

### Listar usuarios

```http
GET /api/auth/usuarios
Authorization: Bearer TOKEN
```

Esta operación requiere rol `ADMIN`.

### Cambiar contraseña

```http
PATCH /api/auth/usuarios/:id/password
Authorization: Bearer TOKEN
```

Body:

```json
{
  "passwordActual": "Password123",
  "passwordNueva": "NuevaPassword123"
}
```

Esta operación requiere rol `ADMIN`.

## Seguridad

El proyecto implementa:
- Contraseñas con hash.
- Mínimo de 8 caracteres para contraseñas.
- Máximo de 72 caracteres.
- Autenticación mediante JWT.
- Middleware de autenticación.
- Middleware de autorización por rol.
- Separación entre controller, service y repository.
- No exposición del `passwordHash` en respuestas públicas.
- Manejo centralizado de errores.

## Roles y permisos

| Funcionalidad | ADMIN | COORDINADOR |
|---|:---:|:---:|
| Iniciar sesión | Sí | Sí |
| Consultar perfil | Sí | Sí |
| Gestión de alumnos | Sí | Sí |
| Listar usuarios | Sí | No |
| Cambiar contraseña de usuarios | Sí | No |
| Crear ADMIN | Sí | No |

La autorización se controla en el backend y no solamente ocultando botones en React.

## Flujo de autenticación

```text
Usuario
   │
   ▼
Frontend React
   │
   │ email + contraseña
   ▼
POST /api/auth/login
   │
   ▼
AuthController
   │
   ▼
AuthService
   │
   ▼
UsuarioRepository
   │
   ▼
PostgreSQL
   │
   ▼
Comparación de contraseña
   │
   ▼
JWT
   │
   ▼
Frontend
   │
   ▼
localStorage
```

Las solicitudes protegidas envían:

```http
Authorization: Bearer TOKEN
```

## Manejo de errores

La aplicación utiliza `AppError` para errores controlados.

Ejemplos:

```text
400 - Datos inválidos
401 - Email o contraseña incorrectos
403 - Permisos insuficientes
404 - Usuario o registro no encontrado
409 - Email ya registrado
500 - Error interno del servidor
```

## Interfaz

La aplicación incluye:
- Pantalla de inicio de sesión.
- Identidad institucional de **Complejo Educativo Uruguay**.
- Gestión de alumnos.
- Gestión de usuarios.
- Formularios de registro y edición.
- Búsqueda.
- Filtros por grado y sección.
- Tablas.
- Edición y eliminación.
- Cambio de contraseñas.
- Mensajes de éxito y error.
- Diseño responsive en proceso de mejora.

## Usuarios de prueba

Durante el desarrollo pueden crearse usuarios desde la interfaz o mediante Prisma Studio.

Ejemplo:

```text
Nombre: Admin
Email: admin@example.com
Rol: ADMIN
```

No utilizar credenciales reales dentro del código fuente o repositorio.

## Comandos útiles

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

### Prisma

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

## Desarrollo

Se recomienda ejecutar backend y frontend en terminales separadas.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```text
http://localhost:3000
```

Frontend:

```text
http://localhost:5173
```

## Estado actual

El sistema cuenta con:
- Autenticación funcional.
- Inicio de sesión.
- JWT.
- Roles `ADMIN` y `COORDINADOR`.
- Gestión de usuarios.
- Registro de usuarios.
- Cambio de contraseña.
- Gestión de alumnos.
- Búsqueda de alumnos.
- Filtros por grado y sección.
- Edición y eliminación de alumnos.
- PostgreSQL + Prisma.
- Manejo centralizado de errores.
- Interfaz React.

## Próximas mejoras

- Mejorar completamente el diseño responsive.
- Agregar confirmaciones visuales.
- Implementar paginación.
- Validación de email.
- Recuperación de contraseña.
- Auditoría de acciones administrativas.
- Pruebas automatizadas.
- Configuración de entornos de producción.
- Despliegue del frontend y backend.

## Autor

Proyecto académico — Sistema de Gestión Escolar.

**William Alexander Flores Cardona**
