import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { HologramMaterial, type HologramMaterialType } from './hologram-material'

// Register shader material - HologramMaterial calls extend() on import
void HologramMaterial

interface HologramPlaneProps {
  position: [number, number, number]
  color?: string
  size?: [number, number]
  opacity?: number
}

// Validate and clamp opacity to safe range
const clampOpacity = (value: number): number => Math.max(0, Math.min(1, value))

export function HologramPlane({
  position,
  color = '#00ffff',
  size = [1, 0.6],
  opacity = 0.6
}: HologramPlaneProps) {
  const materialRef = useRef<HologramMaterialType>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  // Memoize validated color to prevent recreation each render
  const validatedColor = useMemo(() => {
    const c = new THREE.Color(color)
    c.r = Math.max(0, Math.min(1, c.r))
    c.g = Math.max(0, Math.min(1, c.g))
    c.b = Math.max(0, Math.min(1, c.b))
    return c
  }, [color])

  const validatedOpacity = useMemo(() => clampOpacity(opacity), [opacity])

  // Animate shader time uniform
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime()
    }
  })

  // Cleanup geometry and material on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry?.dispose()
        if (meshRef.current.material instanceof THREE.Material) {
          meshRef.current.material.dispose()
        }
      }
    }
  }, [])

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={size} />
      {/* @ts-expect-error - Custom shader material registered via extend() */}
      <hologramMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        uColor={validatedColor}
        uOpacity={validatedOpacity}
      />
    </mesh>
  )
}
