export default function Card({ title, action, children, style }) {
  return (
    <section
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 20,
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          {title && <h3 style={{ fontSize: 15 }}>{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
