import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDeviceCapability } from '@/hooks/use-device-capability'

const DARK_BG = '#0a1628'

export function Lighting() {
  const { quality } = useDeviceCapability()
  const lampLightRef = useRef<THREE.PointLight>(null)

  const shadowMapSize = quality === 'high' ? 1024 : quality === 'medium' ? 512 : 512

  // Subtle lamp flicker animation with more variation
  useFrame(({ clock }) => {
    if (lampLightRef.current) {
      const t = clock.elapsedTime
      const flicker =
        Math.sin(t * 10) * 0.1 +
        Math.sin(t * 23) * 0.05 +
        Math.sin(t * 3.7) * 0.08 +
        0.85
      lampLightRef.current.intensity = 1.0 * flicker
    }
  })

  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.45} color="#ffecd2" />

      {/* Main directional light - dramatic angle from window */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.4}
        color="#ffd7a1"
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-2}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-bias={-0.0001}
      />

      {/* Desk lamp warm point light */}
      <pointLight
        ref={lampLightRef}
        position={[1.5, 1.8, -1.5]}
        intensity={0.8}
        color="#ff9d6e"
        distance={4}
        decay={2}
      />

      {/* Window SpotLight - motivated daylight */}
      <spotLight
        position={[-0.5, 2.5, -2.5]}
        target-position={[0, 1, 0]}
        color="#ffeedd"
        intensity={0.8}
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={8}
        decay={2}
      />

      {/* Warm fill light from camera direction */}
      <pointLight
        position={[4, 3, 4]}
        intensity={0.25}
        color="#ffd7a1"
        distance={10}
        decay={2}
      />

      {/* Deep navy background for contrast with warm room */}
      <color attach="background" args={[DARK_BG]} />

      {/* Depth fog matching background */}
      <fog attach="fog" args={['#0a1225', 10, 25]} />
    </>
  )
}
