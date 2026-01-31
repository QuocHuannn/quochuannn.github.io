import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useInteractionState } from '@/hooks/use-interaction-state'
import { SkillsOverlay } from './skills-overlay'
import { ContactOverlay } from './contact-overlay'
import { OverlayBackdrop } from './overlay-backdrop'

export function OverlayPortal() {
  const { activeTarget, closeOverlay } = useInteractionState()

  if (activeTarget === 'none') return null

  const renderOverlay = () => {
    switch (activeTarget) {
      case 'skills-3d':
        return <SkillsOverlay category="3D & Creative" />
      case 'skills-frontend':
        return <SkillsOverlay category="Frontend" />
      case 'skills-backend':
        return <SkillsOverlay category="Backend" />
      case 'skills-tools':
        return <SkillsOverlay category="Tools" />
      case 'contact':
        return <ContactOverlay />
      default:
        return null
    }
  }

  return createPortal(
    <AnimatePresence>
      <OverlayBackdrop onClose={closeOverlay}>
        {renderOverlay()}
      </OverlayBackdrop>
    </AnimatePresence>,
    document.body
  )
}
