import { useState } from 'react'
import { useInteractionState, type InteractionTarget } from '@/hooks/use-interaction-state'
import { toggleMute, isMuted } from '@/hooks/use-audio-manager'
import type { CameraPresetName } from '@/config/camera-presets'

const NAV_ITEMS: { label: string; target: InteractionTarget; preset: CameraPresetName; color: string }[] = [
  { label: 'About', target: 'about', preset: 'bed', color: 'hover:text-amber-400 hover:border-amber-500/40' },
  { label: 'Skills', target: 'skills', preset: 'bookshelf', color: 'hover:text-sky-400 hover:border-sky-500/40' },
  { label: 'Projects', target: 'projects', preset: 'desk', color: 'hover:text-emerald-400 hover:border-emerald-500/40' },
  { label: 'Contact', target: 'contact', preset: 'window', color: 'hover:text-rose-400 hover:border-rose-500/40' },
]

export function NavigationHud() {
  const { setCameraPreset, activeTarget } = useInteractionState()
  const [muted, setMuted] = useState(isMuted)

  const handleToggleMute = () => {
    const nowMuted = toggleMute()
    setMuted(nowMuted)
  }

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(30,22,15,0.85)] backdrop-blur-xl border border-[rgba(255,170,68,0.15)] rounded-full">
        {NAV_ITEMS.map(({ label, target, preset, color }) => (
          <button
            key={target}
            onClick={() => setCameraPreset(preset)}
            aria-pressed={activeTarget === target}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border border-transparent cursor-pointer ${color} ${
              activeTarget === target
                ? 'text-white bg-white/10'
                : 'text-[#a89080]'
            }`}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-4 bg-[rgba(255,170,68,0.15)]" />
        <button
          onClick={handleToggleMute}
          aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          className="p-1.5 rounded-full text-[#a89080] hover:text-amber-400 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {muted ? (
              <>
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </>
            ) : (
              <>
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 010 14.14" />
                <path d="M15.54 8.46a5 5 0 010 7.07" />
              </>
            )}
          </svg>
        </button>
      </div>
    </nav>
  )
}
