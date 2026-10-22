-- Un cliente con calificación baja puede elegir igual la reseña pública
-- ("Prefiero dejar una reseña pública"). Hasta ahora redirigido_publico se
-- calculaba solo con el umbral y ese caso quedaba registrado como privado.
-- Se reemplaza la función (en vez de sumar una sobrecarga) para que PostgREST
-- no tenga dos versiones ambiguas; el parámetro nuevo tiene default, así que
-- las llamadas con tres argumentos siguen funcionando.
drop function public.registrar_respuesta_publica(text, int, text);

create function public.registrar_respuesta_publica(
  p_codigo text,
  p_calificacion int,
  p_comentario text default null,
  p_prefiere_publico boolean default false
)
returns table (wifi_ssid text, wifi_password text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_negocio negocios%rowtype;
begin
  if p_calificacion is null or p_calificacion < 1 or p_calificacion > 5 then
    raise exception 'calificacion fuera de rango';
  end if;

  select * into v_negocio from negocios where codigo = p_codigo;
  if not found then
    raise exception 'negocio inexistente';
  end if;

  insert into respuestas_encuesta (negocio_id, calificacion, comentario, redirigido_publico)
  values (
    v_negocio.id,
    p_calificacion,
    nullif(left(trim(p_comentario), 2000), ''),
    p_calificacion >= v_negocio.umbral_calificacion or coalesce(p_prefiere_publico, false)
  );

  return query select v_negocio.wifi_ssid, v_negocio.wifi_password;
end;
$$;

grant execute on function public.registrar_respuesta_publica(text, int, text, boolean) to anon, authenticated;
