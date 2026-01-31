import { CameraRig } from './camera-rig'
import { Lighting } from './lighting'
import { PostProcessing } from './effects/post-processing'
import { HologramPlane } from './effects/hologram-plane'
import { useDeviceCapability } from '@/hooks/use-device-capability'
import { NEON_COLORS } from './materials/neon-material'

export function Scene() {
  const { quality } = useDeviceCapability()

  return (
    <>
      <CameraRig />
      <Lighting />

      {/* Placeholder desk platform */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[3, 0.5, 2]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Neon accent on desk edge */}
      <mesh position={[0, 0.01, 1]}>
        <boxGeometry args={[3, 0.02, 0.05]} />
        <meshStandardMaterial
          color={NEON_COLORS.cyan}
          emissive={NEON_COLORS.cyan}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Holographic skill displays */}
      <HologramPlane position={[0.8, 1.5, 0]} color={NEON_COLORS.cyan} />
      <HologramPlane position={[-0.8, 1.5, 0]} color={NEON_COLORS.magenta} />

      {/* Post-processing - must be last */}
      <PostProcessing quality={quality} />
    </>
  )
}
