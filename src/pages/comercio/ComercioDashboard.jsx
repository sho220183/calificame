import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import Card from '../../components/ui/Card.jsx'

const resumen = [
  { label: 'Escaneos este mes', value: '0' },
  { label: 'Reseñas públicas', value: '0' },
  { label: 'Feedback privado', value: '0' },
]

export default function ComercioDashboard() {
  return (
    <DashboardLayout role="comercio">
      <Topbar title="Resumen" subtitle="Actividad de tu QR" accountLabel="Mi negocio" />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {resumen.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>

        <Card title="Últimos escaneos">
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Todavía no hay actividad registrada. En cuanto alguien escanee tu QR, vas a ver el
            detalle acá.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
