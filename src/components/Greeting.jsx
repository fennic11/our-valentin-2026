import { useMemo } from 'react'
import './Greeting.css'

function Greeting({ text = "Xin chào công chúa aka người xinh đẹp nhất thế gian!" }) {
  const chars = useMemo(() => text.split(''), [text])

  return (
    <div className="greeting-overlay">
      <p className="greeting-text">
        {chars.map((ch, i) => (
          <span
            key={i}
            className="greeting-char"
            style={{ '--i': i, '--total': chars.length }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </p>
    </div>
  )
}

export default Greeting
