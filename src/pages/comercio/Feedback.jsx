import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'

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
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Todavía no recibiste feedback privado. Va a aparecer acá cuando un cliente
              califique por debajo del umbral que definiste en "Mi QR".
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {respuestas.map((r) => (
                <div
                  key={r.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 12,
                  }}
                >
                  <div style={{ fontSize: 13, color: 'var(--warning)' }}>{r.calificacion} / 5</div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>{r.comentario}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
