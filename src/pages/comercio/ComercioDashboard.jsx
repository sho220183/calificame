import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import Card from '../../components/ui/Card.jsx'
import { IconScan, IconStar, IconMessage, IconInbox } from '../../components/ui/Icon.jsx'
import { useAuth } from '../../lib/AuthContext.jsx'
import { supabase } from '../../lib/supabaseClient.js'

export default function ComercioDashboard() {
  const { negocioId } = useAuth()
  const [stats, setStats] = useState(null)
  const [escaneosRecientes, setEscaneosRecientes] = useState([])

  useEffect(() => {
    if (!negocioId) return

    async function cargar() {
      const inicioMes = new Date()
      inicioMes.setDate(1)
      inicioMes.setHours(0, 0, 0, 0)

      const [escaneosRes, publicasRes, privadasRes, recientesRes] = await Promise.all([
        supabase
          .from('escaneos')
          .select('id', { count: 'exact', head: true })
          .eq('negocio_id', negocioId)
          .gte('creado_en', inicioMes.toISOString()),
        supabase
          .from('respuestas_encuesta')
          .select('id', { count: 'exact', head: true })
          .eq('negocio_id', negocioId)
          .eq('redirigido_publico', true),
        supabase
          .from('respuestas_encuesta')
          .select('id', { count: 'exact', head: true })
          .eq('negocio_id', negocioId)
          .eq('redirigido_publico', false),
        supabase
          .from('escaneos')
          .select('id, creado_en')
          .eq('negocio_id', negocioId)
          .order('creado_en', { ascending: false })
          .limit(5),
      ])

      setStats({
        escaneos: escaneosRes.count ?? 0,
        publicas: publicasRes.count ?? 0,
        privadas: privadasRes.count ?? 0,
      })
      setEscaneosRecientes(recientesRes.data ?? [])
    }
    cargar()
  }, [negocioId])

  const resumen = [
    { label: 'Escaneos este mes', value: stats ? stats.escaneos : '...', icon: IconScan },
    { label: 'Reseñas públicas', value: stats ? stats.publicas : '...', icon: IconStar },
    { label: 'Feedback privado', value: stats ? stats.privadas : '...', icon: IconMessage },
  ]

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
          {escaneosRecientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <IconInbox size={26} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
                Todavía no hay actividad registrada. En cuanto alguien escanee tu QR, vas a ver el
                detalle acá.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {escaneosRecientes.map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    padding: '10px 2px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Escaneo de QR</span>
                  <span className="tabular-nums" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {new Date(e.creado_en).toLocaleDateString('es-PY', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
