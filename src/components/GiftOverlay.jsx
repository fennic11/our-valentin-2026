import { useState, useMemo } from 'react'
import './GiftOverlay.css'

const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: `${(Math.random() - 0.5) * 400}px`,
  y: `${-200 - Math.random() * 250}px`,
  r: `${Math.random() * 1080 - 540}deg`,
  color: ['#ff4d6d', '#ffb3c1', '#ffd700', '#ff85a1', '#fff', '#f9c', '#ff6b8a', '#ffe066'][i % 8],
  delay: `${0.1 + Math.random() * 0.4}s`,
  size: 6 + Math.random() * 6,
}))

function GiftOverlay({ text = "Xin mời công chúa mở quà", onOpen }) {
  const [phase, setPhase] = useState('idle')

  const chars = useMemo(() => text.split(''), [text])

  const handleClick = () => {
    if (phase !== 'idle') return
    setPhase('shake')
    setTimeout(() => setPhase('open'), 600)
    setTimeout(() => setPhase('fadeOut'), 2200)
    setTimeout(() => onOpen?.(), 3000)
  }

  return (
    <div className={`gift-overlay ${phase === 'fadeOut' ? 'fade-out' : ''}`}>
      <div
        className={`gift-box ${phase === 'shake' ? 'shaking' : ''} ${phase === 'open' || phase === 'fadeOut' ? 'opening' : ''}`}
        onClick={handleClick}
      >
        <div className="gift-lid">
          <div className="gift-lid-face front" />
          <div className="gift-lid-face back" />
          <div className="gift-lid-face left" />
          <div className="gift-lid-face right" />
          <div className="gift-lid-face top" />
          <div className="gift-ribbon-bow" />
        </div>

        <div className="gift-body">
          <div className="gift-body-face front" />
          <div className="gift-body-face back" />
          <div className="gift-body-face left" />
          <div className="gift-body-face right" />
          <div className="gift-body-face bottom" />
          <div className="gift-ribbon-v" />
          <div className="gift-ribbon-h" />
        </div>

        {(phase === 'open' || phase === 'fadeOut') && <div className="gift-glow" />}
      </div>

      {(phase === 'open' || phase === 'fadeOut') && (
        <div className="confetti-wrap">
          {CONFETTI.map((c) => (
            <span
              key={c.id}
              className="confetti"
              style={{
                '--x': c.x,
                '--y': c.y,
                '--r': c.r,
                '--color': c.color,
                '--delay': c.delay,
                width: c.size,
                height: c.size * 1.5,
              }}
            />
          ))}
        </div>
      )}

      {phase === 'idle' && (
        <p className="gift-text">
          {chars.map((ch, i) => (
            <span
              key={i}
              className="gift-char"
              style={{ '--i': i }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

export default GiftOverlay
