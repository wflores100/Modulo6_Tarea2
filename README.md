# Colegio San Marcos - API REST

API REST para la gestión de alumnos, con sistema de autenticación y autorización basado en JWT. Construida con Node.js, Express y Prisma ORM sobre PostgreSQL.

## Tecnologías utilizadas

- **Node.js** con ES Modules (`import`/`export`)
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL (con `@prisma/adapter-pg`)
- **PostgreSQL** - Base de datos relacional
- **jsonwebtoken (JWT)** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas
- **cors** - Manejo de peticiones cross-origin
- **dotenv** - Manejo de variables de entorno

## Estructura del proyecto

```
├── index.js                      # Punto de entrada del servidor
├── prisma/
│   ├── schema.prisma              # Definición de modelos y esquema de BD
│   └── migrations/                # Historial de migraciones
├── src/
│   ├── config/
│   │   └── prisma.js              # Cliente de Prisma
│   ├── routes/
│   │   ├── alumno.routes.js       # Endpoints de alumnos
│   │   └── auth.routes.js         # Endpoints de autenticación
│   ├── controllers/
│   │   ├── alumno.controller.js
│   │   └── auth.controller.js
│   ├── services/
│   │   ├── alumno.service.js      # Lógica de negocio de alumnos
│   │   └── auth.service.js        # Lógica de negocio de autenticación
│   ├── repositories/
│   │   ├── alumno.repository.js   # Acceso a datos de alumnos
│   │   └── usuario.repository.js  # Acceso a datos de usuarios
│   ├── middlewares/
│   │   ├── apiKey.js               # Validación de API key
│   │   ├── auth.js                 # Validación de JWT (requireAuth)
│   │   ├── requireRole.js          # Validación de roles (RBAC)
│   │   └── errorHandler.js         # Manejo centralizado de errores
│   ├── utils/
│   │   ├── password.js             # hashPassword / comparePassword (bcrypt)
│   │   └── token.js                # generarToken / verificarToken (JWT)
│   └── errors/
│       └── appError.js             # Clase de error personalizada
```

## Requisitos previos

- Node.js (v18 o superior recomendado)
- PostgreSQL instalado y corriendo localmente (o accesible remotamente)
- npm

## Instalación

1. Clonar o descargar el proyecto y entrar a la carpeta:

   ```bash
   cd Modulo6_tarea2
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   PORT=3000
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_basedatos?schema=public"
   JWT_SECRET=una_clave_secreta_larga_y_aleatoria
   API_KEY=una_clave_para_proteger_endpoints_sensibles
   ```

   > 💡 Puedes generar un `JWT_SECRET` seguro con:
   > `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. Crear la base de datos en PostgreSQL (si aún no existe):

   ```bash
   psql -U postgres -p 5432
   ```
   ```sql
   CREATE DATABASE nombre_basedatos;
   \q
   ```

5. Ejecutar las migraciones de Prisma para crear las tablas:

   ```bash
   npx prisma migrate dev
   ```

6. Generar el cliente de Prisma (normalmente ya se genera con el paso anterior):

   ```bash
   npx prisma generate
   ```

## Uso

Levantar el servidor en modo desarrollo (con recarga automática):

```bash
npm run dev
```

El servidor quedará disponible en `http://localhost:3000` (o el puerto definido en `.env`).

Para explorar visualmente la base de datos:

```bash
npx prisma studio
```

## Modelos de datos

### Alumno

| Campo    | Tipo   | Descripción           |
|----------|--------|------------------------|
| id       | Int    | Identificador único (autoincremental) |
| nombre   | String | Nombre del alumno |
| apellido | String | Apellido del alumno |
| grado    | String | Grado que cursa |
| seccion  | String | Sección asignada |

### Usuario

| Campo        | Tipo   | Descripción |
|--------------|--------|-------------|
| id           | Int    | Identificador único (autoincremental) |
| nombre       | String | Nombre del usuario |
| email        | String | Correo electrónico (único) |
| passwordHash | String | Contraseña encriptada con bcrypt |
| rol          | Rol    | `ADMIN` o `COORDINADOR` (por defecto `COORDINADOR`) |

## Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint                          | Protección                  | Descripción |
|--------|------------------------------------|------------------------------|-------------|
| POST   | `/api/auth/registro`               | Pública                      | Registra un nuevo usuario |
| POST   | `/api/auth/login`                  | Pública                      | Inicia sesión y devuelve un token JWT |
| GET    | `/api/auth/perfil`                 | Requiere token (`requireAuth`) | Devuelve los datos del usuario autenticado |
| PATCH  | `/api/auth/usuarios/:id/password`  | Pública*                     | Cambia la contraseña de un usuario |
| GET    | `/api/auth/usuarios`               | Token + rol `ADMIN`          | Lista todos los usuarios registrados |

**Ejemplo - Registro**
```json
POST /api/auth/registro
{
  "nombre": "Admin",
  "email": "admin@test.com",
  "password": "12345678"
}
```

**Ejemplo - Login**
```json
POST /api/auth/login
{
  "email": "admin@test.com",
  "password": "12345678"
}
```
Respuesta:
```json
{
  "usuario": { "id": 1, "nombre": "Admin", "email": "admin@test.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

### Alumnos (`/api/alumnos`)

| Método | Endpoint              | Protección           | Descripción |
|--------|------------------------|------------------------|-------------|
| GET    | `/api/alumnos`         | Pública                | Lista todos los alumnos (admite `?grado=` como filtro) |
| GET    | `/api/alumnos/:id`     | Pública                | Obtiene un alumno por ID |
| POST   | `/api/alumnos`         | Requiere `x-api-key`   | Crea un nuevo alumno |
| PATCH  | `/api/alumnos/:id`     | Pública                | Actualiza un alumno existente |
| DELETE | `/api/alumnos/:id`     | Pública                | Elimina un alumno |

**Ejemplo - Crear alumno**
```json
POST /api/alumnos
Headers: x-api-key: <API_KEY del .env>
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "grado": "5to",
  "seccion": "A"
}
```

## Seguridad

- Las contraseñas se encriptan con **bcrypt** (12 salt rounds) antes de guardarse; nunca se almacenan ni se devuelven en texto plano.
- La autenticación de usuarios se maneja con **JWT**, firmado con `JWT_SECRET` y con expiración de 1 hora.
- El endpoint de creación de alumnos está protegido con una **API key** estática (`x-api-key`), útil para restringir integraciones externas.
- El acceso a la lista de usuarios está restringido por **rol** (`ADMIN`) mediante el middleware `requireRole`.
- Los errores se manejan de forma centralizada a través de `errorHandler.js` y la clase `AppError`, devolviendo respuestas JSON consistentes con el código HTTP adecuado (400, 401, 403, 404, 409, 500).

## Scripts disponibles

| Comando         | Descripción |
|------------------|-------------|
| `npm run dev`    | Levanta el servidor con recarga automática (`node --watch`) |

## Notas

- Este proyecto fue desarrollado como parte de una tarea académica (Módulo 6).
- El frontend esperado corre en `http://localhost:5173` (configurado en CORS); ajusta el origen en `index.js` si tu frontend usa otro puerto.

## Autor
- William Alexander Flores Cardona.