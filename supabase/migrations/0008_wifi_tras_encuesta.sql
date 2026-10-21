-- WiFi del local como recompensa al final de la encuesta.
-- El comercio carga SSID + contraseña en "Mi QR"; el cliente la ve recién
-- después de calificar (nunca antes).
alter table negocios
  add column wifi_ssid text check (char_length(wifi_ssid) <= 32),
  add column wifi_password text check (char_length(wifi_password) <= 63);

-- Registrar la respuesta y devolver el WiFi en un solo paso. Así el WiFi no
-- viaja en get_negocio_publico (que se llama al abrir la página, antes de
-- calificar): la única forma de obtenerlo es dejando una respuesta.
-- redirigido_publico se calcula acá contra el umbral real del negocio, en
-- vez de confiar en lo que mande el navegador.
create or replace function public.registrar_respuesta_publica(
  p_codigo text,
  p_calificacion int,
  p_comentario text default null
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
    p_calificacion >= v_negocio.umbral_calificacion
  );

  return query select v_negocio.wifi_ssid, v_negocio.wifi_password;
end;
$$;

grant execute on function public.registrar_respuesta_publica(text, int, text) to anon, authenticated;
