// Estado de la cuenta de un negocio a partir de lo que devuelve la base
// (estado_pago + la columna calculada bloqueo_el). El período de gracia se
// define solo en SQL (función bloqueo_el); acá únicamente se interpreta.
// El bloqueo real lo aplican las políticas de RLS: esto es para mostrarlo.
export function estadoDeCuenta(negocio, ahora = new Date()) {
  if (!negocio || negocio.estado_pago !== 'vencido' || !negocio.bloqueo_el) {
    return { estado: 'al_dia', bloqueoEl: null }
  }
  const bloqueoEl = new Date(negocio.bloqueo_el)
  return { estado: bloqueoEl <= ahora ? 'bloqueado' : 'gracia', bloqueoEl }
}
