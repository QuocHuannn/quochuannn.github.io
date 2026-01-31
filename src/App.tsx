import { ThemeToggleButton } from '@/components/ui/theme-toggle-button'
import { HeroSection } from '@/components/sections/hero-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function App() {
  return (
    <div className="min-h-screen">
      <ThemeToggleButton />
      <main>
        <HeroSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <footer className="py-8 text-center text-[var(--color-muted)] text-sm">
        <p>© 2024 Trương Quốc Huân. All rights reserved.</p>
      </footer>
    </div>
  )
}
