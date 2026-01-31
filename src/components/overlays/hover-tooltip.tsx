import { useInteractionState } from '@/hooks/use-interaction-state'
import { skills } from '@/data/portfolio-data'

// Map interaction targets to skill categories
const TARGET_TO_CATEGORY: Record<string, string> = {
  'skills-3d': '3D & Creative',
  'skills-frontend': 'Frontend',
  'skills-backend': 'Backend',
  'skills-tools': 'Tools',
}

export function HoverTooltip() {
  const { hoveredTarget } = useInteractionState()

  // Only show for hover-only targets (holograms)
  if (!hoveredTarget.startsWith('skills-')) return null

  const category = TARGET_TO_CATEGORY[hoveredTarget]
  if (!category) return null

  const skillData = skills.find(s => s.title === category)
  if (!skillData) return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="bg-gray-900/90 border border-cyan-500/30 rounded-lg px-4 py-2">
        <span className="text-cyan-400 font-medium">{category}: </span>
        <span className="text-gray-300">
          {skillData.items.slice(0, 4).join(', ')}
          {skillData.items.length > 4 && '...'}
        </span>
      </div>
    </div>
  )
}
