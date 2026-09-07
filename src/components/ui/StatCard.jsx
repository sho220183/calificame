export default function StatCard({ label, value, trend }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
      }}
    >
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30,
          fontWeight: 600,
          marginTop: 6,
          color: 'var(--text-primary)',
        }}
      >
        {value}
      </div>
      {trend && (
        <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>{trend}</div>
      )}
    </div>
  )
}
