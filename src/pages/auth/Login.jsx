import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabaseClient.js'
import { LogoMark, IconShield, IconTrendUp, IconQr } from '../../components/ui/Icon.jsx'

const PROPUESTAS = [
  { Icon: IconQr, texto: 'Un QR en el mostrador conecta cada visita con una encuesta de satisfacción en segundos.' },
  { Icon: IconTrendUp, texto: 'Las buenas calificaciones van directo a Google, así crecen tus reseñas públicas.' },
  { Icon: IconShield, texto: 'Las críticas quedan en privado, para que las resuelvas antes de que se publiquen.' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!supabaseConfigured) {
      setError('Faltan las variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en el .env')
      return
    }

    setLoading(true)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setLoading(false)
      setError('Email o contraseña incorrectos')
      return
    }

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', signInData.user.id)
      .single()

    setLoading(false)
    navigate(usuario?.rol === 'admin' ? '/admin' : '/comercio')
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', color: 'var(--text-primary)' }}>
      <section
        style={{
          flex: 1,
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          background:
            'radial-gradient(720px circle at 20% 15%, rgba(34, 195, 214, 0.16), transparent 60%), var(--bg-surface-sunken)',
          borderRight: '1px solid var(--border)',
        }}
        className="login-brand-panel"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark size={30} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600 }}>
            Calific<span style={{ color: 'var(--accent)' }}>ame</span>
          </span>
        </div>

        <div style={{ maxWidth: 380 }}>
          <h2 style={{ fontSize: 28, lineHeight: 1.25, marginBottom: 28 }}>
            El QR de tu mostrador, convertido en reseñas.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {PROPUESTAS.map(({ Icon, texto }) => (
              <div key={texto} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} />
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, maxWidth: 280 }}>
                  {texto}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          Un producto de JCG Infotech · calificame.com.py
        </p>
      </section>

      <section
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-page)',
          padding: 24,
        }}
      >
        <form onSubmit={handleSubmit} className="card fade-in-up" style={{ width: 340, padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }} className="login-mark-mobile">
            <LogoMark size={22} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 }}>
              Calific<span style={{ color: 'var(--accent)' }}>ame</span>
            </span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 22, marginTop: 10 }}>
            Ingresá a tu panel
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Email</span>
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                required
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Contraseña</span>
              <input
                type="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
                required
              />
            </label>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: 8 }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            {error && (
              <p role="alert" style={{ color: 'var(--danger)', fontSize: 13, marginTop: 2 }}>
                {error}
              </p>
            )}
          </div>
        </form>
      </section>

      <style>{`
        @media (min-width: 860px) {
          .login-brand-panel { display: flex !important; }
          .login-mark-mobile { display: none; }
        }
      `}</style>
    </div>
  )
}
