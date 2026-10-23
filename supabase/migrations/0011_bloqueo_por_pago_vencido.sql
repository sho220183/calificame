-- Negocios con pago vencido: el QR y la encuesta siguen funcionando (el
-- cliente del local no nota nada y los datos se siguen guardando), pero
-- después de 7 días de gracia el comercio deja de poder ver su feedback y
-- sus estadísticas hasta regularizar. El admin no se ve afectado.

alter table negocios add column vencido_desde timestamptz;

-- vencido_desde se mantiene solo: se fija al pasar a 'vencido' y se limpia
-- al volver a 'al_dia'. (Corre después del trigger de lista blanca por orden
-- alfabético, y el comercio no puede tocar estado_pago de todos modos.)
create or replace function public.negocios_fijar_vencido_desde()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.estado_pago = 'vencido' then
    if tg_op = 'INSERT' or old.estado_pago is distinct from 'vencido' then
      new.vencido_desde := now();
    end if;
  else
    new.vencido_desde := null;
  end if;
  return new;
end;
$$;

revoke execute on function public.negocios_fijar_vencido_desde() from public, anon, authenticated;

create trigger negocios_vencido_desde
  before insert or update of estado_pago on negocios
  for each row execute function public.negocios_fijar_vencido_desde();

-- Los que ya estaban vencidos: desde el último registro de facturación que
-- los marcó así, o desde ahora si no hay historial (arrancan con gracia completa).
update negocios n
set vencido_desde = coalesce(
  (select max(h.creado_en) from historial_facturacion h
   where h.negocio_id = n.id and h.estado_pago = 'vencido'),
  now()
)
where n.estado_pago = 'vencido';

-- Única fuente de verdad del período de gracia. Se expone como columna
-- calculada en la API: select('estado_pago, bloqueo_el') sobre negocios.
create or replace function public.bloqueo_el(n negocios)
returns timestamptz
language sql
stable
as $$
  select case when n.estado_pago = 'vencido' then n.vencido_desde + interval '7 days' end;
$$;

create or replace function public.negocio_bloqueado(p_negocio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select public.bloqueo_el(n) <= now() from negocios n where n.id = p_negocio_id),
    false
  );
$$;

revoke execute on function public.negocio_bloqueado(uuid) from public, anon;
grant execute on function public.negocio_bloqueado(uuid) to authenticated;

-- El comercio bloqueado deja de ver escaneos y respuestas (el admin tiene sus
-- propias políticas y sigue viendo todo).
drop policy "comercio_ve_sus_escaneos" on escaneos;
create policy "comercio_ve_sus_escaneos" on escaneos
  for select using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.negocio_id = escaneos.negocio_id
    )
    and not public.negocio_bloqueado(escaneos.negocio_id)
  );

drop policy "comercio_ve_sus_respuestas" on respuestas_encuesta;
create policy "comercio_ve_sus_respuestas" on respuestas_encuesta
  for select using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.negocio_id = respuestas_encuesta.negocio_id
    )
    and not public.negocio_bloqueado(respuestas_encuesta.negocio_id)
  );
