import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDeviceCapability } from '@/hooks/use-device-capability'

const WARM_BG = '#0a0806'

export function Lighting() {
  const { quality } = useDeviceCapability()
  const lampLightRef = useRef<THREE.PointLight>(null)

  const shadowMapSize = quality === 'high' ? 1024 : quality === 'medium' ? 512 : 512

  // Subtle lamp flicker animation
  useFrame(({ clock }) => {
    if (lampLightRef.current) {
      const flicker = Math.sin(clock.elapsedTime * 10) * 0.1 + 0.9
      lampLightRef.current.intensity = 0.8 * flicker
    }
  })

  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.3} color="#ffd7a1" />

      {/* Main directional light - shadow caster (motivated by window) */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.5}
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

      {/* Cool accent from window side */}
      <pointLight
        position={[-2, 2, -1.5]}
        intensity={0.5}
        color="#87ceeb"
        distance={5}
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

      {/* Dark warm background */}
      <color attach="background" args={[WARM_BG]} />

      {/* Warm fog for depth */}
      <fog attach="fog" args={['#1a1a2e', 8, 20]} />
    </>
  )
}
