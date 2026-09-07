import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login.jsx'
import Redirect from './pages/public/Redirect.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Negocios from './pages/admin/Negocios.jsx'
import ComercioDashboard from './pages/comercio/ComercioDashboard.jsx'
import MiQR from './pages/comercio/MiQR.jsx'
import Feedback from './pages/comercio/Feedback.jsx'

export default function App() {
  return (
    <Routes>
      {/* Ruta pública: la que efectivamente lleva el QR impreso */}
      <Route path="/r/:codigo" element={<Redirect />} />

      <Route path="/login" element={<Login />} />

      {/* Panel admin (JCG) */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/negocios" element={<Negocios />} />

      {/* Panel comercio */}
      <Route path="/comercio" element={<ComercioDashboard />} />
      <Route path="/comercio/mi-qr" element={<MiQR />} />
      <Route path="/comercio/feedback" element={<Feedback />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
