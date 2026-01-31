import { useTheme } from '@/hooks/use-theme'

export function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)] transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
