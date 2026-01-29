# Consultorio Medico App

Aplicacion web para la gestion de un consultorio medico (medicamentos, especialidades, doctores, consultorios, citas, pacientes, recetas, etc.).

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+

## Instalacion

```
npm install
npm run build
```
## Comandos

```bash
npm run dev       # entorno de desarrollo

npm run preview   # previsualizacion del build

npm run lint      # lint

npm run test      # tests
```

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto con:

```
VITE_API_URL=https://alquinga-consultorio-medico-api.desarrollo-software.xyz/
```

## Conexion a la API

La app consume la API REST configurada en `VITE_API_URL` mediante Axios.

Endpoints principales usados por el frontend:

```
GET    /citas-medicas
POST   /citas-medicas
PATCH  /citas-medicas/:id
DELETE /citas-medicas/:id

GET    /pacientes
POST   /pacientes
PUT    /pacientes/:id
DELETE /pacientes/:id

GET    /recetas
POST   /recetas
PATCH  /recetas/:id
DELETE /recetas/:id

GET    /medicamentos
POST   /medicamentos
PUT    /medicamentos/:id
DELETE /medicamentos/:id
```

Notas:

- Para autenticacion se envia `Authorization: Bearer <auth_token>` desde `src/services/api.ts`.


