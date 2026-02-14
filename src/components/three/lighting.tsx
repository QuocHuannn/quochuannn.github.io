import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDeviceCapability } from '@/hooks/use-device-capability'

const DARK_BG = '#080604'

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
      lampLightRef.current.intensity = 0.8 * flicker
    }
  })

  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.3} color="#ffe4c4" />

      {/* Main directional light - dramatic angle from window */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.8}
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

      {/* Blue moonlight from window direction */}
      <pointLight
        position={[-0.5, 2.5, -2.2]}
        intensity={0.3}
        color="#6688cc"
        distance={6}
        decay={2}
      />

      {/* Monitor glow - simulates screen bounce light */}
      <pointLight
        position={[1, 1.2, -1.2]}
        intensity={0.15}
        color="#4466aa"
        distance={2}
        decay={2}
      />

      {/* Window SpotLight - motivated daylight */}
      <spotLight
        position={[-0.5, 2.5, -2.5]}
        target-position={[0, 1, 0]}
        color="#ffffff"
        intensity={1.2}
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={8}
        decay={2}
      />

      {/* Dark warm background for more contrast */}
      <color attach="background" args={[DARK_BG]} />

      {/* Warm fog for depth */}
      <fog attach="fog" args={['#1a1510', 7, 18]} />
    </>
  )
}
