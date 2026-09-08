export default function StatCard({ label, value, trend, trendTone = 'success', icon }) {
  const Icon = icon
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
        {Icon && (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={15} />
          </div>
        )}
      </div>
      <div
        className="tabular-nums"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30,
          fontWeight: 600,
          marginTop: 6,
          color: 'var(--text-primary)',
          position: 'relative',
        }}
      >
        {value}
      </div>
      {trend && (
        <div
          className={`badge badge-${trendTone}`}
          style={{ marginTop: 8, position: 'relative' }}
        >
          {trend}
        </div>
      )}
    </div>
  )
}
