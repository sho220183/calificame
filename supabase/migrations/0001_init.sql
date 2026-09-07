-- Esquema inicial del sistema de QR dinámico
-- Se corre una vez que el proyecto de Supabase esté creado.

create table negocios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  codigo text unique not null,              -- usado en /r/:codigo
  plan text not null default 'basico',       -- basico | pro | premium
  url_resenia text,                          -- destino final (Google Reviews, etc.)
  umbral_calificacion int not null default 4, -- desde qué nota va a reseña pública
  creado_en timestamptz not null default now()
);

-- Vincula usuarios de auth.users con un rol y, si corresponde, un negocio
create table usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  rol text not null check (rol in ('admin', 'comercio')),
  negocio_id uuid references negocios (id) on delete cascade,
  creado_en timestamptz not null default now()
);

create table escaneos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios (id) on delete cascade,
  creado_en timestamptz not null default now(),
  user_agent text
);

create table respuestas_encuesta (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios (id) on delete cascade,
  calificacion int not null check (calificacion between 1 and 5),
  comentario text,
  creado_en timestamptz not null default now()
);

-- Row-level security: cada comercio ve solo lo suyo, el admin ve todo.
alter table negocios enable row level security;
alter table escaneos enable row level security;
alter table respuestas_encuesta enable row level security;

create policy "admin_ve_todo_negocios" on negocios
  for select using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
  );

create policy "comercio_ve_su_negocio" on negocios
  for select using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.negocio_id = negocios.id
    )
  );

create policy "admin_ve_todos_escaneos" on escaneos
  for select using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
  );

create policy "comercio_ve_sus_escaneos" on escaneos
  for select using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.negocio_id = escaneos.negocio_id
    )
  );

create policy "comercio_ve_sus_respuestas" on respuestas_encuesta
  for select using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.negocio_id = respuestas_encuesta.negocio_id
    )
  );

-- El registro de escaneos y respuestas lo hace la app pública (sin sesión),
-- así que se permite insert abierto pero nunca select sin pertenecer al negocio.
create policy "insert_escaneo_publico" on escaneos
  for insert with check (true);

create policy "insert_respuesta_publica" on respuestas_encuesta
  for insert with check (true);
