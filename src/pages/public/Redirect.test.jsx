import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const rpc = vi.fn()
vi.mock('../../lib/supabaseClient.js', () => ({
  supabase: {
    rpc: (...args) => rpc(...args),
    from: () => ({ insert: () => Promise.resolve({}) }),
  },
}))

import Redirect from './Redirect.jsx'

const negocio = { id: 'n1', umbral_calificacion: 4, url_resenia: 'https://g.page/r/test/review' }

function mockRpc(wifi) {
  rpc.mockImplementation((fn) => {
    if (fn === 'get_negocio_publico') return Promise.resolve({ data: [negocio], error: null })
    if (fn === 'registrar_respuesta_publica') return Promise.resolve({ data: [wifi], error: null })
  })
}

function renderPagina() {
  render(
    <MemoryRouter initialEntries={['/r/abc']}>
      <Routes>
        <Route path="/r/:codigo" element={<Redirect />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Redirect — WiFi tras la encuesta', () => {
  beforeEach(() => rpc.mockReset())

  it('no muestra el WiFi antes de calificar', async () => {
    mockRpc({ wifi_ssid: 'MiLocal', wifi_password: 'secreta123' })
    renderPagina()
    await screen.findByText('¿Qué tan satisfecho estás?')
    expect(screen.queryByText('MiLocal')).not.toBeInTheDocument()
    expect(rpc).not.toHaveBeenCalledWith('registrar_respuesta_publica', expect.anything())
  })

  it('camino privado: muestra el WiFi después de enviar el comentario', async () => {
    mockRpc({ wifi_ssid: 'MiLocal', wifi_password: 'secreta123' })
    renderPagina()
    fireEvent.click(await screen.findByLabelText('Calificar 2 de 5'))
    expect(screen.queryByText('MiLocal')).not.toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText(/qué se puede mejorar/i), { target: { value: 'Tardaron' } })
    fireEvent.click(screen.getByText('Enviar'))

    expect(await screen.findByText('MiLocal')).toBeInTheDocument()
    expect(screen.getByText('secreta123')).toBeInTheDocument()
    expect(rpc).toHaveBeenCalledWith('registrar_respuesta_publica', {
      p_codigo: 'abc',
      p_calificacion: 2,
      p_comentario: 'Tardaron',
      p_prefiere_publico: false,
    })
  })

  it('camino público con WiFi: muestra el WiFi y el botón a Google en vez de redirigir solo', async () => {
    mockRpc({ wifi_ssid: 'MiLocal', wifi_password: 'secreta123' })
    renderPagina()
    fireEvent.click(await screen.findByLabelText('Calificar 5 de 5'))

    expect(await screen.findByText('MiLocal')).toBeInTheDocument()
    expect(screen.getByText('Dejar mi reseña en Google').closest('a')).toHaveAttribute('href', negocio.url_resenia)
  })

  it('camino privado: después del comentario ofrece igual la reseña pública (sin review gating)', async () => {
    mockRpc({ wifi_ssid: null, wifi_password: null })
    renderPagina()
    fireEvent.click(await screen.findByLabelText('Calificar 2 de 5'))
    expect(screen.queryByText(/reseña pública en Google/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Enviar'))
    const link = await screen.findByText(/reseña pública en Google/)
    expect(link.closest('a')).toHaveAttribute('href', negocio.url_resenia)
  })

  it('camino privado: puede elegir ir directo a la reseña pública sin escribir comentario', async () => {
    mockRpc({ wifi_ssid: 'MiLocal', wifi_password: 'secreta123' })
    renderPagina()
    fireEvent.click(await screen.findByLabelText('Calificar 2 de 5'))
    fireEvent.click(screen.getByText('Prefiero dejar una reseña pública'))

    expect(await screen.findByText('MiLocal')).toBeInTheDocument()
    expect(screen.getByText('Dejar mi reseña en Google').closest('a')).toHaveAttribute('href', negocio.url_resenia)
    expect(rpc).toHaveBeenCalledWith('registrar_respuesta_publica', {
      p_codigo: 'abc',
      p_calificacion: 2,
      p_comentario: '',
      p_prefiere_publico: true,
    })
  })

  it('camino privado sin WiFi configurado: solo agradece', async () => {
    mockRpc({ wifi_ssid: null, wifi_password: null })
    renderPagina()
    fireEvent.click(await screen.findByLabelText('Calificar 1 de 5'))
    fireEvent.click(screen.getByText('Enviar'))

    expect(await screen.findByText('Gracias por tu comentario.')).toBeInTheDocument()
    expect(screen.queryByText('WiFi del local')).not.toBeInTheDocument()
  })
})
