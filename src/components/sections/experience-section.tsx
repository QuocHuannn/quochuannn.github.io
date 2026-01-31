import { BentoCard } from '@/components/ui/bento-card'
import { Badge } from '@/components/ui/badge'
import { experiences } from '@/data/portfolio-data'

export function ExperienceSection() {
  return (
    <section className="py-20 px-4 bg-[var(--color-card)]/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Experience</h2>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <BentoCard key={index} className="col-span-full">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{exp.title}</h3>
                  <p className="text-[var(--color-primary)]">{exp.company}</p>
                  <p className="text-[var(--color-muted)] text-sm mt-1">{exp.period}</p>
                  <p className="text-[var(--color-muted)] mt-3">{exp.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} variant="blue">{tech}</Badge>
                  ))}
                </div>
              </div>
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  )
}
