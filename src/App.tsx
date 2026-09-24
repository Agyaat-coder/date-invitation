import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { DecorativeElements } from './components/DecorativeElements'
import { DateSelection } from './components/DateSelection'
import { FinalMessage } from './components/FinalMessage'
import { IntroScreen } from './components/IntroScreen'
import { InvitationCard } from './components/InvitationCard'
import { VibeSelection } from './components/VibeSelection'
import { invitationConfig } from './config/invitation'

type Screen = 'mail' | 'question' | 'date' | 'vibe' | 'final'
type InvitationState = { accepted: boolean; date: string; time: string; vibe: string }

function App() {
  const [screen, setScreen] = useState<Screen>('mail')
  const [invitation, setInvitation] = useState<InvitationState>({ accepted: false, date: '', time: '', vibe: '' })

  const update = <Key extends keyof InvitationState>(key: Key, value: InvitationState[Key]) => setInvitation((current) => ({ ...current, [key]: value }))
  const selectedVibe = invitationConfig.vibes.find((vibe) => vibe.id === invitation.vibe)

  const reset = () => {
    setInvitation({ accepted: false, date: '', time: '', vibe: '' })
    setScreen('mail')
  }

  return <main className="app-shell">
    <DecorativeElements />
    <div className="top-bar"><span className="top-mark">♡</span><span>just between us</span><span className="top-line" /></div>
    <div className="experience">
      <AnimatePresence mode="wait">
        {screen === 'mail' && <motion.div key="mail" className="screen-wrap" exit={{ opacity: 0, scale: 0.96, y: -20 }}><InvitationCard recipientName={invitationConfig.recipientName} subject={invitationConfig.subject} onOpen={() => setScreen('question')} /></motion.div>}
        {screen === 'question' && <motion.div key="question" className="screen-wrap"><IntroScreen question={invitationConfig.question} senderName={invitationConfig.senderName} onAccept={() => { update('accepted', true); setScreen('date') }} /></motion.div>}
        {screen === 'date' && <motion.div key="date" className="screen-wrap"><DateSelection date={invitation.date} time={invitation.time} onDateChange={(value) => update('date', value)} onTimeChange={(value) => update('time', value)} onContinue={() => setScreen('vibe')} onBack={() => setScreen('question')} /></motion.div>}
        {screen === 'vibe' && <motion.div key="vibe" className="screen-wrap"><VibeSelection vibes={invitationConfig.vibes} selectedVibe={invitation.vibe} onSelect={(value) => update('vibe', value)} onContinue={() => setScreen('final')} onBack={() => setScreen('date')} /></motion.div>}
        {screen === 'final' && <motion.div key="final" className="screen-wrap"><FinalMessage date={invitation.date} time={invitation.time} vibe={selectedVibe} message={invitationConfig.finalMessage} onReset={reset} onChangeMind={() => setScreen('vibe')} /></motion.div>}
      </AnimatePresence>
    </div>
    <div className="footer-note"><span>made with a little courage</span><span>•</span><span>for {invitationConfig.recipientName}</span></div>
  </main>
}

export default App
