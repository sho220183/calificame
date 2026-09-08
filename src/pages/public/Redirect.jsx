import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'
import { LogoMark, IconCheck, IconAlert } from '../../components/ui/Icon.jsx'

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
    return (
      <PantallaCentrada>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 16px' }} />
        <div className="skeleton" style={{ width: '70%', height: 14, margin: '0 auto 8px' }} />
        <div className="skeleton" style={{ width: '50%', height: 14, margin: '0 auto' }} />
      </PantallaCentrada>
    )
  }

  if (negocio === null) {
    return (
      <PantallaCentrada>
        <IconAlert size={30} style={{ color: 'var(--warning)', marginBottom: 12 }} />
        <p style={{ fontSize: 15 }}>Este enlace no corresponde a ningún negocio activo.</p>
      </PantallaCentrada>
    )
  }

  return (
    <PantallaCentrada>
      {calificacion === null && (
        <div className="fade-in-up">
          <h1 style={{ fontSize: 21, marginBottom: 8 }}>¿Qué tan satisfecho estás?</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Tu opinión nos ayuda a mejorar
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => enviarCalificacion(n)} className="rating-btn" aria-label={`Calificar ${n} de 5`}>
                {n}
              </button>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11.5,
              color: 'var(--text-muted)',
              marginTop: 10,
              padding: '0 4px',
            }}
          >
            <span>Muy mal</span>
            <span>Excelente</span>
          </div>
        </div>
      )}

      {calificacion !== null && calificacion < negocio.umbral_calificacion && !enviado && (
        <form onSubmit={enviarFeedback} className="fade-in-up">
          <h1 style={{ fontSize: 21, marginBottom: 8 }}>Contanos qué pasó</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Esto lo ve directamente el negocio, no se publica
          </p>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            placeholder="Contanos qué se puede mejorar..."
            className="field"
            style={{ fontFamily: 'inherit', resize: 'vertical' }}
          />
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 14 }}>
            Enviar
          </button>
        </form>
      )}

      {enviado && (
        <div className="fade-in-up">
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: 'var(--success-soft)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <IconCheck size={22} />
          </div>
          <p style={{ fontSize: 15 }}>Gracias por tu comentario.</p>
        </div>
      )}
    </PantallaCentrada>
  )
}

function PantallaCentrada({ children }) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background:
          'radial-gradient(600px circle at 50% 0%, rgba(34, 195, 214, 0.08), transparent 60%), var(--bg-page)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>{children}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 32, opacity: 0.6 }}>
        <LogoMark size={16} />
        <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Calificame</span>
      </div>
    </div>
  )
}
