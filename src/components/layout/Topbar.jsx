export default function Topbar({ title, subtitle, accountLabel }) {
  const iniciales = accountLabel
    ? accountLabel
        .split(/[\s·]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : ''

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '22px 28px 18px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(15, 34, 55, 0.4)',
        backdropFilter: 'blur(6px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <h1 style={{ fontSize: 21 }}>{title}</h1>
        {subtitle && (
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {accountLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{accountLabel}</span>
          <div
            aria-hidden="true"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--accent-soft-strong)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              border: '1px solid var(--border-strong)',
            }}
          >
            {iniciales}
          </div>
        </div>
      )}
    </header>
  )
}
