import { skills } from '@/data/portfolio-data'

interface SkillsOverlayProps {
  category: string
}

// Static class mappings for Tailwind extraction
const CATEGORY_STYLES: Record<string, {
  container: string
  title: string
  tag: string
}> = {
  '3D & Creative': {
    container: 'border-cyan-500/30',
    title: 'text-cyan-400',
    tag: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  'Frontend': {
    container: 'border-blue-500/30',
    title: 'text-blue-400',
    tag: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  'Backend': {
    container: 'border-green-500/30',
    title: 'text-green-400',
    tag: 'bg-green-500/20 text-green-300 border-green-500/30',
  },
  'Tools': {
    container: 'border-purple-500/30',
    title: 'text-purple-400',
    tag: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
}

// Default fallback style
const DEFAULT_STYLE = CATEGORY_STYLES['3D & Creative']

export function SkillsOverlay({ category }: SkillsOverlayProps) {
  const skillData = skills.find(s => s.title === category)
  const styles = CATEGORY_STYLES[category] || DEFAULT_STYLE

  if (!skillData) return null

  return (
    <div className={`bg-gray-900/90 border rounded-lg p-6 max-w-md ${styles.container}`}>
      <h2 className={`text-2xl font-bold mb-4 ${styles.title}`}>{category}</h2>
      <div className="flex flex-wrap gap-2">
        {skillData.items.map((skill) => (
          <span
            key={skill}
            className={`px-3 py-1 rounded-full text-sm border ${styles.tag}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
