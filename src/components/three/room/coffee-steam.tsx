import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 25

export function CoffeeSteam({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null)
  const velocities = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3))
  const lifetimes = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT))

  useEffect(() => {
    if (!pointsRef.current) return

    const positions = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      resetParticle(i, positions, velocities.current, lifetimes.current)
    }

    pointsRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return

    const posAttr = pointsRef.current.geometry.attributes.position
    if (!posAttr) return
    const positions = posAttr.array as Float32Array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      lifetimes.current[i] -= delta

      if (lifetimes.current[i] <= 0) {
        resetParticle(i, positions, velocities.current, lifetimes.current)
      } else {
        positions[i3] += velocities.current[i3] * delta
        positions[i3 + 1] += velocities.current[i3 + 1] * delta
        positions[i3 + 2] += velocities.current[i3 + 2] * delta

        // Slow down and spread
        velocities.current[i3] *= 0.98
        velocities.current[i3 + 1] *= 0.98
        velocities.current[i3 + 2] *= 0.98
      }
    }

    posAttr.needsUpdate = true
  })

  function resetParticle(
    index: number,
    positions: Float32Array,
    vels: Float32Array,
    lives: Float32Array
  ) {
    const i3 = index * 3

    positions[i3] = position[0] + (Math.random() - 0.5) * 0.03
    positions[i3 + 1] = position[1]
    positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.03

    vels[i3] = (Math.random() - 0.5) * 0.08
    vels[i3 + 1] = 0.15 + Math.random() * 0.08
    vels[i3 + 2] = (Math.random() - 0.5) * 0.08

    lives[index] = 1.5 + Math.random() * 2
  }

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry />
      <pointsMaterial
        size={0.02}
        color="#f5f5f5"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
