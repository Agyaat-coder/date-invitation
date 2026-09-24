import { motion, type MotionProps } from 'framer-motion'
import React, { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type AnimatedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & MotionProps & {
  children: ReactNode
  variant?: 'primary' | 'text'
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(({ children, variant = 'primary', className = '', ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      type="button"
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 20 }}
      className={`animated-button ${variant === 'text' ? 'animated-button--text' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
})
AnimatedButton.displayName = 'AnimatedButton'
