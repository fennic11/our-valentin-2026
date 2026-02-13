import { useState, useEffect } from 'react'
import FloatingHearts from './components/FloatingHearts'
import Greeting from './components/Greeting'
import GiftOverlay from './components/GiftOverlay'
import CountDayLove from './components/CountDayLove'
import PhotoAlbum from './components/PhotoAlbum'
import LoveLetter from './components/LoveLetter'
import './App.css'

function App() {
  const [phase, setPhase] = useState('waiting')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('greeting'), 5000)
    const t2 = setTimeout(() => setPhase('gift'), 10000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="scene">
      <FloatingHearts count={50} />
      {phase === 'greeting' && <Greeting />}
      {phase === 'gift' && <GiftOverlay onOpen={() => setPhase('countDayLove')} />}
      {phase === 'countDayLove' && <CountDayLove onOpenAlbum={() => setPhase('album')} />}
      {phase === 'album' && <PhotoAlbum onFinish={() => setPhase('letter')} />}
      {phase === 'letter' && <LoveLetter />}
    </div>
  )
}

export default App
