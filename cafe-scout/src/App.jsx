import { useState, useEffect } from 'react'
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
  const [activeTab, setActiveTab] = useState('map')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  const { location, locationError } = useLocation()
  const { cafes, loading, error } = useCafes(location, filters)

  // ── NEW: Handle clicking a cafe in the chat ──
const handleChatCafeClick = (chatCafe) => {
  // Find the original cafe object by ID or Name
  const originalCafe = cafes.find(c => c.id === chatCafe.id || c.name === chatCafe.name);

  if (originalCafe) {
    setSelectedCafe(originalCafe); // Map will now recognize this object
    
    if (isMobile) {
      setActiveTab('map');
      setChatOpen(false);
    }
  } else {
    console.warn("Could not find matching cafe in the original list", chatCafe);
    // Fallback: use the chat cafe directly if match fails
    setSelectedCafe(chatCafe);
  }
};

  // ── Location error screen ──
  if (locationError) {
    return (
      <div style={S.errorScreen}>
        <div style={{ fontSize: 40 }}>📍</div>
        <h2 style={S.errorTitle}>Location needed</h2>
        <p style={S.errorDesc}>
          Cafe Scout needs your location to find nearby cafés.{'\n'}
          Tap the 🔒 icon in your browser → Site settings → Location → Allow
        </p>
        <button style={S.btnPrimary} onClick={() => window.location.reload()}>
          Allow & Retry
        </button>
      </div>
    )
  }

  // ── Waiting for location ──
  if (!location) {
    return (
      <div style={S.errorScreen}>
        <div style={{ fontSize: 40, animation: 'beanFloat 2s ease-in-out infinite' }}>☕</div>
        <h2 style={S.errorTitle}>Finding your location...</h2>
        <p style={S.errorDesc}>Please allow location access when your browser asks.</p>
        <style>{`@keyframes beanFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      </div>
    )
  }

  return (
    <div style={S.shell}>

      {/* ── Topbar ── */}
      <header style={S.topbar}>
        <div style={S.topbarLeft}>
          <div style={S.logoWrap}>
            <img
              src="/cafe_scout_logo_white_spaces-removebg-preview.png"
              alt="Cafe Scout Logo"
              style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ ...S.appName, fontSize: isMobile ? 18 : 22 }}>Cafe Scout</div>
            <div style={S.appSub}>
              {loading ? 'Scouting...' : cafes.length > 0
                ? `${cafes.length} spots discovered`
                : 'Find your next favourite spot'}
            </div>
          </div>
        </div>
        <BeanCharacter onClick={() => setChatOpen(!chatOpen)} chatOpen={chatOpen} />
      </header>

      {/* ── Filter bar ── */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* ── Mobile tab switcher ── */}
      {isMobile && (
        <div style={S.tabBar}>
          {[['map', '🗺 Map'], ['list', '☕ Cafés']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              ...S.tabBtn,
              background: activeTab === tab ? '#2C1810' : 'transparent',
              color: activeTab === tab ? '#FAF7F2' : '#A89070',
              borderColor: activeTab === tab ? '#2C1810' : '#EDE5D8',
            }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Main layout ── */}
      <div style={S.main}>

        {/* ── MOBILE ── */}
        {isMobile ? (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {activeTab === 'map' && (
              <div style={{ flex: 1, position: 'relative' }}>
                <MapView
                  cafes={cafes}
                  selectedCafe={selectedCafe}
                  onSelectCafe={(cafe) => { setSelectedCafe(cafe); setActiveTab('list') }}
                  userLocation={location}
                />
                {cafes.length > 0 && (
                  <div style={S.mapBadge}>{cafes.length} cafés nearby</div>
                )}
                {cafes.length > 0 && (
                  <button onClick={() => setActiveTab('list')} style={S.peekBtn}>
                    ☕ View {cafes.length} cafés →
                  </button>
                )}
              </div>
            )}

            {activeTab === 'list' && (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <CafeList
                  cafes={cafes} loading={loading} error={error}
                  selectedCafe={selectedCafe} onSelectCafe={setSelectedCafe}
                />
              </div>
            )}
          </div>

        ) : (
          /* ── DESKTOP ── */
          <>
            <div style={S.leftPanel}>
              <div style={{ position: 'relative', flexShrink: 0, height: '60%' }}>
                <MapView
                  cafes={cafes} selectedCafe={selectedCafe}
                  onSelectCafe={setSelectedCafe} userLocation={location}
                />
                {cafes.length > 0 && (
                  <div style={S.mapBadge}>{cafes.length} cafés nearby</div>
                )}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', background: '#FAF7F2' }}>
                <CafeList
                  cafes={cafes} loading={loading} error={error}
                  selectedCafe={selectedCafe} onSelectCafe={setSelectedCafe}
                />
              </div>
            </div>

            <div style={{ ...S.chatSidebar, width: chatOpen ? 300 : 0 }}>
              <ChatPanel 
                cafes={cafes} 
                selectedCafe={selectedCafe} 
                onCafeClick={handleChatCafeClick} // ADDED
                onClose={() => setChatOpen(false)} 
              />
            </div>
          </>
        )}
      </div>

      {/* ── Mobile chat bottom sheet ── */}
      {isMobile && chatOpen && (
        <>
          <div onClick={() => setChatOpen(false)} style={S.backdrop} />
          <div style={S.bottomSheet}>
            <div style={S.sheetHandle} />
            <ChatPanel 
                cafes={cafes} 
                selectedCafe={selectedCafe} 
                onCafeClick={handleChatCafeClick} // ADDED
                onClose={() => setChatOpen(false)} 
            />
          </div>
        </>
      )}

    </div>
  )
}

const S = {
  // ... Styles stay exactly the same as your provided code ...
  shell: {
    height: '100vh', display: 'flex', flexDirection: 'column',
    background: '#FAF7F2', overflow: 'hidden',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 16px',
    background: 'rgba(250,247,242,0.97)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #EDE5D8',
    flexShrink: 0, zIndex: 20,
    boxShadow: '0 1px 0 rgba(44,24,16,0.04)',
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  logoWrap: {
    width: 80, height: 50, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  appName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700, color: '#2C1810',
    lineHeight: 1.1, letterSpacing: '-0.4px',
  },
  appSub: { fontSize: 11, color: '#A89070', marginTop: 3, lineHeight: 1 },

  // Tab bar (mobile)
  tabBar: {
    display: 'flex', gap: 6, padding: '6px 16px',
    background: '#FAF7F2', borderBottom: '1px solid #EDE5D8',
    flexShrink: 0,
  },
  tabBtn: {
    flex: 1, padding: '7px 0', borderRadius: 99,
    border: '1px solid', fontSize: 12, fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.15s ease',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },

  main: { display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' },
  leftPanel: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },

  mapBadge: {
    position: 'absolute', bottom: 60, left: 12,
    background: 'rgba(44,24,16,0.85)', backdropFilter: 'blur(4px)',
    color: '#FAF7F2', fontSize: 11, fontWeight: 500,
    padding: '5px 12px', borderRadius: 99,
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    zIndex: 5, pointerEvents: 'none',
  },

  peekBtn: {
    position: 'absolute', bottom: 16, left: '50%',
    transform: 'translateX(-50%)',
    background: '#2C1810', color: '#FAF7F2',
    border: 'none', borderRadius: 99,
    padding: '11px 22px', fontSize: 13, fontWeight: 500,
    boxShadow: '0 4px 20px rgba(44,24,16,0.3)',
    cursor: 'pointer', whiteSpace: 'nowrap', zIndex: 10,
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },

  chatSidebar: {
    flexShrink: 0, borderLeft: '1px solid #EDE5D8',
    background: 'white', display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
  },

  // Mobile bottom sheet
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(44,24,16,0.3)',
    backdropFilter: 'blur(2px)', zIndex: 40,
  },
  bottomSheet: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    height: '75vh', background: 'white',
    borderRadius: '20px 20px 0 0',
    boxShadow: '0 -8px 40px rgba(44,24,16,0.15)',
    zIndex: 50, display: 'flex', flexDirection: 'column',
    animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 99,
    background: '#E0D5C8', margin: '10px auto 0', flexShrink: 0,
  },

  // Error screens
  errorScreen: {
    height: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: '#FAF7F2', gap: 14, padding: 32, textAlign: 'center',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  errorTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 22, color: '#2C1810',
  },
  errorDesc: {
    fontSize: 13, color: '#8B7355',
    maxWidth: 300, lineHeight: 1.7, whiteSpace: 'pre-line',
  },
  btnPrimary: {
    padding: '11px 28px', background: '#2C1810', color: '#FAF7F2',
    borderRadius: 99, fontSize: 13, fontWeight: 500,
    border: 'none', cursor: 'pointer',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    boxShadow: '0 4px 16px rgba(44,24,16,0.25)',
  },
}