import { BentoCard } from '@/components/ui/bento-card'
import { Badge } from '@/components/ui/badge'
import { skills } from '@/data/portfolio-data'

const colorVariants = {
  'accent-blue': 'blue',
  'accent-green': 'green',
  'accent-purple': 'purple',
} as const

const titleColors = {
  'accent-blue': 'text-[var(--color-accent-blue)]',
  'accent-green': 'text-[var(--color-accent-green)]',
  'accent-purple': 'text-[var(--color-accent-purple)]',
} as const

export function SkillsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Skills</h2>

        <div className="bento-grid">
          {skills.map((category) => (
            <BentoCard key={category.title} colSpan={1} className="lg:col-span-1 md:col-span-1">
              <h3 className={`text-xl font-semibold mb-4 ${titleColors[category.color as keyof typeof titleColors]}`}>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <Badge
                    key={skill}
                    variant={colorVariants[category.color as keyof typeof colorVariants]}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  )
}
