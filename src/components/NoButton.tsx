import { motion } from 'framer-motion'
import { useEffect, useRef, useState, useLayoutEffect } from 'react'

type NoButtonProps = {
  containerRef: React.RefObject<HTMLElement | null>
  yesRef?: React.RefObject<HTMLElement | null>
  messages: string[]
  onAttempt?: (count: number) => void
}

export function NoButton({ containerRef, yesRef, messages, onAttempt }: NoButtonProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [label, setLabel] = useState(messages[0] ?? 'no')
  const [attempts, setAttempts] = useState(0)
  const cooldown = useRef(false)
  const [rot, setRot] = useState(0)

  // place the button initially somewhere safe (prefer under YES if available)
  useEffect(() => {
    const placeInitial = () => {
      const c = containerRef.current
      const b = btnRef.current
      const yb = yesRef?.current
      if (!c || !b) return
      // use the actual positioning parent (should be .no-button-container) for coordinates
      const parent = b.parentElement ?? c
      const pr = parent.getBoundingClientRect()
      const br = b.getBoundingClientRect()
      const margin = 14
      const maxX = Math.max(margin, pr.width - br.width - margin)
      const maxY = Math.max(margin, pr.height - br.height - margin)

      if (yb) {
        const yr = yb.getBoundingClientRect()
        // center NO under YES button relative to parent
        let x = Math.round(yr.left + yr.width / 2 - pr.left - br.width / 2)
        x = Math.max(margin, Math.min(maxX, x))
        // place slightly below yes button
        let y = Math.round(yr.bottom - pr.top + 10)
        // don't overflow bottom; if it would, place above YES but still visible
        if (y > maxY) {
          y = Math.max(margin, Math.round(yr.top - pr.top - br.height - 10))
        }
        // final clamp
        y = Math.max(margin, Math.min(maxY, y))
        // keep the button centered in normal flow initially; transforms will move it when it escapes
        setPos({ x: 0, y: 0 })
        return
      }

      // fallback to bottom-right-ish within parent (keep 0,0 so element stays centered)
      setPos({ x: 0, y: 0 })
    }
    // run placement in the next animation frame to avoid updating parent during render
    let raf = 0
    raf = requestAnimationFrame(() => placeInitial())
    // reposition on resize
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => placeInitial())
    }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf) }
  }, [containerRef, yesRef])

  // helper to pick a new random safe position
  const pickNewPosition = () => {
    const c = containerRef.current
    const b = btnRef.current
    const yb = yesRef?.current
    if (!c || !b) return { x: 0, y: 0 }
    // use parent positioning element
    const parent = b.parentElement ?? c
    const pr = parent.getBoundingClientRect()
    const br = b.getBoundingClientRect()
    const margin = 12
    const maxLeft = Math.max(0, pr.width - br.width - margin)
    const maxTop = Math.max(0, pr.height - br.height - margin)
    const yesCenter = yb ? (() => {
      const yr = yb.getBoundingClientRect(); return { x: yr.left + yr.width / 2 - pr.left, y: yr.top + yr.height / 2 - pr.top }
    })() : null

    // current top-left of button relative to parent
    const curLeft = Math.round(br.left - pr.left)
    const curTop = Math.round(br.top - pr.top)

    const minDistance = 100
    for (let i = 0; i < 36; i++) {
      let targetLeft = Math.floor(Math.random() * (maxLeft - margin + 1)) + margin
      let targetTop = Math.floor(Math.random() * (maxTop - margin + 1)) + margin
      if (yesCenter) {
        const dx = targetLeft + br.width / 2 - yesCenter.x
        const dy = targetTop + br.height / 2 - yesCenter.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= minDistance) continue
      }
      // ensure movement in both axes: if too small, nudge the target
      if (Math.abs(targetLeft - curLeft) < 28) {
        const shift = 28 + Math.floor(Math.random() * 36)
        targetLeft = Math.max(margin, Math.min(maxLeft, targetLeft + (Math.random() > 0.5 ? shift : -shift)))
      }
      if (Math.abs(targetTop - curTop) < 28) {
        const shift = 28 + Math.floor(Math.random() * 36)
        targetTop = Math.max(margin, Math.min(maxTop, targetTop + (Math.random() > 0.5 ? shift : -shift)))
      }
      // compute delta relative to current position so Framer Motion translate moves correctly
      let deltaX = targetLeft - curLeft
      let deltaY = targetTop - curTop
      // ensure final left/top are within bounds
      let newLeft = curLeft + deltaX
      let newTop = curTop + deltaY
      newLeft = Math.max(margin, Math.min(maxLeft, newLeft))
      newTop = Math.max(margin, Math.min(maxTop, newTop))
      deltaX = newLeft - curLeft
      deltaY = newTop - curTop
      return { x: deltaX, y: deltaY }
    }

    // fallback: pick a random delta within small range
    const fallbackX = Math.max(-curLeft + margin, Math.min(maxLeft - curLeft, Math.floor(maxLeft / 2) - curLeft))
    const fallbackY = Math.max(-curTop + margin, Math.min(maxTop - curTop, Math.floor(maxTop / 2) - curTop))
    return { x: fallbackX, y: fallbackY }
  }

  const escape = () => {
    if (cooldown.current) return
    cooldown.current = true
    // randomized cooldown so it doesn't feel robotic
    const cd = 250 + Math.floor(Math.random() * 220)
    setTimeout(() => { cooldown.current = false }, cd)
    const newPos = pickNewPosition()
    const nextLabel = messages[Math.floor(Math.random() * messages.length)]
    setLabel(nextLabel)
    setAttempts((a) => {
      const na = a + 1
      // schedule parent update asynchronously to avoid setState in render phase of other components
      setTimeout(() => { onAttempt?.(na) }, 0)
      return na
    })
    // set a small randomized rotation for this move
    setRot((Math.random() - 0.5) * 10)
    // small random scale animation is handled in animate prop
    setPos(newPos)
  }

  // pointer proximity handling - use RAF throttling
  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    let raf = 0
    const handler = (ev: PointerEvent) => {
      if (!btnRef.current) return
      if (cooldown.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const crect = c.getBoundingClientRect()
        const brect = btnRef.current!.getBoundingClientRect()
        const bx = brect.left + brect.width / 2
        const by = brect.top + brect.height / 2
        const dx = ev.clientX - bx
        const dy = ev.clientY - by
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 110) {
          // very close -> escape
          escape()
        } else if (dist < 180) {
          // nervous: small jitter
          btnRef.current!.classList.add('no-button--nervous')
          setTimeout(() => btnRef.current && btnRef.current.classList.remove('no-button--nervous'), 260)
        }
      })
    }
    c.addEventListener('pointermove', handler)
    return () => { c.removeEventListener('pointermove', handler); cancelAnimationFrame(raf) }
  }, [containerRef])

  // touchstart should force escape
  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    const tHandler = (ev: TouchEvent) => {
      const touch = ev.touches[0]
      if (!touch) return
      // if the touch is near the button, escape
      if (!btnRef.current) return
      const brect = btnRef.current.getBoundingClientRect()
      const distX = Math.abs(touch.clientX - (brect.left + brect.width / 2))
      const distY = Math.abs(touch.clientY - (brect.top + brect.height / 2))
      const dist = Math.sqrt(distX * distX + distY * distY)
      if (dist < 160) {
        ev.preventDefault()
        escape()
      }
    }
    c.addEventListener('touchstart', tHandler, { passive: false })
    return () => c.removeEventListener('touchstart', tHandler)
  }, [containerRef])

  return (
    <motion.button
      ref={btnRef}
      className="no-button"
      type="button"
      onPointerEnter={() => escape()}
      onPointerDown={(e) => { e.preventDefault(); escape() }}
      onClick={(e) => { e.preventDefault(); /* never allow click */ }}
      initial={false}
      animate={{ x: pos.x, y: pos.y, rotate: rot, scale: [1, 0.88, 1] }}
      transition={{ duration: 0.25 + Math.random() * 0.2, ease: [0.22, 0.9, 0.27, 1.1] }}
    >
      <span className="no-button-label">{label}</span>
    </motion.button>
  )
}
