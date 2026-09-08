import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'

export default function Planes() {
  return (
    <DashboardLayout role="admin">
      <Topbar
        title="Planes y facturación"
        subtitle="Gestión de planes por negocio"
        accountLabel="Calificame · Admin (JCG)"
      />
      <div style={{ padding: 24 }}>
        <Card title="Próximamente">
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Acá va a vivir la gestión de planes y facturación por negocio (básico / pro /
            premium, estado de pago, historial). Todavía no está conectado — es la próxima
            pieza a construir.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
