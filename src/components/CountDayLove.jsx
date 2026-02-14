import { useState, useEffect, useMemo, useRef } from 'react'
import quangImg from '../assets/quang1.jpeg'
import phuongImg from '../assets/Phuong1.jpeg'
import './CountDayLove.css'

function heartPoint(t, scale) {
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  return { x: x * scale, y: y * scale }
}

function circlePoint(i, total, radius) {
  const t = (i / total) * Math.PI * 2
  return { x: Math.cos(t) * radius, y: Math.sin(t) * radius }
}

function CountDayLove({ onOpenAlbum }) {
  const [assembled, setAssembled] = useState(false)
  const [showNumber, setShowNumber] = useState(false)
  const [displayNum, setDisplayNum] = useState(0)
  const [showCircles, setShowCircles] = useState(false)
  const [photo1Stage, setPhoto1Stage] = useState('hidden') // 'hidden' | 'big' | 'final'
  const [photo2Stage, setPhoto2Stage] = useState('hidden')
  const countRef = useRef(null)

  const isMobile = window.innerWidth <= 480
  const isTablet = !isMobile && window.innerWidth <= 768

  const bigHeart = useMemo(() => {
    const scale = isMobile ? 7 : isTablet ? 9 : 12
    return Array.from({ length: 24 }, (_, i) => {
      const t = (i / 24) * Math.PI * 2
      const target = heartPoint(t, scale)
      const angle = Math.random() * 360
      const dist = (isMobile ? 250 : 500) + Math.random() * (isMobile ? 200 : 400)
      return {
        id: i,
        startX: Math.cos(angle * Math.PI / 180) * dist,
        startY: Math.sin(angle * Math.PI / 180) * dist,
        targetX: target.x,
        targetY: target.y,
        size: (isMobile ? 12 : 16) + Math.random() * (isMobile ? 6 : 10),
        delay: i * 0.12,
      }
    })
  }, [])

  const circleRadius = isMobile ? 55 : isTablet ? 80 : 120
  const circleOffsetX = isMobile ? 110 : isTablet ? 230 : 380

  const leftCircle = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const target = circlePoint(i, 24, circleRadius)
      const angle = Math.random() * 360
      const dist = 500 + Math.random() * 400
      return {
        id: i,
        startX: Math.cos(angle * Math.PI / 180) * dist,
        startY: Math.sin(angle * Math.PI / 180) * dist,
        targetX: target.x - circleOffsetX,
        targetY: target.y,
        size: 12 + Math.random() * 6,
        delay: i * 0.1,
      }
    })
  }, [])

  const rightCircle = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const target = circlePoint(i, 24, circleRadius)
      const angle = Math.random() * 360
      const dist = 500 + Math.random() * 400
      return {
        id: i,
        startX: Math.cos(angle * Math.PI / 180) * dist,
        startY: Math.sin(angle * Math.PI / 180) * dist,
        targetX: target.x + circleOffsetX,
        targetY: target.y,
        size: 12 + Math.random() * 6,
        delay: i * 0.1,
      }
    })
  }, [])

  const leftPos = isMobile ? { left: -160, top: 100 } : isTablet ? { left: -300, top: -70 } : { left: -480, top: -100 }
  const rightPos = isMobile ? { left: 60, top: 100 } : isTablet ? { left: 160, top: -70 } : { left: 280, top: -100 }

  useEffect(() => {
    const t1 = setTimeout(() => setAssembled(true), 300)
    const t2 = setTimeout(() => setShowNumber(true), 4000)
    const t3 = setTimeout(() => setShowCircles(true), 7000)
    const t4 = setTimeout(() => setPhoto1Stage('big'), 10000)
    const t5 = setTimeout(() => setPhoto1Stage('final'), 11800)
    const t6 = setTimeout(() => setPhoto2Stage('big'), 13200)
    const t7 = setTimeout(() => setPhoto2Stage('final'), 15000)
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); clearTimeout(t7)
    }
  }, [])

  // Count from 1 to 775
  useEffect(() => {
    if (!showNumber) return
    const target = 775
    const duration = 2500
    const start = performance.now()
    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      // ease-out for a satisfying deceleration at the end
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplayNum(Math.round(ease * target))
      if (t < 1) countRef.current = requestAnimationFrame(tick)
    }
    countRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(countRef.current)
  }, [showNumber])

  return (
    <div className="count-day-love">
      <div className="heart-container">
        {/* Trái tim lớn */}
        {bigHeart.map((h) => (
          <span
            key={`big-${h.id}`}
            className={`flying-heart ${assembled ? 'at-target' : ''}`}
            style={{
              '--startX': `${h.startX}px`,
              '--startY': `${h.startY}px`,
              '--targetX': `${h.targetX}px`,
              '--targetY': `${h.targetY}px`,
              '--delay': `${h.delay}s`,
              fontSize: `${h.size}px`,
            }}
          >
            &#10084;
          </span>
        ))}

        <span className={`heart-number ${showNumber ? 'visible' : ''}`}>
          {displayNum}
        </span>

        {/* Vòng tròn trái — Quang */}
        {showCircles && leftCircle.map((h) => (
          <span
            key={`left-${h.id}`}
            className={`flying-heart circle-heart ${showCircles ? 'at-target' : ''}`}
            style={{
              '--startX': `${h.startX}px`,
              '--startY': `${h.startY}px`,
              '--targetX': `${h.targetX}px`,
              '--targetY': `${h.targetY}px`,
              '--delay': `${h.delay}s`,
              fontSize: `${h.size}px`,
            }}
          >
            &#10084;
          </span>
        ))}

        {/* Vòng tròn phải — Phương */}
        {showCircles && rightCircle.map((h) => (
          <span
            key={`right-${h.id}`}
            className={`flying-heart circle-heart ${showCircles ? 'at-target' : ''}`}
            style={{
              '--startX': `${h.startX}px`,
              '--startY': `${h.startY}px`,
              '--targetX': `${h.targetX}px`,
              '--targetY': `${h.targetY}px`,
              '--delay': `${h.delay}s`,
              fontSize: `${h.size}px`,
            }}
          >
            &#10084;
          </span>
        ))}

        {/* Ảnh Quang */}
        <div
          className={`photo-wrap ${photo1Stage === 'big' ? 'big-center' : ''} ${photo1Stage === 'final' ? 'at-position' : ''}`}
          style={photo1Stage === 'final' ? { left: leftPos.left, top: leftPos.top } : undefined}
        >
          <div className={`photo-circle ${photo1Stage === 'big' ? 'big-square' : ''}`}>
            <img src={quangImg} alt="Quang" />
          </div>
          {photo1Stage === 'final' && <span className="photo-name">Quốc Quảng</span>}
        </div>

        {/* Ảnh Phương */}
        <div
          className={`photo-wrap ${photo2Stage === 'big' ? 'big-center' : ''} ${photo2Stage === 'final' ? 'at-position' : ''}`}
          style={photo2Stage === 'final' ? { left: rightPos.left, top: rightPos.top, cursor: 'pointer' } : undefined}
          onClick={() => photo2Stage === 'final' && onOpenAlbum?.()}
        >
          <div className={`photo-circle ${photo2Stage === 'big' ? 'big-square' : ''} ${photo2Stage === 'final' ? 'clickable' : ''}`}>
            <img src={phuongImg} alt="Phuong" />
          </div>
          {photo2Stage === 'final' && <span className="photo-name">Hoàng Phương</span>}
        </div>
      </div>
    </div>
  )
}

export default CountDayLove
