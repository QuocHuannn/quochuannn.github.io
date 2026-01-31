import { BentoCard } from '@/components/ui/bento-card'
import { profile } from '@/data/portfolio-data'

export function ContactSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Contact</h2>

        <div className="bento-grid">
          <BentoCard colSpan={2} className="md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-blue)]/20 flex items-center justify-center">
                <span className="text-[var(--color-accent-blue)]">@</span>
              </div>
              <div>
                <p className="text-[var(--color-muted)] text-sm">Email</p>
                <a href={`mailto:${profile.email}`} className="hover:text-[var(--color-primary)] transition-colors">
                  {profile.email}
                </a>
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={2} className="md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-green)]/20 flex items-center justify-center">
                <span className="text-[var(--color-accent-green)]">#</span>
              </div>
              <div>
                <p className="text-[var(--color-muted)] text-sm">Phone</p>
                <a href={`tel:${profile.phone}`} className="hover:text-[var(--color-primary)] transition-colors">
                  {profile.phone}
                </a>
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={2} className="md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-purple)]/20 flex items-center justify-center">
                <span className="text-[var(--color-accent-purple)]">*</span>
              </div>
              <div>
                <p className="text-[var(--color-muted)] text-sm">Location</p>
                <p>{profile.location}</p>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  )
}
