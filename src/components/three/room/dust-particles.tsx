import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDeviceCapability } from '@/hooks/use-device-capability'

const SPREAD = { x: 3, y: 2.5, z: 2.5 }
const CENTER = { x: 0, y: 1.5, z: -0.5 }

export function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const { quality } = useDeviceCapability()

  const particleCount = quality === 'high' ? 80 : quality === 'medium' ? 40 : 20

  const { positionAttr, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const spd = new Float32Array(particleCount)
    const off = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = CENTER.x + (Math.random() - 0.5) * SPREAD.x
      pos[i * 3 + 1] = CENTER.y + Math.random() * SPREAD.y
      pos[i * 3 + 2] = CENTER.z + (Math.random() - 0.5) * SPREAD.z
      spd[i] = 0.0005 + Math.random() * 0.001
      off[i] = Math.random() * Math.PI * 2
    }

    return {
      positionAttr: new THREE.Float32BufferAttribute(pos, 3),
      speeds: spd,
      offsets: off,
    }
  }, [particleCount])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
    const time = clock.elapsedTime

    for (let i = 0; i < particleCount; i++) {
      // Gentle vertical drift
      let y = posAttr.getY(i) + speeds[i]
      // Horizontal drift with sin wave
      const x = posAttr.getX(i) + Math.sin(time * 0.2 + offsets[i]) * 0.0003
      const z = posAttr.getZ(i) + Math.cos(time * 0.15 + offsets[i]) * 0.0003

      // Wrap when above ceiling
      if (y > CENTER.y + SPREAD.y) {
        y = CENTER.y - 0.2
      }

      posAttr.setX(i, x)
      posAttr.setY(i, y)
      posAttr.setZ(i, z)
    }

    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} name="dust-particles">
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttr} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffebcd"
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
