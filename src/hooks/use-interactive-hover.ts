import { useState, useCallback, useEffect } from 'react'
import type { ThreeEvent } from '@react-three/fiber'

interface UseInteractiveHoverOptions {
  onHoverChange?: (hovered: boolean) => void
}

export function useInteractiveHover(options?: UseInteractiveHoverOptions) {
  const [hovered, setHovered] = useState(false)

  // Reset cursor on unmount to prevent cursor leak
  useEffect(() => {
    return () => { document.body.style.cursor = 'default' }
  }, [])

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
    options?.onHoverChange?.(true)
  }, [options])

  const onPointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'default'
    options?.onHoverChange?.(false)
  }, [options])

  return { hovered, onPointerOver, onPointerOut }
}
