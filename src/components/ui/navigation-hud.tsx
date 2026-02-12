import { useInteractionState, type InteractionTarget } from '@/hooks/use-interaction-state'

const NAV_ITEMS: { label: string; target: InteractionTarget; color: string }[] = [
  { label: 'About', target: 'about', color: 'hover:text-amber-400 hover:border-amber-500/40' },
  { label: 'Skills', target: 'skills', color: 'hover:text-sky-400 hover:border-sky-500/40' },
  { label: 'Projects', target: 'projects', color: 'hover:text-emerald-400 hover:border-emerald-500/40' },
  { label: 'Contact', target: 'contact', color: 'hover:text-rose-400 hover:border-rose-500/40' },
]

export function NavigationHud() {
  const { setActiveTarget, activeTarget } = useInteractionState()

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex gap-2 px-4 py-2 bg-[rgba(30,22,15,0.85)] backdrop-blur-xl border border-[rgba(255,170,68,0.15)] rounded-full">
        {NAV_ITEMS.map(({ label, target, color }) => (
          <button
            key={target}
            onClick={() => setActiveTarget(target)}
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
      </div>
    </nav>
  )
}
