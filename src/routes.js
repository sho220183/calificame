import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Negocios from './pages/admin/Negocios.jsx'
import Planes from './pages/admin/Planes.jsx'
import ComercioDashboard from './pages/comercio/ComercioDashboard.jsx'
import MiQR from './pages/comercio/MiQR.jsx'
import Feedback from './pages/comercio/Feedback.jsx'

// Única fuente de verdad para las rutas de cada panel. Tanto el Sidebar
// (los links que se ven) como App.jsx (las rutas que realmente existen) se
// arman a partir de esta lista — así es imposible que un link del menú
// apunte a una página que no está registrada (el bug de "Planes y
// facturación" que mandaba al login).
export const adminRoutes = [
  { path: '/admin', label: 'Resumen', end: true, element: AdminDashboard },
  { path: '/admin/negocios', label: 'Negocios', element: Negocios },
  { path: '/admin/planes', label: 'Planes y facturación', element: Planes },
]

export const comercioRoutes = [
  { path: '/comercio', label: 'Resumen', end: true, element: ComercioDashboard },
  { path: '/comercio/mi-qr', label: 'Mi QR', element: MiQR },
  { path: '/comercio/feedback', label: 'Feedback privado', element: Feedback },
]
