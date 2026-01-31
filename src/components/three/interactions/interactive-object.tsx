import { type ReactNode } from 'react'
import { useInteractionState, type InteractionTarget } from '@/hooks/use-interaction-state'

interface InteractiveObjectProps {
  children: ReactNode
  target: InteractionTarget
  hoverOnly?: boolean
  externalLink?: string
}

export function InteractiveObject({
  children,
  target,
  hoverOnly = false,
  externalLink,
}: InteractiveObjectProps) {
  const { setActiveTarget, setHoveredTarget } = useInteractionState()

  const handleClick = () => {
    if (externalLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer')
      return
    }
    if (!hoverOnly) {
      setActiveTarget(target)
    }
  }

  const handlePointerOver = () => {
    setHoveredTarget(target)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHoveredTarget('none')
    document.body.style.cursor = 'default'
  }

  return (
    <group
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children}
    </group>
  )
}
