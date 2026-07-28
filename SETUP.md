# Outlier Mexicano — Guía de instalación desde cero

Instrucciones para levantar el proyecto en una PC recién formateada.

## 1. Requisitos

| Software | Versión usada | Descarga |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| PostgreSQL | 18 | https://www.postgresql.org/download/windows/ |
| Git | cualquiera | https://git-scm.com |

Durante la instalación de PostgreSQL, anota la contraseña que le pongas al usuario `postgres` — la vas a necesitar en el `.env`.

## 2. Clonar el repositorio

```bash
git clone https://github.com/Arturr47/outlierMX.git
cd outlierMX
```

## 3. Crear la base de datos

```bash
# Windows: los binarios están en "C:\Program Files\PostgreSQL\18\bin"
createdb -U postgres outlier_mexicano
```

Si `createdb` no está en el PATH, usa la ruta completa:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres outlier_mexicano
```

## 4. Cargar la estructura de tablas

**Opción A — recomendada.** `full-schema.sql` es un volcado del estado real y actual de la base
de datos (16 tablas, con índices y llaves foráneas). Un solo comando:

```bash
psql -U postgres -d outlier_mexicano -f backend/db/full-schema.sql
```

**Opción B — histórica.** Reconstruir aplicando las migraciones en orden. Solo tiene sentido si
quieres revisar cómo evolucionó el esquema:

```bash
psql -U postgres -d outlier_mexicano -f backend/db/schema.sql
psql -U postgres -d outlier_mexicano -f backend/db/migration-v2.sql
psql -U postgres -d outlier_mexicano -f backend/db/migration-v3.sql
psql -U postgres -d outlier_mexicano -f backend/db/migration-world-cup.sql
```

## 5. Cargar datos de referencia

Ligas, equipos y jugadores (datos deportivos públicos) para no arrancar con las tablas vacías:

```bash
psql -U postgres -d outlier_mexicano -f backend/db/seed-reference-data.sql
```

## 6. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` y rellena los valores reales:

| Variable | Cómo obtenerla |
|---|---|
| `PORT` | `5000` |
| `DATABASE_URL` | `postgresql://postgres:TU_PASSWORD@localhost:5432/outlier_mexicano` |
| `JWT_SECRET` | Cadena aleatoria larga. **Si la cambias, se cierran todas las sesiones existentes.** |
| `STRIPE_SECRET_KEY` | Dashboard de Stripe → Developers → API keys |
| `STRIPE_PUBLISHABLE_KEY` | Mismo lugar |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → el endpoint |
| `STRIPE_PRICE_ID` | Stripe → Products → el precio de la suscripción |
| `FRONTEND_URL` | `http://localhost:5173` en local. Controla CORS y los redirects de Stripe; si no coincide con el puerto real de Vite, el frontend no podrá llamar a la API. |
| `RAPIDAPI_KEY` | https://rapidapi.com → tu suscripción a la API deportiva |

> El `.env` **nunca** se sube a git (está en `.gitignore`) porque este repositorio es público.

## 7. Instalar dependencias y arrancar

```bash
# Backend
cd backend
npm install
npm run dev        # http://localhost:5000

# Frontend (otra terminal)
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## 8. Poblar con datos del día

```bash
cd backend
npm run sync        # corre todos los sincronizadores
```

Sincronizadores individuales:

```bash
npm run sync:mlb    # MLB
npm run sync:wc     # Mundial 2026 — usa la API pública de ESPN, no necesita key
```

`npm run sync` acepta una fecha opcional: `node scripts/daily-sync.js 2026-07-27`

## Restaurar el respaldo completo (con datos de usuarios)

El volcado completo **no está en este repositorio** porque contiene correos y hashes de
contraseñas, y el repo es público. Está en el respaldo local:

```
C:\Users\artur\outlier-backup\outlier_mexicano_FULL.sql
```

Cópialo a una USB antes de formatear. Para restaurarlo en la máquina nueva, sobre una base de
datos vacía (reemplaza los pasos 4 y 5):

```bash
createdb -U postgres outlier_mexicano
psql -U postgres -d outlier_mexicano -f outlier_mexicano_FULL.sql
```

## Checklist antes de formatear

- [ ] `git push` a ambos remotes (`origin` y `outlierMX`) — sin cambios pendientes
- [ ] Copiar `backend/.env` a USB o gestor de contraseñas
- [ ] Copiar `C:\Users\artur\outlier-backup\outlier_mexicano_FULL.sql` a USB
