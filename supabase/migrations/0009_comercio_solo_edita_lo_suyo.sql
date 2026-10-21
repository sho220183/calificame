-- La política "comercio_actualiza_su_negocio" (0005) limita QUÉ fila puede
-- editar el comercio, pero no QUÉ columnas: con un request armado a mano podía
-- cambiarse el plan, el estado de pago, el código del QR, etc.
-- Este trigger aplica una lista blanca: un usuario que no es admin solo puede
-- modificar las columnas que se editan desde "Mi QR". Es lista blanca a
-- propósito, para que una columna nueva quede protegida por defecto.
create or replace function public.negocios_restringir_edicion_comercio()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  columnas_del_comercio text[] := array[
    'umbral_calificacion',
    'qr_color_fondo',
    'qr_color_figura',
    'qr_texto_superior',
    'qr_texto_inferior',
    'wifi_ssid',
    'wifi_password'
  ];
begin
  -- Sin auth.uid() es el backend (service_role) o SQL directo: sin restricción.
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if (to_jsonb(new) - columnas_del_comercio) is distinct from (to_jsonb(old) - columnas_del_comercio) then
    raise exception 'No tenés permiso para modificar esos datos del negocio'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

create trigger negocios_restringir_edicion_comercio
  before update on negocios
  for each row execute function public.negocios_restringir_edicion_comercio();

-- Es solo para el trigger: que no quede expuesta como /rest/v1/rpc/...
revoke execute on function public.negocios_restringir_edicion_comercio() from public, anon, authenticated;
