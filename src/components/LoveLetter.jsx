import { useState, useEffect } from 'react'
import './LoveLetter.css'

const lines = [
  'Gửi công chúa của anh,',
  '',
  'Anh không giỏi nói lời hoa mỹ,',
  'nhưng anh muốn em biết rằng...',
  '',
  'Mỗi ngày bên em là một ngày tuyệt vời.',
  '',
  'Em là nắng ấm của những ngày mưa,',
  'là bình yên giữa những lúc bộn bề,',
  'là lý do anh mỉm cười mỗi sáng thức dậy.',
  '',
  '775 ngày qua, anh đã yêu em',
  'nhiều hơn ngày hôm qua,',
  'và ít hơn ngày mai.',
   '',
  'Cảm ơn em vì đã luôn lựa chọn',
  'ở bên anh cho dù có điều gì xảy ra.',
  '',
  'Happy Valentine\'s Day, em yêu! 💕',
  '',
  'Mãi yêu em,',
  'Quốc Quảng ♥',
]

function LoveLetter() {
  const [phase, setPhase] = useState('enter') // enter → throw → arrive → open → letter
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const timers = []
    // Boy & girl appear
    timers.push(setTimeout(() => setPhase('throw'), 1500))
    // Letter flies to girl
    timers.push(setTimeout(() => setPhase('arrive'), 3500))
    // Girl catches, characters fade, envelope opens
    timers.push(setTimeout(() => setPhase('open'), 5000))
    // Letter paper appears
    timers.push(setTimeout(() => setPhase('letter'), 6500))
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (phase !== 'letter') return
    if (visibleLines >= lines.length) return
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 350)
    return () => clearTimeout(t)
  }, [phase, visibleLines])

  const thrown = phase === 'throw' || phase === 'arrive' || phase === 'open' || phase === 'letter'
  const arrived = phase === 'arrive' || phase === 'open' || phase === 'letter'
  const opened = phase === 'open' || phase === 'letter'
  const showLetter = phase === 'letter'

  return (
    <div className="love-letter-overlay">
      {/* ===== Characters scene ===== */}
      <div className={`ll-scene ${opened ? 'fade-out' : ''}`}>
        {/* Boy — left side */}
        <div className={`ll-boy ${phase !== 'enter' ? 'visible' : ''} ${thrown ? 'threw' : ''}`}>
          <div className="ll-char">
            <div className="boy-hair" />
            <div className="boy-head">
              <span className="eye left" />
              <span className="eye right" />
              <span className="blush left" />
              <span className="blush right" />
              <span className="mouth" />
            </div>
            <div className="boy-neck" />
            <div className="boy-torso">
              <div className="boy-collar" />
            </div>
            <div className={`boy-arm-r ${thrown ? 'throw-arm' : ''}`}>
              <div className="boy-hand" />
            </div>
            <div className="boy-arm-l" />
            <div className="boy-legs">
              <div className="boy-leg left" />
              <div className="boy-leg right" />
            </div>
          </div>
        </div>

        {/* Girl — right side */}
        <div className={`ll-girl ${phase !== 'enter' ? 'visible' : ''} ${arrived ? 'caught' : ''}`}>
          <div className="ll-char">
            <div className="girl-hair-back" />
            <div className="girl-head">
              <div className="girl-hair-front" />
              <span className="eye left" />
              <span className="eye right" />
              <span className="blush left" />
              <span className="blush right" />
              <span className="mouth smile" />
              <span className="girl-bow" />
            </div>
            <div className="girl-neck" />
            <div className="girl-dress">
              <div className="girl-collar" />
            </div>
            <div className={`girl-arm-l ${arrived ? 'catch-arm' : ''}`}>
              <div className="girl-hand" />
            </div>
            <div className="girl-arm-r" />
            <div className="girl-skirt" />
            <div className="girl-legs">
              <div className="girl-leg left" />
              <div className="girl-leg right" />
            </div>
          </div>
        </div>

        {/* Flying envelope */}
        <div className={`ll-flying-envelope ${thrown ? 'fly' : ''} ${arrived ? 'at-girl' : ''}`}>
          <div className="ll-mini-envelope">
            <div className="ll-mini-flap" />
            <div className="ll-mini-body" />
            <span className="ll-heart-seal">&#10084;</span>
          </div>
        </div>

        {/* Hearts trail during flight */}
        {thrown && !arrived && (
          <div className="ll-hearts-trail">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="ll-trail-heart" style={{ '--i': i }}>&#10084;</span>
            ))}
          </div>
        )}
      </div>

      {/* ===== Envelope open + Letter ===== */}
      {opened && (
        <div className="ll-letter-area">
          <div className={`envelope ${showLetter ? 'open' : ''}`}>
            <div className="envelope-flap" />
            <div className="envelope-body" />
          </div>

          <div className={`letter-paper ${showLetter ? 'visible' : ''}`}>
            <div className="letter-content">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={`letter-line ${i < visibleLines ? 'show' : ''}`}
                  style={{ '--i': i }}
                >
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoveLetter
