import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'

export default function MiQR() {
  // TODO: leer el código real y la regla de redirección desde Supabase.
  const codigo = 'mi-negocio'
  const url = `https://calificame.com.py/r/${codigo}`
  const [umbral, setUmbral] = useState(4)

  return (
    <DashboardLayout role="comercio">
      <Topbar title="Mi QR" subtitle="Enlace, diseño del tótem y regla de filtro" accountLabel="Mi negocio" />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
        <Card title="Tu enlace">
          <code
            style={{
              display: 'block',
              background: 'var(--bg-surface-raised)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              fontSize: 13,
              color: 'var(--accent)',
            }}
          >
            {url}
          </code>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 10 }}>
            Este es el enlace fijo que va impreso en tu tótem. No cambia aunque ajustes la regla
            de filtro abajo.
          </p>
        </Card>

        <Card title="Regla de filtro de satisfacción">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            A partir de esta calificación, el cliente va directo a tu reseña pública en Google. Por
            debajo, el comentario queda como feedback privado, visible solo para vos.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="range"
              min="1"
              max="5"
              value={umbral}
              onChange={(e) => setUmbral(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, minWidth: 24 }}>
              {umbral}
            </span>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
