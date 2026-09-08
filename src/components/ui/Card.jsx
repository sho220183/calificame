export default function Card({ title, action, children, style, interactive = false }) {
  return (
    <section className={`card${interactive ? ' card-interactive' : ''}`} style={style}>
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
