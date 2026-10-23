# Calificame — sistema SaaS de QR dinámico

Desarrollado por JCG Infotech. Dominio del producto: calificame.com.py

Panel admin (JCG) + panel comercio para gestionar tótems con QR que redirigen
a reseñas públicas o feedback privado según una encuesta rápida de
satisfacción.

## Estado actual

Proyecto real de Supabase creado y conectado (`calificame`, región
`sa-east-1`). Login (con redirección según rol real), panel admin (negocios,
resumen), panel comercio (Mi QR, Feedback privado, Resumen) y el flujo
público de escaneo (`/r/:codigo`) ya funcionan contra datos reales. El panel
comercio ahora también requiere sesión iniciada (antes no tenía guard). "Mi
QR" genera la imagen real del código (no solo el link en texto), con
colores y textos personalizables por negocio, descargable en PNG. Planes y
facturación (admin) permite cambiar plan/estado de pago por negocio a mano,
con historial de auditoría — todavía sin cobro online, es gestión manual.
"Mi QR" también permite cargar el WiFi del local (red + contraseña): el
cliente lo ve recién al terminar la encuesta, en los dos caminos (reseña
pública o feedback privado). El WiFi solo lo devuelve la función
`registrar_respuesta_publica`, que primero guarda la respuesta — no viaja en
la carga inicial de la página. Si el negocio tiene WiFi, el camino público
ya no redirige solo a Google: muestra el WiFi y un botón "Dejar mi reseña en
Google" (se abre en otra pestaña para no perder la clave).

**Sin "review gating":** las políticas de Google prohíben pedir reseñas solo
a los clientes contentos. Por eso el camino privado (calificación baja)
ofrece la reseña pública en dos lugares: un botón "Prefiero dejar una reseña
pública" en el formulario del comentario (no hace falta escribir nada) y un
link "¿Querés dejar también una reseña pública?" después de enviarlo. El
comercio recibe primero la calificación, pero el cliente nunca se queda sin
la opción pública. No sacar esas opciones.

**Pago vencido:** cuando el admin marca un negocio como `vencido`, arrancan
7 días de gracia (el comercio ve un aviso con la fecha límite). Pasados esos
días, el panel del comercio deja de mostrar Resumen y Feedback hasta que el
admin lo vuelva a marcar `al_dia`. El QR y la encuesta **siguen funcionando**
y las respuestas se siguen guardando: el cliente del local no nota nada, y
al regularizar el comercio recupera todo. El bloqueo lo aplica la base (RLS),
no solo la pantalla. Los 7 días están definidos en un único lugar: la función
SQL `bloqueo_el` (migración `0011_bloqueo_por_pago_vencido.sql`).

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
  lib/qrImage.js          Genera la imagen del QR (código + textos + colores) en canvas
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

## En pruebas (pendiente de validar en uso real)

Implementado, aplicado en Supabase y probado con datos simulados, pero
todavía sin recorrer de punta a punta en el navegador:

- [ ] WiFi tras la encuesta: cargar red/clave en "Mi QR", escanear y
      calificar alto y bajo; el WiFi aparece recién al final.
- [ ] Sin review gating: con calificación baja, probar "Prefiero dejar una
      reseña pública" y el link después de enviar el comentario.
- [ ] Pago vencido: marcar un negocio `vencido` en Planes y ver el aviso
      amarillo en el panel comercio; para probar el bloqueo sin esperar 7
      días, correr en el SQL editor
      `update negocios set vencido_desde = now() - interval '8 days' where codigo = '...'`
      y ver el aviso rojo + Resumen/Feedback bloqueados; volver a `al_dia`.
- [ ] Resumen del admin: la cifra de reseñas ahora debería contar las reales
      (antes el admin no podía leer respuestas_encuesta y siempre daba 0).

## Pendiente

1. Cobro online real de los planes (hoy el estado de pago lo marca el admin
   a mano) — requiere elegir pasarela de pago antes de encarar esto.
2. ✅ Dominio decidido: `calificame.com.py` — falta registrarlo en NIC.py
   (con el RUC de JCG Infotech) y apuntarlo al hosting una vez que el
   sistema esté listo para producción.

## Ideas futuras (no urgentes, en el radar)

- ✅ ~~QR con acceso a WiFi al final del flujo~~ — implementado (migración
  `0008_wifi_tras_encuesta.sql`).
