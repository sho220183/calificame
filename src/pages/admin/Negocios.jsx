import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'
import { supabase } from '../../lib/supabaseClient.js'
import { IconStore } from '../../components/ui/Icon.jsx'

export default function Negocios() {
  const [negocios, setNegocios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nombre, setNombre] = useState('')
  const [plan, setPlan] = useState('basico')
  const [error, setError] = useState('')

  async function cargarNegocios() {
    setCargando(true)
    const { data, error: fetchError } = await supabase
      .from('negocios')
      .select('id, nombre, codigo, plan, creado_en')
      .order('creado_en', { ascending: false })

    if (fetchError) {
      setError('No se pudo cargar la lista de negocios')
    } else {
      setNegocios(data)
    }
    setCargando(false)
  }

  useEffect(() => {
    cargarNegocios()
  }, [])

  async function altaNegocio(e) {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) return

    const codigo = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // saca tildes
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { error: insertError } = await supabase
      .from('negocios')
      .insert({ nombre, codigo, plan })

    if (insertError) {
      setError(
        insertError.code === '23505'
          ? 'Ya existe un negocio con un código muy similar, probá con otro nombre'
          : 'No se pudo crear el negocio'
      )
      return
    }

    setNombre('')
    cargarNegocios()
  }

  return (
    <DashboardLayout role="admin">
      <Topbar
        title="Negocios"
        subtitle="Alta y administración de comercios"
        accountLabel="Calificame · Admin (JCG)"
      />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card title="Dar de alta un negocio">
          <form onSubmit={altaNegocio} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del negocio"
              className="field"
              style={{ flex: 1 }}
            />
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="field" style={{ flex: '0 0 140px' }}>
              <option value="basico">Básico</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Crear
            </button>
          </form>
          {error && <p role="alert" style={{ color: 'var(--danger)', fontSize: 13, marginTop: 10 }}>{error}</p>}
        </Card>

        <Card title={`Negocios cargados (${negocios.length})`}>
          {cargando ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 34 }} />
              ))}
            </div>
          ) : negocios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <IconStore size={26} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
                Todavía no cargaste ningún negocio.
              </p>
            </div>
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
                    <td style={tdStyle}>
                      <span className="badge badge-neutral">{n.plan}</span>
                    </td>
                    <td className="tabular-nums" style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                      /r/{n.codigo}
                    </td>
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

const thStyle = { padding: '8px 6px', fontWeight: 500 }
const tdStyle = { padding: '10px 6px' }
