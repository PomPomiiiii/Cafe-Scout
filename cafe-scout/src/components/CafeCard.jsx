import { useState } from 'react'

function Stars({ rating }) {
  if (!rating) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 11, color: i <= Math.round(rating) ? '#D97706' : '#E0D5C8' }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: '#A89070', marginLeft: 4 }}>
        {rating} · {/* rating text handled by parent */}
      </span>
    </div>
  )
}

export default function CafeCard({ cafe, isSelected, isScoutPick, onClick, animDelay }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => onClick(cafe)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: 12,
        padding: '12px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #F0E8DF',
        background: isSelected ? '#F0E6D3' : hovered ? '#F7F1EA' : '#FAF7F2',
        transform: hovered && !isSelected ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered && !isSelected ? '0 4px 16px rgba(44,24,16,0.07)' : 'none',
        transition: 'all 0.18s ease',
        animation: `fadeUp 0.35s ease ${animDelay}s both`,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        flexShrink: 0, width: 66, height: 66,
        borderRadius: 12, overflow: 'hidden',
        background: '#EDE5D8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26,
        boxShadow: isSelected ? '0 0 0 2px #2C1810' : 'none',
        transition: 'box-shadow 0.15s ease',
      }}>
        {cafe.photo
          ? <img src={cafe.photo} alt={cafe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          : '☕'
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{
            flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
            background: isScoutPick ? '#2C1810' : '#EDE5D8',
            color: isScoutPick ? '#FAF7F2' : '#8B7355',
            fontSize: 10, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {cafe.rank}
          </div>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 13, fontWeight: 600, color: '#2C1810',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}>
            {cafe.name}
          </span>
        </div>

        {/* Stars + rating */}
        {cafe.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 3 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize: 11, color: i <= Math.round(cafe.rating) ? '#D97706' : '#E0D5C8' }}>★</span>
            ))}
            <span style={{ fontSize: 11, color: '#A89070', marginLeft: 4 }}>
              {cafe.rating} · {cafe.totalRatings} reviews
            </span>
          </div>
        )}

        {/* Address */}
        <div style={{
          fontSize: 11, color: '#B8A090',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          lineHeight: 1.4,
        }}>
          {cafe.address}
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
        {isScoutPick && (
          <span style={{
            fontSize: 10, fontWeight: 600,
            background: '#2C1810', color: '#FAF7F2',
            padding: '2px 8px', borderRadius: 99, whiteSpace: 'nowrap',
          }}>
            Scout pick
          </span>
        )}
        {cafe.isOpen !== null && (
          <span style={{
            fontSize: 10, fontWeight: 500,
            background: cafe.isOpen ? '#E1F5EE' : '#FEE2E2',
            color: cafe.isOpen ? '#1D9E75' : '#E8554E',
            padding: '2px 8px', borderRadius: 99, whiteSpace: 'nowrap',
          }}>
            {cafe.isOpen ? '● Open' : '● Closed'}
          </span>
        )}
      </div>
    </div>
  )
}