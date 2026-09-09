import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'
import { IconQr, IconAlert } from '../../components/ui/Icon.jsx'
import { useAuth } from '../../lib/AuthContext.jsx'
import { supabase } from '../../lib/supabaseClient.js'
import { dibujarQrComposicion, contrasteBajo } from '../../lib/qrImage.js'

export default function MiQR() {
  const { negocioId } = useAuth()
  const [negocio, setNegocio] = useState(undefined) // undefined = cargando, null = sin negocio asignado
  const [umbral, setUmbral] = useState(4)
  const [colorFondo, setColorFondo] = useState('#ffffff')
  const [colorFigura, setColorFigura] = useState('#0a1723')
  const [textoSuperior, setTextoSuperior] = useState('')
  const [textoInferior, setTextoInferior] = useState('')
  const [guardando, setGuardando] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!negocioId) return
    supabase
      .from('negocios')
      .select('nombre, codigo, umbral_calificacion, qr_color_fondo, qr_color_figura, qr_texto_superior, qr_texto_inferior')
      .eq('id', negocioId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setNegocio(null)
          return
        }
        setNegocio(data)
        setUmbral(data.umbral_calificacion)
        setColorFondo(data.qr_color_fondo)
        setColorFigura(data.qr_color_figura)
        setTextoSuperior(data.qr_texto_superior ?? data.nombre ?? '')
        setTextoInferior(data.qr_texto_inferior ?? 'Escaneá y calificanos')
      })
  }, [negocioId])

  const url = negocio ? `https://calificame.com.py/r/${negocio.codigo}` : ''

  useEffect(() => {
    if (!negocio || !canvasRef.current) return
    dibujarQrComposicion(canvasRef.current, {
      url,
      colorFondo,
      colorFigura,
      textoSuperior: textoSuperior.trim(),
      textoInferior: textoInferior.trim(),
    })
  }, [negocio, url, colorFondo, colorFigura, textoSuperior, textoInferior])

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

  async function guardarPersonalizacion(cambios) {
    if (!negocioId) return
    setGuardando(true)
    const { error } = await supabase.from('negocios').update(cambios).eq('id', negocioId)
    setGuardando(false)
    if (!error) {
      setNegocio((n) => ({ ...n, ...cambios }))
    }
  }

  function descargarPng() {
    if (!canvasRef.current) return
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = `qr-${negocio?.codigo ?? 'calificame'}.png`
    a.click()
  }

  const advertenciaContraste = contrasteBajo(colorFondo, colorFigura)

  return (
    <DashboardLayout role="comercio">
      <Topbar title="Mi QR" subtitle="Enlace, diseño del tótem y regla de filtro" accountLabel="Mi negocio" />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
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
                de filtro o el diseño de abajo.
              </p>
            </>
          )}
        </Card>

        {negocio && (
          <Card
            title="Diseño del QR"
            action={guardando ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Guardando...</span> : null}
          >
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  flexShrink: 0,
                }}
              >
                <canvas ref={canvasRef} style={{ width: 220, height: 'auto', borderRadius: 4 }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 220 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Texto de arriba (ej: nombre del negocio)</span>
                  <input
                    className="field"
                    maxLength={40}
                    value={textoSuperior}
                    onChange={(e) => setTextoSuperior(e.target.value)}
                    onBlur={() => guardarPersonalizacion({ qr_texto_superior: textoSuperior.trim() || null })}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Texto de abajo (ej: una invitación corta)</span>
                  <input
                    className="field"
                    maxLength={60}
                    value={textoInferior}
                    onChange={(e) => setTextoInferior(e.target.value)}
                    onBlur={() => guardarPersonalizacion({ qr_texto_inferior: textoInferior.trim() || null })}
                  />
                </label>

                <div style={{ display: 'flex', gap: 20 }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Color de fondo</span>
                    <input
                      type="color"
                      value={colorFondo}
                      onChange={(e) => {
                        setColorFondo(e.target.value)
                        guardarPersonalizacion({ qr_color_fondo: e.target.value })
                      }}
                      style={{ width: 44, height: 32, border: 'none', background: 'none', cursor: 'pointer' }}
                    />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Color del QR</span>
                    <input
                      type="color"
                      value={colorFigura}
                      onChange={(e) => {
                        setColorFigura(e.target.value)
                        guardarPersonalizacion({ qr_color_figura: e.target.value })
                      }}
                      style={{ width: 44, height: 32, border: 'none', background: 'none', cursor: 'pointer' }}
                    />
                  </label>
                </div>

                {advertenciaContraste && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <IconAlert size={15} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 12.5, color: 'var(--warning)', margin: 0 }}>
                      El contraste entre los colores es muy bajo — el QR podría no leerse bien.
                      Probá con colores más opuestos entre sí.
                    </p>
                  </div>
                )}

                <button onClick={descargarPng} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Descargar PNG
                </button>
              </div>
            </div>
          </Card>
        )}

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
