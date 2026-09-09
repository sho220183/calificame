-- El comercio puede ajustar la configuración de su propio negocio (por ahora,
-- desde el panel solo se edita el umbral de calificación en "Mi QR").
create policy "comercio_actualiza_su_negocio" on negocios
  for update using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.negocio_id = negocios.id
    )
  )
  with check (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.negocio_id = negocios.id
    )
  );
