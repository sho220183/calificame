# Calificame — sistema SaaS de QR dinámico

Desarrollado por JCG Infotech. Dominio del producto: calificame.com.py

Panel admin (JCG) + panel comercio para gestionar tótems con QR que redirigen
a reseñas públicas o feedback privado según una encuesta rápida de
satisfacción.

## Estado actual

Este es el **scaffold inicial**: estructura de carpetas, componentes de UI
con la identidad de marca de JCG InfraTech (navy/cian), y las tres pantallas
clave con datos de ejemplo. Todavía **no está conectado a un proyecto real
de Supabase** — eso lo hacemos en el siguiente paso, cuando confirmes que
seguimos.

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

Rutas disponibles:
- `/login` — acceso
- `/admin` y `/admin/negocios` — panel JCG
- `/comercio`, `/comercio/mi-qr`, `/comercio/feedback` — panel del negocio
- `/r/:codigo` — la página pública que ve el cliente al escanear el QR (encuesta + redirección)

## Pendiente antes de que esto funcione con datos reales

1. Crear el proyecto en Supabase y correr `supabase/migrations/0001_init.sql`.
2. Completar `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Reemplazar los `TODO` marcados en el código (login real, lectura/escritura
   de negocios, registro de escaneos, guardado de encuesta) por llamadas a
   Supabase.
4. ✅ Dominio decidido: `calificame.com.py` — falta registrarlo en NIC.py
   (con el RUC de JCG Infotech) y apuntarlo al hosting una vez que el
   sistema esté listo para producción.
