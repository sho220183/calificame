-- Fase 2: conexión real del panel admin y del flujo público de escaneo.

-- Función pública y acotada: el cliente que escanea el QR necesita saber
-- a qué negocio pertenece el código y cuál es su regla de redirección,
-- pero NUNCA debería poder leer la tabla `negocios` completa (eso expondría
-- todos los negocios de todos los clientes de Calificame vía la anon key).
create or replace function public.get_negocio_publico(p_codigo text)
returns table (id uuid, umbral_calificacion int, url_resenia text)
language sql
security definer
set search_path = public
as $$
  select id, umbral_calificacion, url_resenia
  from negocios
  where codigo = p_codigo;
$$;

grant execute on function public.get_negocio_publico(text) to anon, authenticated;

-- El admin puede dar de alta negocios desde el panel.
create policy "admin_crea_negocios" on negocios
  for insert with check (public.is_admin());

-- Registramos toda respuesta de encuesta (no solo el feedback privado),
-- para poder mostrar estadísticas reales de calificación en el dashboard.
alter table respuestas_encuesta
  add column redirigido_publico boolean not null default false;
