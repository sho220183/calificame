-- Corrección: la tabla `usuarios` había quedado sin RLS habilitado en el
-- esquema inicial (0001), lo que hubiera permitido leer todos los usuarios
-- de todos los negocios con la anon key. Se agrega una función auxiliar
-- (security definer) para evitar recursión de políticas sobre la propia
-- tabla usuarios.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from usuarios where id = auth.uid() and rol = 'admin');
$$;

alter table usuarios enable row level security;

create policy "usuario_ve_su_propia_fila" on usuarios
  for select using (id = auth.uid());

create policy "admin_ve_todos_usuarios" on usuarios
  for select using (public.is_admin());

-- Nota: el alta de negocios/usuarios (insert) la hace el panel admin a
-- través del service_role key desde el backend, no con el anon key del
-- cliente, así que no hace falta política de insert pública acá.
