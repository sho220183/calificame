import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'
import { IconCard } from '../../components/ui/Icon.jsx'

export default function Planes() {
  return (
    <DashboardLayout role="admin">
      <Topbar
        title="Planes y facturación"
        subtitle="Gestión de planes por negocio"
        accountLabel="Calificame · Admin (JCG)"
      />
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '28px 16px' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <IconCard size={20} />
            </div>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Próximamente</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 420, margin: '0 auto' }}>
              Acá va a vivir la gestión de planes y facturación por negocio (básico / pro /
              premium, estado de pago, historial). Todavía no está conectado — es la próxima
              pieza a construir.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
