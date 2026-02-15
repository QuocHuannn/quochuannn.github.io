import { useState, useCallback, useEffect, useRef } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { playSound } from './use-audio-manager'

const DRAG_THRESHOLD = 5

interface UseInteractiveHoverOptions {
  onHoverChange?: (hovered: boolean) => void
}

export function useInteractiveHover(options?: UseInteractiveHoverOptions) {
  const [hovered, setHovered] = useState(false)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    return () => { document.body.style.cursor = 'default' }
  }, [])

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
    playSound('hover')
    options?.onHoverChange?.(true)
  }, [options])

  const onPointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'default'
    options?.onHoverChange?.(false)
  }, [options])

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    pointerStart.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
  }, [])

  /** Returns true if the click was a genuine click (not a drag) */
  const isClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    if (!pointerStart.current) return true
    const dx = e.nativeEvent.clientX - pointerStart.current.x
    const dy = e.nativeEvent.clientY - pointerStart.current.y
    pointerStart.current = null
    return Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD
  }, [])

  return { hovered, onPointerOver, onPointerOut, onPointerDown, isClick }
}
