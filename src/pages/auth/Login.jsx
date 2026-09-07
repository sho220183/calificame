import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: reemplazar por supabase.auth.signInWithPassword({ email, password })
    // y redirigir según el rol guardado en la tabla `usuarios`.
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-page)',
        color: 'var(--text-primary)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 320,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 28,
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>
          Calific<span style={{ color: 'var(--accent)' }}>ame</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          Ingresá a tu panel
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={fieldStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={fieldStyle}
          />
          <button
            type="submit"
            style={{
              marginTop: 6,
              background: 'var(--accent)',
              color: 'var(--accent-text-on-fill)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 0',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  )
}

const fieldStyle = {
  background: 'var(--bg-surface-raised)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  color: 'var(--text-primary)',
  fontSize: 14,
}
