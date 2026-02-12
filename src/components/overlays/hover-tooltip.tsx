import { useInteractionState } from '@/hooks/use-interaction-state'

export function HoverTooltip() {
  const { hoveredTarget } = useInteractionState()

  if (hoveredTarget === 'none') return null

  const labels: Record<string, string> = {
    about: 'About Me',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
  }

  const label = labels[hoveredTarget]
  if (!label) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div className="bg-[rgba(30,22,15,0.9)] border border-[rgba(255,170,68,0.2)] rounded-lg px-4 py-2">
        <span className="text-amber-400 font-medium">{label}</span>
      </div>
    </div>
  )
}
