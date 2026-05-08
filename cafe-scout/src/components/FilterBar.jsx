import { useState } from 'react'

export default function FilterBar({ filters, onChange }) {
  const [hovered, setHovered] = useState(null)

  function toggle(key) { onChange({ ...filters, [key]: !filters[key] }) }
  function setRating(r) { onChange({ ...filters, minRating: filters.minRating === r ? 0 : r }) }
  function setRadius(r) { onChange({ ...filters, radius: r }) }

  function pill(id, active, label, onClick) {
    const isHov = hovered === id
    return (
      <button
        key={id}
        onClick={onClick}
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered(null)}
        style={{
          flexShrink: 0,
          fontSize: 12, fontWeight: 500,
          padding: '5px 14px', borderRadius: 99,
          border: `1px solid ${active ? '#2C1810' : isHov ? '#8B7355' : '#E0D5C8'}`,
          background: active ? '#2C1810' : isHov ? '#F5EDE0' : 'white',
          color: active ? '#FAF7F2' : isHov ? '#2C1810' : '#8B7355',
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'all 0.15s ease',
          boxShadow: active ? '0 2px 8px rgba(44,24,16,0.2)' : 'none',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '8px 20px',
      background: '#FAF7F2',
      borderBottom: '1px solid #EDE5D8',
      overflowX: 'auto', flexShrink: 0,
    }}>
      <span style={{ fontSize: 10, color: '#C4B09A', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
        Filter
      </span>

      {pill('open', filters.openNow, '⏰ Open now', () => toggle('openNow'))}
      {pill('r4', filters.minRating === 4, '★ 4.0+', () => setRating(4))}
      {pill('r45', filters.minRating === 4.5, '★ 4.5+', () => setRating(4.5))}

      <div style={{ width: 1, height: 16, background: '#E0D5C8', flexShrink: 0 }} />

      {[500, 1500, 5000, 10000, 15000, 20000].map(r =>
        pill(
          `r${r}`, 
          filters.radius === r, 
          r < 1000 ? `${r}m` : `${r/1000}km`, 
          () => setRadius(r)
        )
      )}
    </div>
  )
}