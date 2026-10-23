-- respuestas_encuesta nunca tuvo política de lectura para el admin (escaneos
-- sí: admin_ve_todos_escaneos), así que el Resumen del panel JCG contaba 0
-- respuestas siempre. El admin ve todas, incluidos los comentarios privados,
-- y no le afecta el bloqueo por pago vencido.
create policy "admin_ve_todas_respuestas" on respuestas_encuesta
  for select using (public.is_admin());

-- Las políticas de comercio de 0011 llaman a negocio_bloqueado(), que anon no
-- puede ejecutar: un select sin sesión daba error en vez de volver vacío.
-- Se limitan a usuarios con sesión (anon nunca tuvo nada que ver ahí).
alter policy "comercio_ve_sus_escaneos" on escaneos to authenticated;
alter policy "comercio_ve_sus_respuestas" on respuestas_encuesta to authenticated;

-- Aviso del linter de Supabase (function_search_path_mutable).
alter function public.bloqueo_el(negocios) set search_path = public;
