import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import Login from './pages/auth/Login.jsx'
import Redirect from './pages/public/Redirect.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Negocios from './pages/admin/Negocios.jsx'
import ComercioDashboard from './pages/comercio/ComercioDashboard.jsx'
import MiQR from './pages/comercio/MiQR.jsx'
import Feedback from './pages/comercio/Feedback.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Ruta pública: la que efectivamente lleva el QR impreso */}
        <Route path="/r/:codigo" element={<Redirect />} />

        <Route path="/login" element={<Login />} />

        {/* Panel admin (JCG) — conectado a Supabase real */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/negocios"
          element={
            <RequireAdmin>
              <Negocios />
            </RequireAdmin>
          }
        />

        {/* Panel comercio — todavía con datos de ejemplo, se conecta en la siguiente fase */}
        <Route path="/comercio" element={<ComercioDashboard />} />
        <Route path="/comercio/mi-qr" element={<MiQR />} />
        <Route path="/comercio/feedback" element={<Feedback />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
