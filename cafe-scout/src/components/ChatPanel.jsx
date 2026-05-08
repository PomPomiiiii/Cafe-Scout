import { useState, useRef, useEffect } from 'react'
import { askGemini } from '../services/geminiApi'

// 1. Move CafeCard outside the main component for cleaner code
const CafeCard = ({ cafe, onClick }) => (
  <div 
    style={{ ...S.cafeCard, cursor: 'pointer' }} 
    onClick={onClick}
  >
    <div style={S.cardContent}>
      <div style={S.cardTitle}>{cafe.name}</div>
      <div style={S.cardMeta}>
        <span style={{ color: '#EAB308' }}>★</span> {cafe.rating} 
        <span style={{ color: '#A89070', marginLeft: 4 }}>({cafe.reviews})</span>
        {cafe.isOpen !== undefined && (
           <span style={{ marginLeft: 8, color: cafe.isOpen ? '#1D9E75' : '#C41E3A' }}>
             {cafe.isOpen ? '● Open' : '○ Closed'}
           </span>
        )}
      </div>
      <div style={S.cardAddress}>{cafe.address}</div>
    </div>
  </div>
);

export default function ChatPanel({ cafes, onCafeClick, onClose }) {
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: "Hi! I'm Scout ☕ Tell me what kind of café you're looking for and I'll find the perfect match nearby!"
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hoveredChip, setHoveredChip] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text) {
    const msg = (text || input).trim();
    if (!msg || loading || cafes.length === 0) return;

    setMessages(p => [...p, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await askGemini(cafes, msg);
      setMessages(p => [...p, { 
        role: 'ai', 
        text: response.text, 
        cafes: response.cafes 
      }]);
    } catch {
      setMessages(p => [...p, { role: 'ai', text: "Sorry, I couldn't get a suggestion right now." }]);
    } finally {
      setLoading(false);
    }
  }

  const chips = ['Quiet to study 📚', 'Best rated ⭐', 'Outdoor seating 🌿', 'Good for groups 👥', 'Pet friendly 🐾']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 280, background: 'white' }}>

      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={S.dot} />
          <div>
            <div style={S.title}>Ask Scout</div>
            <div style={S.sub}>Your AI café companion</div>
          </div>
        </div>
        <button onClick={onClose} style={S.closeBtn}>✕</button>
      </div>

      {/* Messages Area */}
      <div style={S.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 6
          }}>
            <div style={{
              ...S.bubble,
              ...(msg.role === 'user' ? S.bubbleUser : S.bubbleAi),
              animation: 'fadeUp 0.25s ease',
            }}>
              {msg.text}
            </div>

            {/* Render Café Cards with the click handler */}
            {msg.role === 'ai' && msg.cafes && msg.cafes.length > 0 && (
              <div style={S.cardContainer}>
                {msg.cafes.map((cafe, idx) => (
                  <CafeCard 
                    key={idx} 
                    cafe={cafe} 
                    onClick={() => onCafeClick(cafe)} 
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ ...S.bubble, ...S.bubbleAi }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 0' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#A89070',
                    animation: `typingDot 1.2s ease ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Chips */}
        {messages.length === 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
            {chips.map(chip => (
              <button key={chip}
                onClick={() => send(chip)}
                onMouseEnter={() => setHoveredChip(chip)}
                onMouseLeave={() => setHoveredChip(null)}
                style={{
                  fontSize: 11, padding: '5px 10px', borderRadius: 99,
                  border: `1px solid ${hoveredChip === chip ? '#2C1810' : '#E0D5C8'}`,
                  background: hoveredChip === chip ? '#F0E6D3' : 'white',
                  color: hoveredChip === chip ? '#2C1810' : '#8B7355',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}>
                {chip}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Row */}
      <div style={S.inputRow}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder={cafes.length === 0 ? 'Waiting for location...' : 'Ask about nearby cafés...'}
          disabled={cafes.length === 0 || loading}
          style={S.input}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading || cafes.length === 0}
          style={{
            ...S.sendBtn,
            opacity: !input.trim() || loading || cafes.length === 0 ? 0.4 : 1,
          }}
        >↑</button>
      </div>

      <style>{`
        @keyframes typingDot {
          0%,60%,100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const S = {
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', borderBottom: '1px solid #F0E8DF', flexShrink: 0,
  },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#1D9E75' },
  title: { fontSize: 13, fontWeight: 500, color: '#2C1810', fontFamily: "'DM Sans', sans-serif" },
  sub: { fontSize: 11, color: '#A89070', marginTop: 1 },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#A89070' },
  messages: { flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 14 },
  bubble: { maxWidth: '86%', fontSize: 12, lineHeight: 1.65, padding: '9px 13px', borderRadius: 16 },
  bubbleUser: { background: '#F0E6D3', color: '#2C1810', borderBottomRightRadius: 4 },
  bubbleAi: { background: '#F7F3EF', color: '#3D2418', borderBottomLeftRadius: 4, border: '1px solid #EDE5D8' },
  inputRow: { padding: '10px 12px', borderTop: '1px solid #F0E8DF', display: 'flex', gap: 8 },
  input: { flex: 1, fontSize: 12, padding: '8px 14px', borderRadius: 99, border: '1px solid #E0D5C8' },
  sendBtn: { width: 32, height: 32, borderRadius: '50%', background: '#2C1810', color: 'white', border: 'none' },
  cardContainer: { display: 'flex', flexDirection: 'column', gap: 8, width: '95%', paddingLeft: 4 },
  cafeCard: { background: 'white', borderRadius: 12, border: '1px solid #EDE5D8', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardTitle: { fontSize: 13, fontWeight: 600, color: '#2C1810' },
  cardMeta: { fontSize: 11, margin: '4px 0', display: 'flex', alignItems: 'center' },
  cardAddress: { fontSize: 11, color: '#A89070', lineHeight: 1.3 },
}