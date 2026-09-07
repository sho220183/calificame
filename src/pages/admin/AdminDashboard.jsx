import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import Card from '../../components/ui/Card.jsx'

// Datos de ejemplo — se reemplazan por consultas a Supabase una vez creado el proyecto.
const resumen = [
  { label: 'Negocios activos', value: '0', trend: null },
  { label: 'Escaneos este mes', value: '0', trend: null },
  { label: 'Reseñas generadas', value: '0', trend: null },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <Topbar
        title="Resumen"
        subtitle="Estado general del sistema"
        accountLabel="Calificame · Admin (JCG)"
      />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {resumen.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>

        <Card title="Negocios recientes">
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Todavía no hay negocios cargados. Andá a "Negocios" para dar de alta el primero.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
