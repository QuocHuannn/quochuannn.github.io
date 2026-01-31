import { useState, useCallback, useEffect, useRef } from 'react'
import { AvatarModel, AvatarAnimation } from './avatar-model'

// Animation timing constants (ms)
const WAVE_ANIMATION_DURATION_MS = 2000
const ANIMATION_FADE_DURATION_MS = 300

interface AvatarControllerProps {
  position?: [number, number, number]
}

/**
 * Avatar Controller - manages animation state machine for the avatar
 *
 * State transitions:
 * - Idle → Wave (on click) → Idle (after WAVE_ANIMATION_DURATION_MS)
 * - Idle → Typing (future: on monitor hover)
 */
export function AvatarController({ position = [0, 0, -0.5] }: AvatarControllerProps) {
  const [currentAnimation, setCurrentAnimation] = useState<AvatarAnimation>('Idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleClick = useCallback(() => {
    // Only trigger wave if currently idle
    if (currentAnimation === 'Idle') {
      setCurrentAnimation('Wave')

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Return to idle after wave animation completes
      timeoutRef.current = setTimeout(() => {
        setCurrentAnimation('Idle')
      }, WAVE_ANIMATION_DURATION_MS)
    }
  }, [currentAnimation])

  return (
    <AvatarModel
      animation={currentAnimation}
      position={position}
      rotation={[0, Math.PI * 0.1, 0]} // Slightly rotated toward camera
      scale={1}
      onClick={handleClick}
    />
  )
}

// Export constants for testing/documentation
export { WAVE_ANIMATION_DURATION_MS, ANIMATION_FADE_DURATION_MS }
