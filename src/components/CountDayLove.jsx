import { useState, useEffect, useMemo } from 'react'
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
  const [showCircles, setShowCircles] = useState(false)
  const [showPhotos, setShowPhotos] = useState(false)

  const bigHeart = useMemo(() => {
    const scale = 12
    return Array.from({ length: 24 }, (_, i) => {
      const t = (i / 24) * Math.PI * 2
      const target = heartPoint(t, scale)
      const angle = Math.random() * 360
      const dist = 500 + Math.random() * 400
      return {
        id: i,
        startX: Math.cos(angle * Math.PI / 180) * dist,
        startY: Math.sin(angle * Math.PI / 180) * dist,
        targetX: target.x,
        targetY: target.y,
        size: 16 + Math.random() * 10,
        delay: i * 0.12,
      }
    })
  }, [])

  const circleRadius = 120
  const circleOffsetX = 380

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

  useEffect(() => {
    const t1 = setTimeout(() => setAssembled(true), 300)
    const t2 = setTimeout(() => setShowNumber(true), 4000)
    const t3 = setTimeout(() => setShowCircles(true), 5500)
    const t4 = setTimeout(() => setShowPhotos(true), 8500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

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
          775
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

        {/* Ảnh bên trong vòng tròn */}
        <div className={`photo-wrap left-photo ${showPhotos ? 'visible' : ''}`}>
          <div className="photo-circle">
            <img src={quangImg} alt="Quang" />
          </div>
          <span className="photo-name">Quốc Quảng</span>
        </div>
        <div
          className={`photo-wrap right-photo ${showPhotos ? 'visible' : ''}`}
          onClick={() => showPhotos && onOpenAlbum?.()}
          style={{ cursor: showPhotos ? 'pointer' : 'default' }}
        >
          <div className="photo-circle clickable">
            <img src={phuongImg} alt="Phuong" />
          </div>
          <span className="photo-name">Hoàng Phương</span>
        </div>
      </div>
    </div>
  )
}

export default CountDayLove
