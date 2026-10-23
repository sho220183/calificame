import { Fragment } from 'react'
import Sidebar from './Sidebar.jsx'
import { CuentaComercioProvider, AvisoDePago } from '../CuentaComercio.jsx'

export default function DashboardLayout({ role, children }) {
  // Solo el panel comercio depende del estado de pago (aviso + bloqueo).
  const Cuenta = role === 'comercio' ? CuentaComercioProvider : Fragment

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role={role} />
      <Cuenta>
        <main style={{ flex: 1, background: 'var(--bg-page)' }}>
          {role === 'comercio' && <AvisoDePago />}
          {children}
        </main>
      </Cuenta>
    </div>
  )
}
