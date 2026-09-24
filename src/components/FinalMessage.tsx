import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { AnimatedButton } from './AnimatedButton'
import type { Vibe } from '../config/invitation'

type FinalMessageProps = {
  date: string
  time: string
  vibe?: Vibe
  message: string
  onReset: () => void
  onChangeMind: () => void
}

const floatingHearts = [
  { left: '12%', delay: 0 },
  { left: '28%', delay: 0.35 },
  { left: '46%', delay: 0.18 },
  { left: '62%', delay: 0.42 },
  { left: '78%', delay: 0.2 },
  { left: '88%', delay: 0.5 },
]

export function FinalMessage({ date, time, vibe, message, onReset, onChangeMind }: FinalMessageProps) {
  const [accepted, setAccepted] = useState(false)
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const [confetti, setConfetti] = useState<Array<{ id: number, left: string, char: string }>>([])
  const confettiChars = ['💫','✨','❤️','🌸','🎉']
  const celebrate = () => {
    setAccepted(true)
    // spawn a few confetti / emoji particles
    const ids: number[] = []
    for (let i = 0; i < 10; i++) ids.push(i + Date.now())
    const parts = ids.map((id, i) => ({ id, left: `${8 + (i * 9)}%`, char: confettiChars[i % confettiChars.length] }))
    setConfetti(parts)
    setTimeout(() => setConfetti([]), 1400)
    setTimeout(() => onReset(), 1400)
  }

  return (
    <motion.section className="paper-card final-card" initial={{ opacity: 0, y: 22, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
      <div className="final-float-layer" aria-hidden="true">
        {floatingHearts.map((heart, index) => (
          <motion.span
            key={index}
            className="final-float-heart"
            style={{ left: heart.left }}
            animate={{ y: [0, -30, -58], opacity: [0, 1, 0], scale: [0.8, 1.1, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: heart.delay, ease: 'easeInOut' }}
          >
            ♥
          </motion.span>
        ))}

        {confetti.map((c) => (
          <motion.span key={c.id} className="final-confetti" style={{ left: c.left }} initial={{ opacity: 1, y: 0, scale: 0.9 }} animate={{ opacity: 0, y: -140, scale: 1.02 }} transition={{ duration: 1.2, ease: 'easeOut' }}>{c.char}</motion.span>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <div className="celebration-mark" aria-hidden="true">♡</div>
        <p className="eyebrow">it&apos;s a date!</p>
        <h2>{accepted ? "IT'S OFFICIAL ❤️" : `${message} `}<span>❤️</span></h2>
        <p className="final-note">{accepted ? 'See you then.' : 'I\'ll bring the good playlist. You just bring that smile.'}</p>
        <div className="plan-summary">
          <div><span>when</span><strong>{formattedDate}</strong><strong>{time}</strong></div>
          <div><span>we&apos;re having</span><strong>{vibe?.emoji} {vibe?.label}</strong></div>
        </div>
        <AnimatedButton onClick={celebrate}><Check size={17} /> ok, I accept 💛</AnimatedButton>
        <button type="button" className="reset-button" onClick={onChangeMind}>wait... let me rethink this</button>
      </motion.div>
    </motion.section>
  )
}
