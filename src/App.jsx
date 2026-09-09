import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Login from './pages/auth/Login.jsx'
import Redirect from './pages/public/Redirect.jsx'
import { adminRoutes, comercioRoutes } from './routes.js'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Ruta pública: la que efectivamente lleva el QR impreso */}
        <Route path="/r/:codigo" element={<Redirect />} />

        <Route path="/login" element={<Login />} />

        {/* Panel admin (JCG) — conectado a Supabase real */}
        {adminRoutes.map(({ path, element: Element }) => (
          <Route
            key={path}
            path={path}
            element={
              <RequireAdmin>
                <Element />
              </RequireAdmin>
            }
          />
        ))}

        {/* Panel comercio — conectado a Supabase real */}
        {comercioRoutes.map(({ path, element: Element }) => (
          <Route
            key={path}
            path={path}
            element={
              <RequireAuth>
                <Element />
              </RequireAuth>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
