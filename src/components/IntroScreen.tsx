import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { AnimatedButton } from './AnimatedButton'
import { useEffect, useRef, useState } from 'react'
import { NoButton } from './NoButton'
import { invitationConfig } from '../config/invitation'

type IntroScreenProps = {
  question: string
  senderName: string
  onAccept: () => void
}

export function IntroScreen({ question, senderName, onAccept }: IntroScreenProps) {
  const containerRef = useRef<HTMLElement | null>(null)
  const yesRef = useRef<HTMLButtonElement | null>(null)
  const [escapeAttempts, setEscapeAttempts] = useState(0)
  const [attemptMessage, setAttemptMessage] = useState('')

  useEffect(() => {
    const messages = invitationConfig.noButtonAttemptsMessages
    // show subtle messages at thresholds
    if (escapeAttempts === 0) setAttemptMessage('')
    else if (escapeAttempts >= 10) setAttemptMessage(messages[9] ?? '')
    else if (escapeAttempts >= 8) setAttemptMessage(messages[7] ?? '')
    else if (escapeAttempts >= 5) setAttemptMessage(messages[4] ?? '')
    else if (escapeAttempts >= 3) setAttemptMessage(messages[2] ?? '')
    else if (escapeAttempts >= 1) setAttemptMessage(messages[0] ?? '')
  }, [escapeAttempts])

  // small heart burst for YES button
  const [bursts, setBursts] = useState<Array<{ id: number }>>([])
  const nextBurstId = useRef(1)
  const [hoverHearts, setHoverHearts] = useState<Array<{ id: number, left: string }>>([])

  const createBurst = (count = 1) => {
    const ids: number[] = []
    for (let i = 0; i < count; i++) ids.push(nextBurstId.current++)
    setBursts((b) => [...b, ...ids.map((id) => ({ id }))])
    setTimeout(() => { setBursts((b) => b.filter((x) => !ids.includes(x.id))) }, 900)
  }

  const onYesClick = () => {
    // create a tiny burst
    createBurst(3)
    // call accept after a short playful delay (transition story)
    setTimeout(() => onAccept(), 520)
  }

  // show gentle floating hearts while hovering YES
  const spawnHoverHeart = () => {
    const id = nextBurstId.current++
    const left = `${42 + Math.floor(Math.random() * 16)}%`
    setHoverHearts((h) => [...h, { id, left }])
    setTimeout(() => setHoverHearts((h) => h.filter((x) => x.id !== id)), 900)
  }

  // secret heart easter egg
  const [secretCount, setSecretCount] = useState(0)
  const [secretMessage, setSecretMessage] = useState('')
  useEffect(() => {
    if (secretCount === 3) {
      setSecretMessage('okay, you found the secret ❤️')
      // tiny heart release effect: create two bursts
      const id1 = nextBurstId.current++
      const id2 = nextBurstId.current++
      setBursts((b) => [...b, { id: id1 }, { id: id2 }])
      setTimeout(() => { setBursts((b) => b.filter((x) => x.id !== id1 && x.id !== id2)) }, 1200)
    }
  }, [secretCount])

  return (
    <motion.section ref={containerRef} className="paper-card question-card" initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98, y: -12 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
      <div className="card-flourish" aria-hidden="true"><span>✿</span><span>♡</span><span>✿</span></div>
      <div className="tiny-illustration" aria-hidden="true">🧸</div>
      <h3 className="dear-heading">Dear Youuh</h3>
      <p className="eyebrow">a very important question</p>
      <h1>{question}</h1>
      <p className="script-line">from {senderName} <span>♡</span></p>

      <div style={{ position: 'relative' }} className="no-button-container" aria-hidden={false}>
        {/* YES button */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
          <AnimatedButton
            onClick={onYesClick}
            ref={yesRef as any}
            className="yes-button"
            whileHover={{ scale: 1.06, boxShadow: '0 12px 30px rgba(231,63,115,0.18)' }}
            onHoverStart={() => { spawnHoverHeart(); }}
            onHoverEnd={() => { /* nothing */ }}
            onTapStart={() => { /* small compress handled by AnimatedButton */ }}
          >
            <Heart className="heart-icon" size={17} fill="currentColor" style={{ transform: 'translateY(0)', transition: 'transform 160ms' }} /> yes, absolutely
          </AnimatedButton>
        </div>

        {/* floating tiny heart particles (rendered around the YES button when bursts exist) */}
        {bursts.map((b) => (
          <motion.span key={b.id} className="heart-particle" style={{ left: '50%', top: '46%' }} initial={{ opacity: 1, y: 0, scale: 0.9 }} animate={{ opacity: 0, y: -64, scale: 1.1 }} transition={{ duration: 0.9 }}>
            ❤️
          </motion.span>
        ))}
        {hoverHearts.map((h) => (
          <motion.span key={h.id} className="heart-particle" style={{ left: h.left, top: '52%' }} initial={{ opacity: 0.9, y: 2, scale: 0.85 }} animate={{ opacity: 0, y: -44, scale: 1.05 }} transition={{ duration: 0.9 }}>
            ❤️
          </motion.span>
        ))}

        {/* NO button that escapes */}
        <NoButton containerRef={containerRef} yesRef={yesRef} messages={invitationConfig.noButtonMessages} onAttempt={(count) => setEscapeAttempts(count)} />

      </div>

      <p className="micro-copy">(there is only one correct answer)</p>
      <p className="no-attempts-note">{attemptMessage}</p>

      {/* secret heart (subtle) */}
      <button type="button" aria-hidden={false} className={`secret-heart ${secretCount > 0 ? 'pulse' : ''}`} onClick={() => setSecretCount((c) => c + 1)}>
        ♡
      </button>
      {secretMessage && <p className="micro-copy" style={{ marginTop: 8 }}>{secretMessage}</p>}
    </motion.section>
  )
}
