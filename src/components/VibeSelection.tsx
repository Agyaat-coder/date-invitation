import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatedButton } from './AnimatedButton'
import type { Vibe } from '../config/invitation'

type VibeSelectionProps = {
 vibes: Vibe[]
 selectedVibe: string
 onSelect: (id: string) => void
 onContinue: () => void
 onBack: () => void
}

export function VibeSelection({ vibes, selectedVibe, onSelect, onContinue, onBack }: VibeSelectionProps) {
 const [reaction, setReaction] = useState('')

 useEffect(() => {
   const v = vibes.find((x) => x.id === selectedVibe)
   setReaction(v?.reaction ?? '')
 }, [selectedVibe, vibes])

 return (
   <motion.section className="paper-card selection-card vibe-card" initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98, y: -12 }}>
     <button className="back-button" type="button" onClick={onBack}><ArrowLeft size={15} /> back</button>
     <p className="eyebrow">one last little detail</p>
     <h2>What are we feeling? <span>🍕✨</span></h2>
     <p className="body-copy">pick your vibe</p>
     <div className="vibe-grid" role="radiogroup" aria-label="Choose a food vibe">
       {vibes.map((vibe) => {
         const selected = selectedVibe === vibe.id
         return (
           <motion.button
             key={vibe.id}
             type="button"
             role="radio"
             aria-checked={selected}
             className={`vibe-option ${selected ? 'is-selected' : ''}`}
             onClick={() => onSelect(vibe.id)}
             whileHover={{ y: -4, scale: 1.02, boxShadow: '0 12px 18px rgba(231, 63, 115, 0.12)' }}
             whileTap={{ scale: 0.97 }}
             animate={{
               y: selected ? -2 : 0,
               scale: selected ? 1.02 : 1,
               boxShadow: selected ? '0 10px 18px rgba(231, 63, 115, 0.12)' : '0 0 0 rgba(231, 63, 115, 0)',
             }}
             transition={{ type: 'spring', stiffness: 420, damping: 18 }}
           >
             <span className="vibe-emoji">{vibe.emoji}</span>
             <span className="vibe-label">{vibe.label}</span>
             <span className="vibe-note">{vibe.note}</span>
             {selected && <span className="check-mark">✓</span>}
           </motion.button>
         )
       })}
     </div>

     {reaction && (
       <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.26 }} className="body-copy" style={{ marginTop: 10 }}>
         {reaction}
       </motion.p>
     )}

     <AnimatedButton onClick={onContinue} disabled={!selectedVibe}>this sounds perfect <span aria-hidden="true">→</span></AnimatedButton>
   </motion.section>
 )
}
