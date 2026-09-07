export default function Topbar({ title, subtitle, accountLabel }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '22px 28px 18px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div>
        <h1 style={{ fontSize: 20 }}>{title}</h1>
        {subtitle && (
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {accountLabel && (
        <div
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
          }}
        >
          {accountLabel}
        </div>
      )}
    </header>
  )
}
