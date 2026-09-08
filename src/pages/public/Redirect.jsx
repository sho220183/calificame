import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'

// Página pública que recibe al cliente cuando escanea el QR físico.
// Flujo: busca el negocio por su código (vía función pública acotada) ->
// registra el escaneo -> muestra la encuesta rápida -> según la
// calificación, redirige a Google Reviews o guarda el comentario como
// feedback privado para el negocio.
export default function Redirect() {
  const { codigo } = useParams()
  const [negocio, setNegocio] = useState(undefined) // undefined = cargando, null = no existe
  const [calificacion, setCalificacion] = useState(null)
  const [comentario, setComentario] = useState('')
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.rpc('get_negocio_publico', { p_codigo: codigo })
      if (error || !data || data.length === 0) {
        setNegocio(null)
        return
      }
      const encontrado = data[0]
      setNegocio(encontrado)

      // Registrar el escaneo, sin bloquear la carga de la encuesta.
      supabase.from('escaneos').insert({
        negocio_id: encontrado.id,
        user_agent: navigator.userAgent,
      })
    }
    init()
  }, [codigo])

  async function enviarCalificacion(valor) {
    setCalificacion(valor)
    if (!negocio) return

    const vaAPublico = valor >= negocio.umbral_calificacion

    if (vaAPublico) {
      await supabase.from('respuestas_encuesta').insert({
        negocio_id: negocio.id,
        calificacion: valor,
        redirigido_publico: true,
      })
      window.location.href = negocio.url_resenia || 'https://search.google.com/local/writereview'
    }
    // Si no va a público, se guarda el comentario recién cuando envíe el formulario.
  }

  async function enviarFeedback(e) {
    e.preventDefault()
    if (!negocio) return

    await supabase.from('respuestas_encuesta').insert({
      negocio_id: negocio.id,
      calificacion,
      comentario,
      redirigido_publico: false,
    })
    setEnviado(true)
  }

  if (negocio === undefined) {
    return <PantallaCentrada><p style={{ fontSize: 14 }}>Cargando...</p></PantallaCentrada>
  }

  if (negocio === null) {
    return (
      <PantallaCentrada>
        <p style={{ fontSize: 15 }}>Este enlace no corresponde a ningún negocio activo.</p>
      </PantallaCentrada>
    )
  }

  return (
    <PantallaCentrada>
      {calificacion === null && (
        <>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>¿Qué tan satisfecho estás?</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Tu opinión nos ayuda a mejorar
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => enviarCalificacion(n)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: 16,
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}

      {calificacion !== null && calificacion < negocio.umbral_calificacion && !enviado && (
        <form onSubmit={enviarFeedback}>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Contanos qué pasó</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Esto lo ve directamente el negocio, no se publica
          </p>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            placeholder="Contanos qué se puede mejorar..."
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              padding: 12,
              fontSize: 14,
              fontFamily: 'inherit',
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: 12,
              width: '100%',
              background: 'var(--accent)',
              color: 'var(--accent-text-on-fill)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 0',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Enviar
          </button>
        </form>
      )}

      {enviado && <p style={{ fontSize: 15 }}>Gracias por tu comentario.</p>}
    </PantallaCentrada>
  )
}

function PantallaCentrada({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-page)',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>{children}</div>
    </div>
  )
}
