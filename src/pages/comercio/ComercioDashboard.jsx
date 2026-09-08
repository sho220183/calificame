import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import Card from '../../components/ui/Card.jsx'
import { IconScan, IconStar, IconMessage, IconInbox } from '../../components/ui/Icon.jsx'

const resumen = [
  { label: 'Escaneos este mes', value: '0', icon: IconScan },
  { label: 'Reseñas públicas', value: '0', icon: IconStar },
  { label: 'Feedback privado', value: '0', icon: IconMessage },
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
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <IconInbox size={26} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
              Todavía no hay actividad registrada. En cuanto alguien escanee tu QR, vas a ver el
              detalle acá.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
