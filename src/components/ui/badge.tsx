import { cn } from '@/lib/classname-utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'blue' | 'green' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-[var(--color-border)] text-[var(--color-foreground)]',
        variant === 'blue' && 'bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)]',
        variant === 'green' && 'bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]',
        variant === 'purple' && 'bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)]',
        className
      )}
    >
      {children}
    </span>
  )
}
