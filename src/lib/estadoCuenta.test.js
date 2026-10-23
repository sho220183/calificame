import { describe, it, expect } from 'vitest'
import { estadoDeCuenta } from './estadoCuenta.js'

const ahora = new Date('2026-10-22T12:00:00Z')

describe('estadoDeCuenta', () => {
  it('al día cuando el pago no está vencido', () => {
    expect(estadoDeCuenta({ estado_pago: 'al_dia', bloqueo_el: null }, ahora).estado).toBe('al_dia')
  })

  it('en gracia mientras no llegó la fecha de bloqueo', () => {
    const r = estadoDeCuenta({ estado_pago: 'vencido', bloqueo_el: '2026-10-25T12:00:00Z' }, ahora)
    expect(r.estado).toBe('gracia')
    expect(r.bloqueoEl.toISOString()).toBe('2026-10-25T12:00:00.000Z')
  })

  it('bloqueado una vez pasada la fecha de bloqueo', () => {
    expect(estadoDeCuenta({ estado_pago: 'vencido', bloqueo_el: '2026-10-20T12:00:00Z' }, ahora).estado).toBe('bloqueado')
  })

  it('sin datos del negocio no bloquea', () => {
    expect(estadoDeCuenta(null, ahora).estado).toBe('al_dia')
  })
})
