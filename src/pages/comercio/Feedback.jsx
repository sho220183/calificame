import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'
import { IconInbox } from '../../components/ui/Icon.jsx'

export default function Feedback() {
  // TODO: traer de la tabla `respuestas_encuesta` donde calificacion < umbral del negocio.
  const respuestas = []

  return (
    <DashboardLayout role="comercio">
      <Topbar
        title="Feedback privado"
        subtitle="Comentarios que no se publicaron en Google"
        accountLabel="Mi negocio"
      />
      <div style={{ padding: 24 }}>
        <Card title={`Comentarios recibidos (${respuestas.length})`}>
          {respuestas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <IconInbox size={26} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
                Todavía no recibiste feedback privado. Va a aparecer acá cuando un cliente
                califique por debajo del umbral que definiste en “Mi QR”.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {respuestas.map((r) => (
                <div key={r.id} className="card" style={{ padding: 12 }}>
                  <span className="badge badge-warning tabular-nums">{r.calificacion} / 5</span>
                  <div style={{ fontSize: 14, marginTop: 8 }}>{r.comentario}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
