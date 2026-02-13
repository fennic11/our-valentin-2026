import { useRef, useEffect } from 'react'

function FloatingHearts({ count = 50 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const hearts = Array.from({ length: count }, () => createHeart(canvas))

    function createHeart(cvs) {
      return {
        x: Math.random() * cvs.width,
        y: cvs.height + 20 + Math.random() * 40,
        size: 8 + Math.random() * 14,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.4 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        drift: (Math.random() - 0.5) * 0.5,
      }
    }

    function drawHeart(x, y, size, rotation, opacity) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.globalAlpha = opacity
      ctx.fillStyle = '#ff4d6d'
      ctx.beginPath()
      ctx.moveTo(0, -size * 0.3)
      ctx.bezierCurveTo(-size * 0.5, -size, -size, -size * 0.4, 0, size * 0.5)
      ctx.bezierCurveTo(size, -size * 0.4, size * 0.5, -size, 0, -size * 0.3)
      ctx.fill()
      ctx.restore()
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const h of hearts) {
        h.y -= h.speed
        h.x += h.drift
        h.rotation += h.rotationSpeed

        drawHeart(h.x, h.y, h.size, h.rotation, h.opacity)

        if (h.y < -30) {
          Object.assign(h, createHeart(canvas))
          h.y = canvas.height + 20
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
