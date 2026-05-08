import { useState } from 'react'
import MapView from './components/MapView'
import CafeList from './components/CafeList'
import ChatPanel from './components/ChatPanel'
import FilterBar from './components/FilterBar'
import BeanCharacter from './components/BeanCharacter'
import useLocation from './hooks/useLocation'
import useCafes from './hooks/useCafes'

export default function App() {
  const [selectedCafe, setSelectedCafe] = useState(null)
  const [filters, setFilters] = useState({ openNow: false, minRating: 0, radius: 1500 })
  const [chatOpen, setChatOpen] = useState(false)

  const { location, locationError } = useLocation()
  const { cafes, loading, error } = useCafes(location, filters)

  if (locationError) {
    return (
      <div style={S.errorScreen}>
        <div style={S.errorIcon}>📍</div>
        <h2 style={S.errorTitle}>Location needed</h2>
        <p style={S.errorDesc}>Cafe Scout needs your location to find nearby cafés. Please allow access and refresh.</p>
        <button style={S.btnPrimary} onClick={() => window.location.reload()}>Try again</button>
      </div>
    )
  }

  return (
    <div style={S.shell}>

      {/* ── Topbar ── */}
      <header style={S.topbar}>
        <div style={S.topbarLeft}>
          <div style={S.logo}>
  <img 
    src="/cafe_scout_logo_white_spaces-removebg-preview.png" 
    alt="Cafe Scout Logo" 
    style={{ 
      height: '100%',     // Scales to the 50px parent
      width: 'auto',       // Maintains original aspect ratio
      objectFit: 'contain'
    }} 
  />
</div>
          <div>
            <div style={S.appName}>Cafe Scout</div>
            <div style={S.appSub}>
              {loading ? 'Scouting nearby...' : cafes.length > 0
                ? `${cafes.length} spots discovered`
                : 'Find your next favourite spot'}
            </div>
          </div>
        </div>

        <div style={S.topbarRight}>
          {/* Animated bean — click opens chat */}
          <BeanCharacter onClick={() => setChatOpen(!chatOpen)} chatOpen={chatOpen} />
        </div>
      </header>

      {/* ── Filter bar ── */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* ── Main layout ── */}
      <div style={S.main}>

        {/* Left: Map + List */}
        <div style={S.leftPanel}>
          {/* Map */}
          <div style={S.mapPanel}>
            <MapView
              cafes={cafes}
              selectedCafe={selectedCafe}
              onSelectCafe={setSelectedCafe}
              userLocation={location}
            />
            {cafes.length > 0 && (
              <div style={S.mapBadge}>{cafes.length} cafés nearby</div>
            )}
          </div>

          {/* List */}
          <div style={S.listPanel}>
            <CafeList
              cafes={cafes}
              loading={loading}
              error={error}
              selectedCafe={selectedCafe}
              onSelectCafe={setSelectedCafe}
            />
          </div>
        </div>

        {/* Right: Chat */}
        <div style={{ ...S.chatSidebar, width: chatOpen ? 300 : 0 }}>
          <ChatPanel cafes={cafes} selectedCafe={selectedCafe} onClose={() => setChatOpen(false)} />
        </div>

      </div>
    </div>
  )
}

const S = {
  shell: {
    height: '100vh', display: 'flex', flexDirection: 'column',
    background: '#FAF7F2', overflow: 'hidden',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 20px',
    background: 'rgba(250,247,242,0.97)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #EDE5D8',
    flexShrink: 0, zIndex: 20,
    boxShadow: '0 1px 0 rgba(44,24,16,0.04)',
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 8 },
  logo: {
    width: 100,          // Increased from 40 for a larger presence
    height: 60, // Increased from 40
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    flexShrink: 0,
  },
  appName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 24,       // Increased from 17 to match the larger logo
    fontWeight: 700,    // Bolder for better hierarchy
    color: '#2C1810',
    lineHeight: 1.1, 
    letterSpacing: '-0.5px',
  },
  appSub: { 
    fontSize: 13,       // Increased from 11 for better readability
    color: '#A89070', 
    marginTop: 4, 
    lineHeight: 1 
  },
  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  leftPanel: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
  mapPanel: { position: 'relative', flexShrink: 0, height: '60%' },
  mapBadge: {
    position: 'absolute', bottom: 12, left: 12,
    background: 'rgba(44,24,16,0.85)', backdropFilter: 'blur(4px)',
    color: '#FAF7F2', fontSize: 11, fontWeight: 500,
    padding: '5px 12px', borderRadius: 99,
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    zIndex: 5, pointerEvents: 'none',
  },
  listPanel: { flex: 1, overflowY: 'auto', background: '#FAF7F2' },
  chatSidebar: {
    flexShrink: 0,
    borderLeft: '1px solid #EDE5D8',
    background: 'white',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
  },
  errorScreen: {
    height: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: '#FAF7F2', gap: 16, padding: 24, textAlign: 'center',
  },
  errorIcon: { fontSize: 36 },
  errorTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 22, color: '#2C1810',
  },
  errorDesc: { fontSize: 13, color: '#8B7355', maxWidth: 300, lineHeight: 1.6 },
  btnPrimary: {
    padding: '10px 24px', background: '#2C1810', color: '#FAF7F2',
    borderRadius: 99, fontSize: 13, fontWeight: 500,
    border: 'none', cursor: 'pointer',
  },
}