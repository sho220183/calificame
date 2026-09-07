import Sidebar from './Sidebar.jsx'

export default function DashboardLayout({ role, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role={role} />
      <main style={{ flex: 1, background: 'var(--bg-page)' }}>{children}</main>
    </div>
  )
}
