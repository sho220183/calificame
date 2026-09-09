import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'
import { IconQr } from '../../components/ui/Icon.jsx'
import { useAuth } from '../../lib/AuthContext.jsx'
import { supabase } from '../../lib/supabaseClient.js'

export default function MiQR() {
  const { negocioId } = useAuth()
  const [negocio, setNegocio] = useState(undefined) // undefined = cargando, null = sin negocio asignado
  const [umbral, setUmbral] = useState(4)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!negocioId) return
    supabase
      .from('negocios')
      .select('codigo, umbral_calificacion')
      .eq('id', negocioId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setNegocio(null)
          return
        }
        setNegocio(data)
        setUmbral(data.umbral_calificacion)
      })
  }, [negocioId])

  async function guardarUmbral(valor) {
    if (!negocioId || valor === negocio?.umbral_calificacion) return
    setGuardando(true)
    const { error } = await supabase
      .from('negocios')
      .update({ umbral_calificacion: valor })
      .eq('id', negocioId)
    setGuardando(false)
    if (!error) {
      setNegocio((n) => ({ ...n, umbral_calificacion: valor }))
    }
  }

  const url = negocio ? `https://calificame.com.py/r/${negocio.codigo}` : ''

  return (
    <DashboardLayout role="comercio">
      <Topbar title="Mi QR" subtitle="Enlace, diseño del tótem y regla de filtro" accountLabel="Mi negocio" />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
        <Card title="Tu enlace">
          {negocio === undefined ? (
            <div className="skeleton" style={{ height: 40 }} />
          ) : negocio === null ? (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Tu usuario todavía no tiene un negocio asignado. Contactá al administrador.
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconQr size={18} />
                </div>
                <code
                  className="tabular-nums"
                  style={{
                    display: 'block',
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontSize: 13,
                    color: 'var(--accent)',
                    flex: 1,
                    overflowX: 'auto',
                  }}
                >
                  {url}
                </code>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 12 }}>
                Este es el enlace fijo que va impreso en tu tótem. No cambia aunque ajustes la regla
                de filtro abajo.
              </p>
            </>
          )}
        </Card>

        <Card
          title="Regla de filtro de satisfacción"
          action={guardando ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Guardando...</span> : null}
        >
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
            A partir de esta calificación, el cliente va directo a tu reseña pública en Google. Por
            debajo, el comentario queda como feedback privado, visible solo para vos.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="range"
              min="1"
              max="5"
              value={umbral}
              disabled={!negocio}
              onChange={(e) => setUmbral(Number(e.target.value))}
              onMouseUp={(e) => guardarUmbral(Number(e.target.value))}
              onTouchEnd={(e) => guardarUmbral(Number(e.target.value))}
              onKeyUp={(e) => guardarUmbral(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent)' }}
            />
            <span
              className="badge badge-success tabular-nums"
              style={{ fontSize: 14, fontFamily: 'var(--font-display)' }}
            >
              {umbral} / 5
            </span>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
