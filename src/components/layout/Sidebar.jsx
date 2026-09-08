import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'
import { adminRoutes, comercioRoutes } from '../../routes.js'
import { LogoMark, IconGrid, IconStore, IconCard, IconQr, IconMessage, IconLogout } from '../ui/Icon.jsx'

const ICONS = {
  '/admin': IconGrid,
  '/admin/negocios': IconStore,
  '/admin/planes': IconCard,
  '/comercio': IconGrid,
  '/comercio/mi-qr': IconQr,
  '/comercio/feedback': IconMessage,
}

export default function Sidebar({ role }) {
  const links = (role === 'admin' ? adminRoutes : comercioRoutes).map((r) => ({
    to: r.path,
    label: r.label,
    end: r.end,
    Icon: ICONS[r.path] ?? IconGrid,
  }))
  const navigate = useNavigate()

  async function salir() {
    if (role === 'admin') {
      await supabase.auth.signOut()
    }
    navigate('/login')
  }

  return (
    <aside
      style={{
        width: 232,
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 24px' }}>
        <LogoMark />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
            Calific<span style={{ color: 'var(--accent)' }}>ame</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
            {role === 'admin' ? 'Panel admin' : 'Panel comercio'}
          </div>
        </div>
      </div>

      <nav aria-label="Navegación principal" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map(({ to, label, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            <Icon size={17} className="nav-icon" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={salir}
        className="btn btn-ghost"
        style={{ marginTop: 'auto', justifyContent: 'flex-start', fontWeight: 500 }}
      >
        <IconLogout size={16} />
        Salir
      </button>
    </aside>
  )
}
