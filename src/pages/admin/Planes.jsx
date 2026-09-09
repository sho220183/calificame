import { Fragment, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import Topbar from '../../components/layout/Topbar.jsx'
import Card from '../../components/ui/Card.jsx'
import { IconCard } from '../../components/ui/Icon.jsx'
import { useAuth } from '../../lib/AuthContext.jsx'
import { supabase } from '../../lib/supabaseClient.js'

const ETIQUETA_ESTADO = { al_dia: 'Al día', vencido: 'Vencido' }

export default function Planes() {
  const { session } = useAuth()
  const [negocios, setNegocios] = useState(undefined) // undefined = cargando
  const [expandidoId, setExpandidoId] = useState(null)
  const [formPlan, setFormPlan] = useState('basico')
  const [formEstadoPago, setFormEstadoPago] = useState('al_dia')
  const [formNota, setFormNota] = useState('')
  const [historial, setHistorial] = useState(undefined) // undefined = cargando, [] = sin registros
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function cargarNegocios() {
    const { data, error: fetchError } = await supabase
      .from('negocios')
      .select('id, nombre, plan, estado_pago')
      .order('nombre', { ascending: true })
    setNegocios(fetchError ? [] : data)
  }

  useEffect(() => {
    cargarNegocios()
  }, [])

  async function cargarHistorial(negocioId) {
    setHistorial(undefined)
    const { data, error: fetchError } = await supabase
      .from('historial_facturacion')
      .select('id, plan, estado_pago, nota, creado_en')
      .eq('negocio_id', negocioId)
      .order('creado_en', { ascending: false })
      .limit(10)
    setHistorial(fetchError ? [] : data)
  }

  function abrirNegocio(negocio) {
    if (expandidoId === negocio.id) {
      setExpandidoId(null)
      return
    }
    setExpandidoId(negocio.id)
    setFormPlan(negocio.plan)
    setFormEstadoPago(negocio.estado_pago)
    setFormNota('')
    setError('')
    cargarHistorial(negocio.id)
  }

  async function guardarCambio(negocio) {
    setGuardando(true)
    setError('')

    const { error: updateError } = await supabase
      .from('negocios')
      .update({ plan: formPlan, estado_pago: formEstadoPago })
      .eq('id', negocio.id)

    if (updateError) {
      setGuardando(false)
      setError('No se pudo guardar el cambio')
      return
    }

    await supabase.from('historial_facturacion').insert({
      negocio_id: negocio.id,
      plan: formPlan,
      estado_pago: formEstadoPago,
      nota: formNota.trim() || null,
      admin_id: session?.user?.id ?? null,
    })

    setGuardando(false)
    setFormNota('')
    await cargarNegocios()
    await cargarHistorial(negocio.id)
  }

  return (
    <DashboardLayout role="admin">
      <Topbar
        title="Planes y facturación"
        subtitle="Plan y estado de pago por negocio"
        accountLabel="Calificame · Admin (JCG)"
      />
      <div style={{ padding: 24 }}>
        <Card title={negocios ? `Negocios (${negocios.length})` : 'Negocios'}>
          {negocios === undefined ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 34 }} />
              ))}
            </div>
          ) : negocios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <IconCard size={26} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
                Todavía no hay negocios cargados.
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={thStyle}>Negocio</th>
                  <th style={thStyle}>Plan</th>
                  <th style={thStyle}>Estado de pago</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {negocios.map((n) => (
                  <Fragment key={n.id}>
                    <tr style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={tdStyle}>{n.nombre}</td>
                      <td style={tdStyle}>
                        <span className="badge badge-neutral">{n.plan}</span>
                      </td>
                      <td style={tdStyle}>
                        <span className={`badge ${n.estado_pago === 'al_dia' ? 'badge-success' : 'badge-danger'}`}>
                          {ETIQUETA_ESTADO[n.estado_pago]}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <button onClick={() => abrirNegocio(n)} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13 }}>
                          {expandidoId === n.id ? 'Cerrar' : 'Cambiar'}
                        </button>
                      </td>
                    </tr>
                    {expandidoId === n.id && (
                      <tr>
                        <td colSpan={4} style={{ padding: '0 6px 18px' }}>
                          <div
                            style={{
                              background: 'var(--bg-surface-raised)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-md)',
                              padding: 18,
                              display: 'flex',
                              gap: 24,
                              flexWrap: 'wrap',
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Plan</span>
                                <select value={formPlan} onChange={(e) => setFormPlan(e.target.value)} className="field">
                                  <option value="basico">Básico</option>
                                  <option value="pro">Pro</option>
                                  <option value="premium">Premium</option>
                                </select>
                              </label>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Estado de pago</span>
                                <select
                                  value={formEstadoPago}
                                  onChange={(e) => setFormEstadoPago(e.target.value)}
                                  className="field"
                                >
                                  <option value="al_dia">Al día</option>
                                  <option value="vencido">Vencido</option>
                                </select>
                              </label>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Nota (opcional)</span>
                                <input
                                  className="field"
                                  maxLength={140}
                                  placeholder="Ej: pago recibido por transferencia"
                                  value={formNota}
                                  onChange={(e) => setFormNota(e.target.value)}
                                />
                              </label>
                              {error && (
                                <p role="alert" style={{ color: 'var(--danger)', fontSize: 13, margin: 0 }}>
                                  {error}
                                </p>
                              )}
                              <button
                                onClick={() => guardarCambio(n)}
                                disabled={guardando}
                                className="btn btn-primary"
                                style={{ alignSelf: 'flex-start' }}
                              >
                                {guardando ? 'Guardando...' : 'Guardar cambio'}
                              </button>
                            </div>

                            <div style={{ flex: 1, minWidth: 240 }}>
                              <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600 }}>
                                Historial
                              </h3>
                              {historial === undefined ? (
                                <div className="skeleton" style={{ height: 60 }} />
                              ) : historial.length === 0 ? (
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                  Todavía no hay cambios registrados para este negocio.
                                </p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  {historial.map((h) => (
                                    <div
                                      key={h.id}
                                      style={{
                                        fontSize: 13,
                                        borderBottom: '1px solid var(--border)',
                                        paddingBottom: 8,
                                      }}
                                    >
                                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                                          {new Date(h.creado_en).toLocaleDateString('es-PY', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                          })}
                                        </span>
                                        <span className="badge badge-neutral">{h.plan}</span>
                                        <span
                                          className={`badge ${h.estado_pago === 'al_dia' ? 'badge-success' : 'badge-danger'}`}
                                        >
                                          {ETIQUETA_ESTADO[h.estado_pago]}
                                        </span>
                                      </div>
                                      {h.nota && (
                                        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>{h.nota}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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
