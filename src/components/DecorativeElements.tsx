import { motion } from 'framer-motion'

const decorations = [
  { content: '✦', className: 'deco deco--spark deco--one' },
  { content: '♡', className: 'deco deco--heart deco--two' },
  { content: '✿', className: 'deco deco--flower deco--three' },
  { content: '↗', className: 'deco deco--arrow deco--four' },
  { content: '·', className: 'deco deco--dot deco--five' },
  { content: '♡', className: 'deco deco--heart deco--six' },
]

export function DecorativeElements() {
  return (
    <div className="decorations" aria-hidden="true">
      {decorations.map((item, index) => (
        <motion.span
          key={`${item.className}-${index}`}
          className={item.className}
          animate={{ y: [0, -7, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
        >
          {item.content}
        </motion.span>
      ))}
    </div>
  )
}
