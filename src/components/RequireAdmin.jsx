import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'

export default function RequireAdmin({ children }) {
  const { session, rol, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-page)',
        }}
      >
        <div className="skeleton" style={{ width: 160, height: 14, borderRadius: 'var(--radius-sm)' }} />
      </div>
    )
  }

  if (!session || rol !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}
