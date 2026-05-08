import { useState, useEffect } from 'react'

// Animated coffee bean character
// - idle: gentle float
// - hover: wiggles excitedly
// - active (chat open): bounces and shows speech bubble
export default function BeanCharacter({ onClick, chatOpen }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  function handleClick() {
    setClicked(true)
    setTimeout(() => setClicked(false), 600)
    onClick()
  }

  return (
    <div style={S.wrap} onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Speech bubble */}
      {(chatOpen || hovered) && (
        <div style={{
          ...S.bubble,
          opacity: chatOpen || hovered ? 1 : 0,
          transform: chatOpen || hovered ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.95)',
        }}>
          {chatOpen ? 'Ask me anything!' : 'Need a café? ☕'}
          <div style={S.bubbleTail} />
        </div>
      )}

      {/* Bean SVG */}
      <div style={{
        ...S.beanWrap,
        animation: clicked
          ? 'beanSquish 0.5s ease'
          : chatOpen
            ? 'beanBounce 0.7s ease infinite'
            : hovered
              ? 'beanWiggle 0.4s ease infinite'
              : 'beanFloat 3s ease-in-out infinite',
        filter: chatOpen
          ? 'drop-shadow(0 4px 12px rgba(44,24,16,0.3))'
          : hovered
            ? 'drop-shadow(0 4px 8px rgba(44,24,16,0.2))'
            : 'drop-shadow(0 2px 4px rgba(44,24,16,0.15))',
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
      }}>
        <BeanSVG chatOpen={chatOpen} hovered={hovered} />
      </div>

      {/* "AI" label */}
      <div style={{
        ...S.label,
        background: chatOpen ? '#2C1810' : '#F0E6D3',
        color: chatOpen ? '#FAF7F2' : '#8B5E3C',
      }}>
        {chatOpen ? '✕ close' : 'Ask Scout'}
      </div>

      <style>{`
        @keyframes beanFloat {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-5px) rotate(2deg); }
        }
        @keyframes beanWiggle {
          0%,100% { transform: rotate(-8deg) scale(1.12); }
          25%      { transform: rotate(8deg) scale(1.12); }
          50%      { transform: rotate(-5deg) scale(1.15); }
          75%      { transform: rotate(5deg) scale(1.12); }
        }
        @keyframes beanBounce {
          0%,100% { transform: translateY(0) scale(1); }
          40%      { transform: translateY(-6px) scale(1.05); }
          60%      { transform: translateY(-3px) scale(1.02); }
        }
        @keyframes beanSquish {
          0%   { transform: scale(1); }
          20%  { transform: scale(1.2, 0.8); }
          50%  { transform: scale(0.9, 1.15); }
          70%  { transform: scale(1.05, 0.95); }
          100% { transform: scale(1); }
        }
        @keyframes bubblePop {
          from { opacity:0; transform: translateY(4px) scale(0.9); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

function BeanSVG({ chatOpen, hovered }) {
  const bodyColor = chatOpen ? '#3D2418' : hovered ? '#4A2E1A' : '#6B3D24'
  const shineColor = 'rgba(255,255,255,0.25)'

  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bean body */}
      <ellipse cx="22" cy="24" rx="13" ry="16" fill={bodyColor} />
      {/* Bean crease line */}
      <path d="M22 10 Q15 18 22 26 Q29 34 22 38" stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Shine */}
      <ellipse cx="17" cy="17" rx="4" ry="5" fill={shineColor} transform="rotate(-20 17 17)" />
      {/* Eyes */}
      {chatOpen ? (
        // Happy closed eyes when chat open
        <>
          <path d="M16 22 Q17 20 18 22" stroke="#FAF7F2" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M26 22 Q27 20 28 22" stroke="#FAF7F2" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        </>
      ) : hovered ? (
        // Big excited eyes when hovered
        <>
          <circle cx="17" cy="22" r="2.5" fill="#FAF7F2" />
          <circle cx="27" cy="22" r="2.5" fill="#FAF7F2" />
          <circle cx="17.8" cy="21.2" r="0.9" fill={bodyColor} />
          <circle cx="27.8" cy="21.2" r="0.9" fill={bodyColor} />
        </>
      ) : (
        // Normal eyes
        <>
          <circle cx="17" cy="22" r="2" fill="#FAF7F2" />
          <circle cx="27" cy="22" r="2" fill="#FAF7F2" />
          <circle cx="17.6" cy="21.4" r="0.8" fill={bodyColor} />
          <circle cx="27.6" cy="21.4" r="0.8" fill={bodyColor} />
        </>
      )}
      {/* Mouth */}
      {chatOpen ? (
        <path d="M17 28 Q22 32 27 28" stroke="#FAF7F2" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      ) : hovered ? (
        <path d="M17 27 Q22 31.5 27 27" stroke="#FAF7F2" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      ) : (
        <path d="M18 27 Q22 30 26 27" stroke="#FAF7F2" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      )}
      {/* Steam when chat open */}
      {chatOpen && (
        <>
          <path d="M16 8 Q14 5 16 2" stroke="#C4956A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M22 6 Q20 3 22 0" stroke="#C4956A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M28 8 Q26 5 28 2" stroke="#C4956A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
        </>
      )}
    </svg>
  )
}

const S = {
  wrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    cursor: 'pointer', position: 'relative', padding: '4px 8px',
    userSelect: 'none',
  },
  beanWrap: {
    transition: 'transform 0.2s ease, filter 0.2s ease',
  },
  label: {
    fontSize: 10, fontWeight: 500,
    padding: '2px 8px', borderRadius: 99,
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
  bubble: {
    position: 'absolute',
    top: '25%',              // Center vertically relative to the bean
    right: '90%',           // Place it to the left of the bean
    transform: 'translateY(-50%)', // Perfect vertical centering
    background: '#2C1810',
    color: '#FAF7F2',
    fontSize: 11,
    fontWeight: 500,
    padding: '6px 12px',
    borderRadius: 10,
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 16px rgba(44,24,16,0.2)',
    transition: 'all 0.2s ease',
    zIndex: 50,
  },
  bubbleTail: {
  position: 'absolute',
  top: '50%',              // Centers tail vertically on the bubble side
  right: -6,               // Moves tail to the right edge of the bubble
  width: 12,
  height: 8,
  background: '#2C1810',
  // Rotates triangle to point right toward the BeanCharacter
  clipPath: 'polygon(0 0, 0 100%, 100% 50%)', 
  transform: 'translateY(-50%)',
},
}