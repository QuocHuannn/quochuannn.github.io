import { motion } from 'framer-motion'
import { cn } from '@/lib/classname-utils'

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  colSpan?: 1 | 2 | 3 | 4
  rowSpan?: 1 | 2
}

export function BentoCard({ children, className, colSpan = 1, rowSpan = 1 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6',
        'hover:bg-[var(--color-card-hover)] transition-colors duration-300',
        colSpan === 2 && 'col-span-2',
        colSpan === 3 && 'col-span-3',
        colSpan === 4 && 'col-span-4',
        rowSpan === 2 && 'row-span-2',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
