import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'
import { IconInbox } from '../../components/ui/Icon.jsx'
import { useAuth } from '../../lib/AuthContext.jsx'
import { supabase } from '../../lib/supabaseClient.js'

export default function Feedback() {
  const { negocioId } = useAuth()
  const [respuestas, setRespuestas] = useState(undefined) // undefined = cargando

  useEffect(() => {
    if (!negocioId) return
    supabase
      .from('respuestas_encuesta')
      .select('id, calificacion, comentario, creado_en')
      .eq('negocio_id', negocioId)
      .eq('redirigido_publico', false)
      .order('creado_en', { ascending: false })
      .then(({ data, error }) => {
        setRespuestas(error ? [] : data)
      })
  }, [negocioId])

  const cargando = respuestas === undefined
  const lista = respuestas ?? []

  return (
    <DashboardLayout role="comercio">
      <Topbar
        title="Feedback privado"
        subtitle="Comentarios que no se publicaron en Google"
        accountLabel="Mi negocio"
      />
      <div style={{ padding: 24 }}>
        <Card title={cargando ? 'Comentarios recibidos' : `Comentarios recibidos (${lista.length})`}>
          {cargando ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 54 }} />
              ))}
            </div>
          ) : lista.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <IconInbox size={26} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
                Todavía no recibiste feedback privado. Va a aparecer acá cuando un cliente
                califique por debajo del umbral que definiste en “Mi QR”.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lista.map((r) => (
                <div key={r.id} className="card" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-warning tabular-nums">{r.calificacion} / 5</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(r.creado_en).toLocaleDateString('es-PY', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, marginTop: 8 }}>
                    {r.comentario || <span style={{ color: 'var(--text-muted)' }}>Sin comentario</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
