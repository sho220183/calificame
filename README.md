# Calificame — sistema SaaS de QR dinámico

Desarrollado por JCG Infotech. Dominio del producto: calificame.com.py

Panel admin (JCG) + panel comercio para gestionar tótems con QR que redirigen
a reseñas públicas o feedback privado según una encuesta rápida de
satisfacción.

## Estado actual

Proyecto real de Supabase creado y conectado (`calificame`, región
`sa-east-1`). Login, panel admin (negocios, resumen) y el flujo público de
escaneo (`/r/:codigo`) ya funcionan contra datos reales. Lo que falta:
terminar de conectar el panel comercio (Mi QR, Feedback privado, Resumen) y
construir Planes y facturación.

## Estructura

```
src/
  components/layout/   Sidebar, Topbar, DashboardLayout
  components/ui/       Card, StatCard
  pages/admin/          Resumen y alta de negocios (panel JCG)
  pages/comercio/        Resumen, Mi QR (regla de filtro), Feedback privado
  pages/public/           Redirect.jsx -> la pantalla que ve el cliente al escanear
  pages/auth/              Login compartido
  lib/supabaseClient.js  Cliente de Supabase (lee de .env, todavía sin valores)
supabase/migrations/
  0001_init.sql          Esquema completo: negocios, usuarios, escaneos,
                          respuestas_encuesta, y las políticas de row-level
                          security que separan admin de comercio
```

## Cómo correrlo localmente

```bash
npm install
cp .env.example .env   # completar cuando exista el proyecto de Supabase
npm run dev
```

## Chequeos automáticos antes de pushear

`npm install` deja configurado un hook de git (`.githooks/pre-push`) que antes
de cada `git push` corre automáticamente:

```bash
npm run verify   # lint + tests + build
```

Si algo falla, el push se cancela y no llega roto a Netlify. Si necesitás
pushear de todos modos (por ejemplo, un WIP en una rama de prueba), usá
`git push --no-verify`.

Además, cada push corre lo mismo en GitHub Actions (`.github/workflows/ci.yml`)
como respaldo — así queda visible en GitHub aunque alguien pushee sin pasar
por el hook local (por ejemplo, desde otra máquina donde no se corrió
`npm install`).

**Nota Windows:** si el hook no se ejecuta al pushear desde PowerShell, corré
una vez `git config core.hooksPath .githooks` manualmente en la carpeta del
proyecto.

## Por qué existe `src/routes.js`

Las rutas de cada panel están centralizadas en un solo archivo, y tanto el
Sidebar como el router (`App.jsx`) se arman a partir de esa misma lista. Esto
existe puntualmente porque un link del menú llegó a apuntar a una página que
no estaba registrada en el router — con esta estructura, ese tipo de bug ya
no puede pasar: agregar una página nueva es agregar una entrada acá, no
tocar dos archivos por separado.

Rutas disponibles:
- `/login` — acceso
- `/admin` y `/admin/negocios` — panel JCG
- `/comercio`, `/comercio/mi-qr`, `/comercio/feedback` — panel del negocio
- `/r/:codigo` — la página pública que ve el cliente al escanear el QR (encuesta + redirección)

## Pendiente

1. Conectar el panel comercio a datos reales: Mi QR (código y umbral del
   negocio logueado), Feedback privado (leer `respuestas_encuesta`) y
   Resumen (stats reales) — mismo patrón ya usado en el panel admin.
2. Construir Planes y facturación (`/admin/planes`), hoy es un placeholder.
3. ✅ Dominio decidido: `calificame.com.py` — falta registrarlo en NIC.py
   (con el RUC de JCG Infotech) y apuntarlo al hosting una vez que el
   sistema esté listo para producción.
