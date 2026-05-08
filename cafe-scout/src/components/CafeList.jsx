import CafeCard from './CafeCard'

export default function CafeList({ cafes, loading, error, selectedCafe, onSelectCafe }) {
  if (loading) return (
    <div style={S.center}>
      <div style={S.spinner} />
      <p style={S.stateText}>Scouting nearby cafés...</p>
    </div>
  )

  if (error) return (
    <div style={S.center}>
      <span style={{ fontSize: 28 }}>⚠️</span>
      <p style={S.stateTitle}>Couldn't load cafés</p>
      <p style={S.stateText}>{error}</p>
    </div>
  )

  if (cafes.length === 0) return (
    <div style={S.center}>
      <span style={{ fontSize: 32 }}>☕</span>
      <p style={S.stateTitle}>No cafés found</p>
      <p style={S.stateText}>Try increasing the search radius</p>
    </div>
  )

  const ranked = cafes.map((c, i) => ({ ...c, rank: i + 1 }))

  return (
    <div>
      {/* Header */}
      <div style={S.header}>
        <span style={S.headerTitle}>Nearby Cafés</span>
        <span style={S.headerMeta}>{cafes.length} spots · by rating</span>
      </div>

      {/* Cards */}
      {ranked.map((cafe, i) => (
        <CafeCard
          key={cafe.id}
          cafe={cafe}
          isSelected={selectedCafe?.id === cafe.id}
          isScoutPick={i === 0}
          onClick={onSelectCafe}
          animDelay={i * 0.05}
        />
      ))}
      <div style={{ height: 16 }} />
    </div>
  )
}

const S = {
  center: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: 140, gap: 8, textAlign: 'center', padding: '0 24px',
  },
  spinner: {
    width: 22, height: 22,
    border: '2px solid #EDE5D8',
    borderTopColor: '#2C1810',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  stateTitle: {
    fontSize: 13, fontWeight: 500, color: '#2C1810',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  stateText: {
    fontSize: 12, color: '#A89070',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px',
    background: '#FAF7F2',
    borderBottom: '1px solid #F0E8DF',
    position: 'sticky', top: 0, zIndex: 10,
  },
  headerTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 13, fontWeight: 600, color: '#2C1810',
  },
  headerMeta: { fontSize: 11, color: '#A89070' },
}