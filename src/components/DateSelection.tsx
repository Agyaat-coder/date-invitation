import { CalendarDays, ChevronDown, Clock3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { invitationConfig } from '../config/invitation'
import { AnimatedButton } from './AnimatedButton'

type DateSelectionProps = {
  date: string
  time: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onContinue: () => void
  onBack: () => void
}

const times = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM']

const pickRandom = <T,>(items: T[], current?: T) => {
  if (items.length === 0) return undefined
  if (items.length === 1) return items[0]

  const next = items[Math.floor(Math.random() * items.length)]
  return next === current ? items.find((item) => item !== current) ?? next : next
}

export function DateSelection({ date, time, onDateChange, onTimeChange, onContinue, onBack }: DateSelectionProps) {
  const [dateMessage, setDateMessage] = useState('')
  const [timeMessage, setTimeMessage] = useState('')
  const [planMessage, setPlanMessage] = useState('')

  const handleDateChange = (nextDate: string) => {
    onDateChange(nextDate)
    if (!nextDate) {
      setDateMessage('')
      setPlanMessage('')
      return
    }

    setDateMessage(pickRandom(invitationConfig.datePhrases, dateMessage) ?? '')
    if (time) {
      setPlanMessage(pickRandom(invitationConfig.postDateMessages, planMessage) ?? '')
    }
  }

  const handleTimeChange = (nextTime: string) => {
    onTimeChange(nextTime)
    if (!nextTime) {
      setTimeMessage('')
      return
    }

    setTimeMessage(pickRandom(invitationConfig.timePhrases, timeMessage) ?? '')
    if (date) {
      setPlanMessage(pickRandom(invitationConfig.postDateMessages, planMessage) ?? '')
    }
  }

  return (
    <motion.section className="paper-card selection-card" initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98, y: -12 }}>
      <button className="back-button" type="button" onClick={onBack}><ChevronDown style={{ transform: 'rotate(-90deg)' }} /> back</button>
      <p className="eyebrow">chapter two · make a plan</p>
      <h2>So... when are you free?</h2>
      <p className="body-copy">I have a little evening in mind for us.</p>
      <div className="field-group">
        <label htmlFor="date"><span>Pick a day</span><CalendarDays size={16} /></label>
        <input id="date" type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={(event) => handleDateChange(event.target.value)} />
        {dateMessage && (
          <motion.p className="field-feedback" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {dateMessage}
          </motion.p>
        )}
      </div>
      <div className="field-group">
        <label htmlFor="time"><span>Pick a time</span><Clock3 size={16} /></label>
        <div className="select-wrap"><select id="time" value={time} onChange={(event) => handleTimeChange(event.target.value)}><option value="">Choose a time</option>{times.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={16} /></div>
        {timeMessage && (
          <motion.p className="field-feedback" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {timeMessage}
          </motion.p>
        )}
      </div>
      {date && time && planMessage && (
        <motion.p className="plan-affirmation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {planMessage}
        </motion.p>
      )}
      <AnimatedButton onClick={onContinue} disabled={!date || !time}>set the date! <span aria-hidden="true">→</span></AnimatedButton>
    </motion.section>
  )
}
