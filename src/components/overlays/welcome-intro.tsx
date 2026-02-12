import { useState, useEffect, useCallback, useRef } from 'react'

const BOOT_LINES = [
  { text: '> initializing workspace...', delay: 0 },
  { text: '> loading modules... [OK]', delay: 800 },
  { text: '> establishing connection... [OK]', delay: 1600 },
  { text: '', delay: 2200 },
]

const NAME_DELAY = 2400
const TITLE_DELAY = 3000
const CTA_DELAY = 3600

export function WelcomeIntro() {
  const [visible, setVisible] = useState(true)
  const [animatingOut, setAnimatingOut] = useState(false)
  const [visibleLines, setVisibleLines] = useState(0)
  const [showName, setShowName] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showCta, setShowCta] = useState(false)
  const dismissedRef = useRef(false)

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setAnimatingOut(true)
    setTimeout(() => setVisible(false), 500)
  }, [])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay))
    })

    timers.push(setTimeout(() => setShowName(true), NAME_DELAY))
    timers.push(setTimeout(() => setShowTitle(true), TITLE_DELAY))
    timers.push(setTimeout(() => setShowCta(true), CTA_DELAY))
    timers.push(setTimeout(handleDismiss, 12000))

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss()
    }
    window.addEventListener('keydown', handleEscape)

    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [handleDismiss])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0806] transition-opacity duration-500 ${
        animatingOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleDismiss}
    >
      <div className="max-w-md mx-4 font-mono">
        {/* Boot lines */}
        <div className="space-y-1 mb-6">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <p key={i} className="text-amber-400/80 text-sm">{line.text}</p>
          ))}
        </div>

        {/* Name */}
        {showName && (
          <h1 className="text-3xl font-bold text-white mb-1 transition-opacity duration-300">
            {'> '}Truong Quoc Huan
          </h1>
        )}

        {/* Title */}
        {showTitle && (
          <p className="text-amber-400 text-lg mb-8 transition-opacity duration-300">
            {'> '}Fullstack Developer
          </p>
        )}

        {/* CTA */}
        {showCta && (
          <p className="text-gray-500 text-sm animate-pulse">
            [Click anywhere to enter]
          </p>
        )}
      </div>
    </div>
  )
}
