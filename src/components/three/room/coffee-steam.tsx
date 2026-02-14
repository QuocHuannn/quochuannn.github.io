import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 30

export function CoffeeSteam({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null)
  const velocities = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3))
  const lifetimes = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT))
  const maxLifetimes = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT))
  const sizesRef = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT))

  useEffect(() => {
    if (!pointsRef.current) return

    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      resetParticle(i, positions, velocities.current, lifetimes.current, maxLifetimes.current)
      sizes[i] = 0.01
    }

    sizesRef.current = sizes
    pointsRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )
    pointsRef.current.geometry.setAttribute(
      'size',
      new THREE.BufferAttribute(sizes, 1)
    )
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return

    const posAttr = pointsRef.current.geometry.attributes.position
    const sizeAttr = pointsRef.current.geometry.attributes.size
    if (!posAttr || !sizeAttr) return
    const positions = posAttr.array as Float32Array
    const sizes = sizeAttr.array as Float32Array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      lifetimes.current[i] -= delta

      if (lifetimes.current[i] <= 0) {
        resetParticle(i, positions, velocities.current, lifetimes.current, maxLifetimes.current)
        sizes[i] = 0.01
      } else {
        // Swirl motion using lifetime progress
        const progress = 1 - lifetimes.current[i] / maxLifetimes.current[i]
        const swirlAngle = progress * Math.PI * 3
        const swirlRadius = 0.02 * progress

        positions[i3] += velocities.current[i3] * delta + Math.sin(swirlAngle) * swirlRadius * delta
        positions[i3 + 1] += velocities.current[i3 + 1] * delta
        positions[i3 + 2] += velocities.current[i3 + 2] * delta + Math.cos(swirlAngle) * swirlRadius * delta

        // Slow down and spread
        velocities.current[i3] *= 0.98
        velocities.current[i3 + 1] *= 0.98
        velocities.current[i3 + 2] *= 0.98

        // Size grows as particle rises
        sizes[i] = 0.01 + progress * 0.025
      }
    }

    posAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
  })

  function resetParticle(
    index: number,
    positions: Float32Array,
    vels: Float32Array,
    lives: Float32Array,
    maxLives: Float32Array
  ) {
    const i3 = index * 3

    positions[i3] = position[0] + (Math.random() - 0.5) * 0.03
    positions[i3 + 1] = position[1]
    positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.03

    vels[i3] = (Math.random() - 0.5) * 0.08
    vels[i3 + 1] = 0.15 + Math.random() * 0.08
    vels[i3 + 2] = (Math.random() - 0.5) * 0.08

    const life = 1.5 + Math.random() * 2
    lives[index] = life
    maxLives[index] = life
  }

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry />
      <pointsMaterial
        size={0.02}
        color="#fff8f0"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
