import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useInteractionState } from '@/hooks/use-interaction-state'
import { AboutOverlay } from './about-overlay'
import { SkillsOverlay } from './skills-overlay'
import { ProjectsOverlay } from './projects-overlay'
import { ContactOverlay } from './contact-overlay'
import { OverlayBackdrop } from './overlay-backdrop'

function renderOverlay(target: string) {
  switch (target) {
    case 'about':
      return <AboutOverlay />
    case 'skills':
      return <SkillsOverlay />
    case 'projects':
      return <ProjectsOverlay />
    case 'contact':
      return <ContactOverlay />
    default:
      return null
  }
}

export function OverlayPortal() {
  const { activeTarget, closeOverlay } = useInteractionState()

  const content = renderOverlay(activeTarget)

  return createPortal(
    <AnimatePresence>
      {content && (
        <OverlayBackdrop key={activeTarget} onClose={closeOverlay} label={`${activeTarget} overlay`}>
          {content}
        </OverlayBackdrop>
      )}
    </AnimatePresence>,
    document.body
  )
}
