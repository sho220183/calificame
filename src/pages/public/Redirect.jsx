import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Página pública que recibe al cliente cuando escanea el QR físico.
// Flujo: registra el escaneo -> muestra la encuesta rápida -> según la
// calificación, redirige a Google Reviews o guarda el comentario como
// feedback privado para el negocio.
export default function Redirect() {
  const { codigo } = useParams()
  const [calificacion, setCalificacion] = useState(null)
  const [comentario, setComentario] = useState('')
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    // TODO: registrar el escaneo en la tabla `escaneos` (codigo, fecha, user agent).
  }, [codigo])

  function enviarCalificacion(valor) {
    setCalificacion(valor)
    // TODO: leer `reglas_redireccion` del negocio para saber el umbral real.
    const umbral = 4
    if (valor >= umbral) {
      // TODO: reemplazar por la URL real de Google Reviews del negocio.
      window.location.href = 'https://search.google.com/local/writereview'
    }
  }

  function enviarFeedback(e) {
    e.preventDefault()
    // TODO: guardar en `respuestas_encuesta` (codigo, calificacion, comentario).
    setEnviado(true)
  }

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
      <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
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

        {calificacion !== null && calificacion < 4 && !enviado && (
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
      </div>
    </div>
  )
}
