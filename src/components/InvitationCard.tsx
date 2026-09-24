import { motion } from 'framer-motion'
import { MailOpen } from 'lucide-react'
import { AnimatedButton } from './AnimatedButton'

type InvitationCardProps = {
  recipientName: string
  subject: string
  onOpen: () => void
}

export function InvitationCard({ recipientName, subject, onOpen }: InvitationCardProps) {
  return (
    <motion.section className="paper-card intro-card" initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
      <div className="mail-topline"><span>✉</span><span>new message</span><span className="mail-dot" /></div>
      <div className="mail-meta">
        <div><span className="meta-label">to</span><strong>{recipientName}</strong></div>
        <div><span className="meta-label">subject</span><strong>{subject}</strong></div>
      </div>
      <div className="mail-rule" />
      <div className="mail-body">
        <div className="stamp">♡<small>for you</small></div>
        <p className="eyebrow">there is something in your inbox...</p>
        <h1>open me?</h1>
        <p className="body-copy">A very important little note has arrived, and it has your name written all over it.</p>
      </div>
      <AnimatedButton onClick={onOpen}><MailOpen size={17} strokeWidth={2.2} /> open the note</AnimatedButton>
    </motion.section>
  )
}
