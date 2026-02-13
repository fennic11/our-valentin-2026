import { useState, useCallback, useRef, useEffect } from 'react'
import * as THREE from 'three'
import './PhotoAlbum.css'

import p1 from '../assets/Phuong1.jpeg'
import p2 from '../assets/phuong2.jpeg'
import p3 from '../assets/phuong3.jpeg'
import p4 from '../assets/phuong4.jpeg'
import p5 from '../assets/phuong5.jpeg'
import p6 from '../assets/phuong6.jpeg'
import p7 from '../assets/phuong7.jpeg'
import p8 from '../assets/phuong8.jpeg'
import p9 from '../assets/phuopng9.jpeg'
import p10 from '../assets/phuong10.jpeg'
import p11 from '../assets/phuong11.jpeg'
import p12 from '../assets/phuong12.jpeg'
import p13 from '../assets/phuong13.jpeg'
import p14 from '../assets/phuong14.jpeg'
import p15 from '../assets/phuong15.jpeg'
import p16 from '../assets/phuong16.jpeg'
import p17 from '../assets/phuong17.jpeg'
import p18 from '../assets/phuong18.jpeg'

const photos = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18]

const VIEW_NAMES = ['Globe', 'Filmstrip', 'Carousel']

function PhotoAlbum({ onFinish }) {
  const [viewIndex, setViewIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const goToView = useCallback((i) => {
    setViewIndex(i)
    setAnimKey((k) => k + 1)
  }, [])

  const handleClick = () => {
    if (viewIndex === 0) return
    const next = viewIndex + 1
    if (next >= VIEW_NAMES.length) {
      onFinish?.()
      return
    }
    setViewIndex(next)
    setAnimKey((k) => k + 1)
  }

  return (
    <div className="album-overlay" onClick={handleClick}>
      <div className="album-title">
        <span className="album-title-text">{VIEW_NAMES[viewIndex]}</span>
      </div>

      <div className={`album-view view-${viewIndex}`} key={animKey}>
        {viewIndex === 0 && <GlobeView onEnter={() => goToView(1)} />}
        {viewIndex === 1 && <FilmstripView />}
        {viewIndex === 2 && <CarouselView />}
      </div>

      <div className="album-hint">
        {viewIndex === 0 ? 'Click vào trái đất để khám phá' : 'Click to change view'}
      </div>

      <div className="album-dots">
        {VIEW_NAMES.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === viewIndex ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); goToView(i) }}
          />
        ))}
      </div>
    </div>
  )
}

/* ==========================================
   Globe View — Three.js sphere + fly inside
   ========================================== */
function GlobeView({ onEnter }) {
  const mountRef = useRef(null)
  const sphereRef = useRef(null)
  const outerMatRef = useRef(null)
  const innerRef = useRef(null)
  const glowRef = useRef(null)
  const starsRef = useRef(null)
  const cameraRef = useRef(null)
  const autoRotate = useRef(true)
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const flyingIn = useRef(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 1000)
    camera.position.z = 5.5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    mount.appendChild(renderer.domElement)

    // Stars
    const starGeo = new THREE.BufferGeometry()
    const starCount = 500
    const starPos = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 40
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 40
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 40
      starSizes[i] = Math.random() * 0.06 + 0.02
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)
    starsRef.current = stars

    // Build high-res texture with borders between photos
    const canvas2d = document.createElement('canvas')
    const cols = 6, rows = 4, cellW = 512, cellH = 512
    const border = 4
    canvas2d.width = cols * cellW
    canvas2d.height = rows * cellH
    const ctx = canvas2d.getContext('2d')

    // Fill background dark
    ctx.fillStyle = '#1a0a14'
    ctx.fillRect(0, 0, canvas2d.width, canvas2d.height)

    let loaded = 0
    const images = []

    photos.forEach((src, i) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        loaded++
        images[i] = img
        if (loaded === photos.length) {
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const idx = r * cols + c
              const photo = images[idx % images.length]
              const sw = photo.width, sh = photo.height
              const aspect = sw / sh

              const innerW = cellW - border * 2
              const innerH = cellH - border * 2
              const cellAspect = innerW / innerH

              let sx, sy, sWidth, sHeight
              if (aspect > cellAspect) {
                sHeight = sh
                sWidth = sh * cellAspect
                sx = (sw - sWidth) / 2
                sy = 0
              } else {
                sWidth = sw
                sHeight = sw / cellAspect
                sx = 0
                sy = (sh - sHeight) / 2
              }

              // Draw thin golden border
              ctx.fillStyle = '#ff4d6d44'
              ctx.fillRect(c * cellW, r * cellH, cellW, cellH)

              // Draw photo inside border
              ctx.drawImage(
                photo,
                sx, sy, sWidth, sHeight,
                c * cellW + border, r * cellH + border,
                innerW, innerH
              )
            }
          }

          const texture = new THREE.CanvasTexture(canvas2d)
          texture.colorSpace = THREE.SRGBColorSpace
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

          // Outer sphere — NOT transparent initially (avoids render order issues)
          const geo = new THREE.SphereGeometry(2, 128, 128)
          const mat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.3,
            metalness: 0.05,
          })
          const sphere = new THREE.Mesh(geo, mat)
          sphere.rotation.x = 0.3
          scene.add(sphere)
          sphereRef.current = sphere
          outerMatRef.current = mat

          // Inner sphere (seen from inside) — higher quality
          const innerGeo = new THREE.SphereGeometry(1.98, 128, 128)
          const innerMat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide,
            toneMapped: false,
          })
          const inner = new THREE.Mesh(innerGeo, innerMat)
          inner.rotation.x = 0.3
          scene.add(inner)
          innerRef.current = inner

          // Atmosphere glow — double layer
          const glowGeo = new THREE.SphereGeometry(2.15, 64, 64)
          const glowMat = new THREE.MeshBasicMaterial({
            color: 0xff4d6d, transparent: true, opacity: 0.15, side: THREE.BackSide,
          })
          const glow = new THREE.Mesh(glowGeo, glowMat)
          scene.add(glow)
          glowRef.current = glow

          const glow2Geo = new THREE.SphereGeometry(2.3, 32, 32)
          const glow2Mat = new THREE.MeshBasicMaterial({
            color: 0xff4d6d, transparent: true, opacity: 0.06, side: THREE.BackSide,
          })
          const glow2 = new THREE.Mesh(glow2Geo, glow2Mat)
          scene.add(glow2)
          glow2.userData.isGlow2 = true
        }
      }
      img.src = src
    })

    // Lights — outside (bright enough with ACES tone mapping)
    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const dir = new THREE.DirectionalLight(0xffeedd, 1.8)
    dir.position.set(3, 2, 5)
    scene.add(dir)
    const rim = new THREE.DirectionalLight(0xff4d6d, 0.7)
    rim.position.set(-3, -1, -3)
    scene.add(rim)

    // Inside lights — warm & romantic
    const insideLight1 = new THREE.PointLight(0xfff5ee, 0, 4)
    insideLight1.position.set(0, 0, 0)
    scene.add(insideLight1)
    const insideLight2 = new THREE.PointLight(0xff8fa3, 0, 3)
    insideLight2.position.set(0, 0.5, 0)
    scene.add(insideLight2)
    const insideLight3 = new THREE.PointLight(0xffd6e0, 0, 3)
    insideLight3.position.set(0, -0.5, 0)
    scene.add(insideLight3)

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)

      if (sphereRef.current && autoRotate.current && !flyingIn.current) {
        sphereRef.current.rotation.y += 0.004
      }
      if (glowRef.current && sphereRef.current) {
        glowRef.current.rotation.y = sphereRef.current.rotation.y
        glowRef.current.rotation.x = sphereRef.current.rotation.x
      }
      if (innerRef.current && sphereRef.current) {
        innerRef.current.rotation.y = sphereRef.current.rotation.y
        innerRef.current.rotation.x = sphereRef.current.rotation.x
      }
      if (starsRef.current) starsRef.current.rotation.y += 0.0003

      // Inside light intensity based on camera distance
      const dist = camera.position.length()
      const insideFactor = dist < 2.5 ? Math.pow((2.5 - dist) / 2.5, 2) : 0
      insideLight1.intensity = insideFactor * 4
      insideLight2.intensity = insideFactor * 2
      insideLight3.intensity = insideFactor * 2

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w2 = mount.clientWidth, h2 = mount.clientHeight
      camera.aspect = w2 / h2
      camera.updateProjectionMatrix()
      renderer.setSize(w2, h2)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  const onPointerDown = (e) => {
    if (flyingIn.current) return
    e.stopPropagation()
    dragging.current = true
    autoRotate.current = false
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerMove = (e) => {
    if (!dragging.current || !sphereRef.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    sphereRef.current.rotation.y += dx * 0.005
    sphereRef.current.rotation.x += dy * 0.005
    sphereRef.current.rotation.x = Math.max(-1, Math.min(1, sphereRef.current.rotation.x))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = () => {
    dragging.current = false
    setTimeout(() => { autoRotate.current = true }, 2000)
  }

  const handleClick = (e) => {
    if (flyingIn.current) return
    e.stopPropagation()
    flyingIn.current = true
    autoRotate.current = false

    const camera = cameraRef.current
    if (!camera) return

    // Add vignette overlay
    const container = mountRef.current
    if (container) {
      container.classList.add('globe-flying-in')
    }

    const startZ = camera.position.z
    const startFov = camera.fov
    const endFov = 100 // wide panoramic view inside
    const duration = 3000
    const start = performance.now()

    // Fade glow
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15
    }

    // Phase 1: Fly into center with FOV widening + outer sphere fade
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      // Custom ease: slow start, accelerate through the wall, slow inside
      const ease = t < 0.3
        ? 2.2 * t * t
        : t < 0.7
          ? 0.198 + (t - 0.3) * 2.005
          : 1 - Math.pow(1 - t, 3) * 0.6

      camera.position.z = startZ * (1 - ease)

      // Widen FOV as we enter
      camera.fov = startFov + (endFov - startFov) * ease
      camera.updateProjectionMatrix()

      // Fade outer sphere as we pass through
      if (outerMatRef.current && t > 0.3) {
        if (!outerMatRef.current.transparent) {
          outerMatRef.current.transparent = true
          outerMatRef.current.needsUpdate = true
        }
        const fadeT = Math.min((t - 0.3) / 0.3, 1)
        outerMatRef.current.opacity = 1 - fadeT
      }

      // Fade glow
      if (glowRef.current && t > 0.2) {
        glowRef.current.visible = false
      }

      // Fade stars
      if (starsRef.current && t > 0.4) {
        const fadeT = Math.min((t - 0.4) / 0.3, 1)
        starsRef.current.material.opacity = 0.8 * (1 - fadeT)
      }

      // Slow sphere rotation during fly-in
      if (sphereRef.current) {
        sphereRef.current.rotation.y += 0.004 * (1 - t)
      }

      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        // Phase 2: Inside — panoramic look-around
        if (starsRef.current) starsRef.current.visible = false
        if (outerMatRef.current) outerMatRef.current.opacity = 0

        const insideStart = performance.now()
        const insideDuration = 8000
        camera.rotation.order = 'YXZ'

        const insideTick = (now2) => {
          const t2 = Math.min((now2 - insideStart) / insideDuration, 1)

          // Slow panoramic rotation — ~270° in 8s, gentle vertical wave
          const rotY = t2 * Math.PI * 1.5
          const rotX = Math.sin(t2 * Math.PI * 2) * 0.15

          camera.rotation.y = rotY
          camera.rotation.x = rotX

          // Gentle floating motion
          camera.position.y = Math.sin(t2 * Math.PI * 1.5) * 0.1
          camera.position.x = Math.cos(t2 * Math.PI) * 0.08

          // Slowly narrow FOV back for cinematic feel
          camera.fov = endFov - (endFov - 75) * t2
          camera.updateProjectionMatrix()

          if (t2 < 1) {
            requestAnimationFrame(insideTick)
          } else {
            // Fade out
            if (container) container.classList.add('globe-fade-out')
            setTimeout(() => onEnter?.(), 800)
          }
        }
        requestAnimationFrame(insideTick)
      }
    }
    requestAnimationFrame(tick)
  }

  return (
    <div
      className="globe-3d-container"
      ref={mountRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={handleClick}
    />
  )
}

/* ==========================================
   Filmstrip View — horizontal scroll
   ========================================== */
function FilmstripView() {
  return (
    <div className="filmstrip-wrap">
      <div className="filmstrip-track">
        {photos.map((src, i) => (
          <div key={i} className="filmstrip-frame" style={{ '--i': i }}>
            <div className="filmstrip-holes top">
              {Array.from({ length: 4 }, (_, j) => <span key={j} className="hole" />)}
            </div>
            <img src={src} alt="" />
            <div className="filmstrip-holes bottom">
              {Array.from({ length: 4 }, (_, j) => <span key={j} className="hole" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ==========================================
   Carousel View — 3D rotating
   ========================================== */
function CarouselView() {
  return (
    <div className="carousel-track">
      {photos.slice(0, 10).map((src, i) => (
        <div
          key={i}
          className="carousel-card"
          style={{
            '--i': i,
            '--angle': `${i * 36}deg`,
          }}
        >
          <img src={src} alt="" />
        </div>
      ))}
    </div>
  )
}


export default PhotoAlbum
