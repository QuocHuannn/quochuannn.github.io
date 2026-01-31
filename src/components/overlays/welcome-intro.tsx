import { useState, useEffect } from 'react'
import { profile } from '@/data/portfolio-data'

export function WelcomeIntro() {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  // Auto-hide after delay or on click
  const handleDismiss = () => {
    setIsAnimatingOut(true)
    setTimeout(() => setIsVisible(false), 500)
  }

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(handleDismiss, 10000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050510]/80 backdrop-blur-sm transition-opacity duration-500 ${
        isAnimatingOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`max-w-md mx-4 text-center transform transition-all duration-500 ${
          isAnimatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon border effect */}
        <div className="relative p-8 bg-gray-900/90 rounded-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
          {/* Avatar/Logo */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)]">
            <span className="text-3xl font-bold text-white">{profile.name.charAt(0)}</span>
          </div>

          {/* Name & Title */}
          <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
          <p className="text-cyan-400 mb-6">{profile.title}</p>

          {/* Instructions */}
          <div className="space-y-3 text-gray-300 text-sm mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Click các monitor để xem Skills</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Hover hologram để xem thêm</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Click cốc cà phê để Contact</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <span>Click avatar để say hi!</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleDismiss}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-white font-medium hover:from-cyan-400 hover:to-purple-500 transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]"
          >
            Bắt đầu khám phá
          </button>

          {/* Hint */}
          <p className="mt-4 text-gray-500 text-xs">Click anywhere to dismiss</p>
        </div>
      </div>
    </div>
  )
}
