import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'

export default function Negocios() {
  // TODO: reemplazar por lectura/escritura real en la tabla `negocios` de Supabase.
  const [negocios, setNegocios] = useState([])
  const [nombre, setNombre] = useState('')
  const [plan, setPlan] = useState('basico')

  function altaNegocio(e) {
    e.preventDefault()
    if (!nombre.trim()) return
    setNegocios((prev) => [
      ...prev,
      { id: crypto.randomUUID(), nombre, plan, codigo: nombre.toLowerCase().replace(/\s+/g, '-') },
    ])
    setNombre('')
  }

  return (
    <DashboardLayout role="admin">
      <Topbar title="Negocios" subtitle="Alta y administración de comercios" accountLabel="Calificame · Admin (JCG)" />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card title="Dar de alta un negocio">
          <form onSubmit={altaNegocio} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del negocio"
              style={inputStyle}
            />
            <select value={plan} onChange={(e) => setPlan(e.target.value)} style={inputStyle}>
              <option value="basico">Básico</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
            <button type="submit" style={buttonStyle}>
              Crear
            </button>
          </form>
        </Card>

        <Card title={`Negocios cargados (${negocios.length})`}>
          {negocios.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Todavía no cargaste ningún negocio.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Plan</th>
                  <th style={thStyle}>Código QR</th>
                </tr>
              </thead>
              <tbody>
                {negocios.map((n) => (
                  <tr key={n.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={tdStyle}>{n.nombre}</td>
                    <td style={tdStyle}>{n.plan}</td>
                    <td style={tdStyle}>/r/{n.codigo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}

const inputStyle = {
  background: 'var(--bg-surface-raised)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: '9px 12px',
  color: 'var(--text-primary)',
  fontSize: 14,
  flex: 1,
}

const buttonStyle = {
  background: 'var(--accent)',
  color: 'var(--accent-text-on-fill)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: '9px 16px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
}

const thStyle = { padding: '8px 6px', fontWeight: 500 }
const tdStyle = { padding: '10px 6px' }
