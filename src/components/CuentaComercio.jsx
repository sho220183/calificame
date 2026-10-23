import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../lib/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { estadoDeCuenta } from '../lib/estadoCuenta.js'
import Card from './ui/Card.jsx'
import { IconAlert, IconCard } from './ui/Icon.jsx'

// Estado de pago del negocio del comercio logueado. Lo carga una sola vez el
// DashboardLayout y lo consumen el aviso de arriba y las páginas con datos.
const CuentaContext = createContext({ estado: 'al_dia', bloqueoEl: null })

export function CuentaComercioProvider({ children }) {
  const { negocioId } = useAuth()
  const [cuenta, setCuenta] = useState({ estado: 'al_dia', bloqueoEl: null })

  useEffect(() => {
    if (!negocioId) return
    supabase
      .from('negocios')
      .select('estado_pago, bloqueo_el')
      .eq('id', negocioId)
      .single()
      .then(({ data, error }) => {
        if (!error) setCuenta(estadoDeCuenta(data))
      })
  }, [negocioId])

  return <CuentaContext.Provider value={cuenta}>{children}</CuentaContext.Provider>
}

function formatearFecha(fecha) {
  return fecha.toLocaleDateString('es-PY', { day: '2-digit', month: 'long' })
}

export function AvisoDePago() {
  const { estado, bloqueoEl } = useContext(CuentaContext)
  if (estado === 'al_dia') return null

  const bloqueado = estado === 'bloqueado'
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        padding: '12px 28px',
        background: bloqueado ? 'var(--danger-soft)' : 'var(--warning-soft)',
        color: bloqueado ? 'var(--danger)' : 'var(--warning)',
        fontSize: 13.5,
      }}
    >
      <IconAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
      <span>
        {bloqueado
          ? 'Tu panel está bloqueado por falta de pago. Tu QR sigue funcionando y las respuestas se siguen guardando: vas a verlas apenas regularices.'
          : `Tu pago está vencido. Regularizalo antes del ${formatearFecha(bloqueoEl)} para seguir viendo tu feedback y estadísticas. Tu QR sigue funcionando normalmente.`}
      </span>
    </div>
  )
}

// Envuelve el contenido con datos (feedback, estadísticas). Si la cuenta está
// bloqueada muestra el aviso en su lugar — las consultas igual vuelven vacías
// por RLS, y sin esto el comercio vería un "todavía no recibiste feedback" engañoso.
export function RequiereCuentaAlDia({ children }) {
  const { estado } = useContext(CuentaContext)
  if (estado !== 'bloqueado') return children

  return (
    <Card>
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <IconCard size={26} style={{ color: 'var(--danger)', marginBottom: 10 }} />
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>Contenido bloqueado por falta de pago</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
          Tus respuestas no se perdieron: se siguen guardando y vas a poder verlas apenas se
          registre tu pago. Contactá a JCG Infotech para regularizar.
        </p>
      </div>
    </Card>
  )
}
