import { describe, it, expect } from 'vitest'
import { adminRoutes, comercioRoutes } from './routes.js'

function checkRouteList(routes, nombre) {
  it(`${nombre}: cada ruta tiene un componente real`, () => {
    routes.forEach((r) => {
      expect(typeof r.element).toBe('function')
      expect(r.path).toMatch(/^\//)
      expect(r.label).toBeTruthy()
    })
  })

  it(`${nombre}: no hay rutas duplicadas`, () => {
    const paths = routes.map((r) => r.path)
    expect(new Set(paths).size).toBe(paths.length)
  })
}

describe('rutas del panel admin', () => checkRouteList(adminRoutes, 'admin'))
describe('rutas del panel comercio', () => checkRouteList(comercioRoutes, 'comercio'))
