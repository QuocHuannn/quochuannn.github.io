import { type SkillItem } from '@/data/portfolio-data'
import { skills } from '@/data/portfolio-data'

const DEVICON_CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const CATEGORY_COLORS: Record<string, { heading: string; bg: string; border: string }> = {
  '3D & Creative': { heading: 'text-amber-400', bg: 'bg-amber-500/8', border: 'border-amber-500/15' },
  Frontend: { heading: 'text-sky-400', bg: 'bg-sky-500/8', border: 'border-sky-500/15' },
  Backend: { heading: 'text-emerald-400', bg: 'bg-emerald-500/8', border: 'border-emerald-500/15' },
  Tools: { heading: 'text-violet-400', bg: 'bg-violet-500/8', border: 'border-violet-500/15' },
}

const DEFAULT_COLORS = CATEGORY_COLORS['3D & Creative']

function SkillCard({ skill, colors }: { skill: SkillItem; colors: typeof DEFAULT_COLORS }) {
  const iconUrl = skill.icon ? `${DEVICON_CDN}/${skill.icon}/${skill.icon}-original.svg` : null

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl ${colors.bg} border ${colors.border} hover:bg-white/5 transition-colors`}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={skill.name}
          className="w-9 h-9 object-contain"
          loading="lazy"
        />
      ) : (
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-[#a89080] text-xs font-bold">
          {skill.name.slice(0, 2)}
        </div>
      )}
      <span className="text-[10px] text-[#d4c4b0] text-center leading-tight truncate w-full">
        {skill.name}
      </span>
    </div>
  )
}

export function SkillsOverlay() {
  return (
    <div className="bg-[rgba(30,22,15,0.92)] backdrop-blur-2xl border border-[rgba(255,170,68,0.12)] rounded-2xl p-6 max-w-lg w-full mx-4 shadow-[0_0_40px_rgba(255,170,68,0.08)]">
      <h2 className="text-2xl font-bold text-amber-400 mb-5">Skills</h2>
      <div className="space-y-5">
        {skills.map((category) => {
          const colors = CATEGORY_COLORS[category.title] ?? DEFAULT_COLORS
          return (
            <div key={category.title}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2.5 ${colors.heading}`}>
                {category.title}
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {category.items.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} colors={colors} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
