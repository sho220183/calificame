import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import Card from '../../components/ui/Card.jsx'
import { supabase } from '../../lib/supabaseClient.js'
import { IconStore, IconScan, IconStar } from '../../components/ui/Icon.jsx'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [negociosRecientes, setNegociosRecientes] = useState([])

  useEffect(() => {
    async function cargar() {
      const inicioMes = new Date()
      inicioMes.setDate(1)
      inicioMes.setHours(0, 0, 0, 0)

      const [negociosRes, escaneosRes, respuestasRes, recientesRes] = await Promise.all([
        supabase.from('negocios').select('id', { count: 'exact', head: true }),
        supabase
          .from('escaneos')
          .select('id', { count: 'exact', head: true })
          .gte('creado_en', inicioMes.toISOString()),
        supabase
          .from('respuestas_encuesta')
          .select('id', { count: 'exact', head: true })
          .eq('redirigido_publico', true)
          .gte('creado_en', inicioMes.toISOString()),
        supabase
          .from('negocios')
          .select('id, nombre, plan, creado_en')
          .order('creado_en', { ascending: false })
          .limit(5),
      ])

      setStats({
        negocios: negociosRes.count ?? 0,
        escaneos: escaneosRes.count ?? 0,
        resenias: respuestasRes.count ?? 0,
      })
      setNegociosRecientes(recientesRes.data ?? [])
    }
    cargar()
  }, [])

  const resumen = [
    { label: 'Negocios activos', value: stats ? stats.negocios : '...', icon: IconStore },
    { label: 'Escaneos este mes', value: stats ? stats.escaneos : '...', icon: IconScan },
    { label: 'Reseñas generadas', value: stats ? stats.resenias : '...', icon: IconStar },
  ]

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
          {negociosRecientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <IconStore size={26} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
                Todavía no hay negocios cargados. Andá a “Negocios” para dar de alta el primero.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {negociosRecientes.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    padding: '10px 2px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span>{n.nombre}</span>
                  <span className="badge badge-neutral">{n.plan}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
