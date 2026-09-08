import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'

export default function RequireAdmin({ children }) {
  const { session, rol, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ padding: 40, color: 'var(--text-secondary)' }}>Cargando...</div>
    )
  }

  if (!session || rol !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}
