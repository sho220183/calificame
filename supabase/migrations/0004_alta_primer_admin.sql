insert into usuarios (id, rol)
values ('a8cef247-efa3-448a-98b3-d861c0bcdf18', 'admin')
on conflict (id) do update set rol = 'admin';
