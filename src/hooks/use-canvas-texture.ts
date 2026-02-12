import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Base hook for creating animated canvas textures.
 * Updates at a configurable FPS to avoid impacting main render loop.
 */
export function useCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, time: number) => void,
  fps = 10
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const lastUpdate = useRef(0)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvasRef.current = canvas

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    textureRef.current = texture

    return () => {
      texture.dispose()
      textureRef.current = null
      canvasRef.current = null
    }
  }, [width, height])

  useFrame(({ clock }) => {
    if (!canvasRef.current || !textureRef.current) return

    const now = clock.elapsedTime * 1000
    const interval = 1000 / fps

    if (now - lastUpdate.current > interval) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        draw(ctx, clock.elapsedTime)
        textureRef.current.needsUpdate = true
      }
      lastUpdate.current = now
    }
  })

  return textureRef.current
}
