alter table negocios
  add column estado_pago text not null default 'al_dia' check (estado_pago in ('al_dia', 'vencido'));

-- Antes no existía ninguna política que permitiera al admin actualizar un
-- negocio (solo podía crearlos e insertarlos); hace falta para poder
-- cambiar plan/estado de pago desde el panel.
create policy "admin_actualiza_negocios" on negocios
  for update using (public.is_admin())
  with check (public.is_admin());

create table historial_facturacion (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios(id) on delete cascade,
  plan text not null,
  estado_pago text not null,
  nota text,
  admin_id uuid references usuarios(id),
  creado_en timestamptz not null default now()
);

alter table historial_facturacion enable row level security;

create policy "admin_ve_historial_facturacion" on historial_facturacion
  for select using (public.is_admin());

create policy "admin_crea_historial_facturacion" on historial_facturacion
  for insert with check (public.is_admin());
