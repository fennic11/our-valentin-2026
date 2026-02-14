import { useRef, useEffect } from 'react'

function FloatingHearts({ count = 50 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    let animationId

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Pre-render "Q ❤ P" sprites at a few sizes to avoid per-frame text/shadow work
    const sizes = [14, 18, 22, 26]
    const sprites = sizes.map((s) => {
      const heartSize = s * 0.4
      const gap = s * 0.15
      const pad = 12 // extra space for shadow blur
      const w = s * 3 + pad * 2
      const h = s * 1.6 + pad * 2
      const off = document.createElement('canvas')
      off.width = w * dpr
      off.height = h * dpr
      const c = off.getContext('2d')
      c.scale(dpr, dpr)

      const cx = w / 2
      const cy = h / 2

      // Q
      c.font = `bold ${s}px 'Dancing Script', cursive`
      c.textBaseline = 'middle'
      c.textAlign = 'right'
      c.fillStyle = '#5b92e5'
      c.shadowColor = '#5b92e588'
      c.shadowBlur = 8
      c.fillText('Q', cx - gap, cy)

      // Heart
      c.fillStyle = '#ff4d6d'
      c.shadowColor = '#ff4d6d88'
      c.shadowBlur = 8
      const hx = cx
      const hy = cy - heartSize * 0.1
      c.beginPath()
      c.moveTo(hx, hy - heartSize * 0.3)
      c.bezierCurveTo(hx - heartSize * 0.5, hy - heartSize, hx - heartSize, hy - heartSize * 0.4, hx, hy + heartSize * 0.5)
      c.bezierCurveTo(hx + heartSize, hy - heartSize * 0.4, hx + heartSize * 0.5, hy - heartSize, hx, hy - heartSize * 0.3)
      c.fill()

      // P
      c.textAlign = 'left'
      c.fillStyle = '#ff7eb3'
      c.shadowColor = '#ff7eb388'
      c.shadowBlur = 8
      c.fillText('P', cx + gap, cy)

      return { canvas: off, w, h, size: s }
    })

    function pickSprite() {
      return sprites[Math.floor(Math.random() * sprites.length)]
    }

    const items = Array.from({ length: count }, () => createItem())

    function createItem() {
      return {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 20 + Math.random() * 40,
        speed: 0.4 + Math.random() * 1.2,
        opacity: 0.35 + Math.random() * 0.55,
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.006,
        drift: (Math.random() - 0.5) * 0.4,
        sprite: pickSprite(),
      }
    }

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (const item of items) {
        item.y -= item.speed
        item.x += item.drift
        item.rotation += item.rotationSpeed

        ctx.save()
        ctx.translate(item.x, item.y)
        ctx.rotate(item.rotation)
        ctx.globalAlpha = item.opacity
        const sp = item.sprite
        ctx.drawImage(sp.canvas, -sp.w / 2, -sp.h / 2, sp.w, sp.h)
        ctx.restore()

        if (item.y < -sp.h) {
          Object.assign(item, createItem())
          item.y = window.innerHeight + 20
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}

export default FloatingHearts
