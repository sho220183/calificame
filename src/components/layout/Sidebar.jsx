import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'
import { adminRoutes, comercioRoutes } from '../../routes.js'

export default function Sidebar({ role }) {
  const links = (role === 'admin' ? adminRoutes : comercioRoutes).map((r) => ({
    to: r.path,
    label: r.label,
    end: r.end,
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
        width: 220,
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
      }}
    >
      <div style={{ padding: '4px 10px 24px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
          Calific<span style={{ color: 'var(--accent)' }}>ame</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {role === 'admin' ? 'Panel admin' : 'Panel comercio'}
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            style={({ isActive }) => ({
              padding: '9px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              textDecoration: 'none',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-surface-raised)' : 'transparent',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={salir}
        style={{
          marginTop: 'auto',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-secondary)',
          fontSize: 13,
          padding: '8px 10px',
          cursor: 'pointer',
        }}
      >
        Salir
      </button>
    </aside>
  )
}
