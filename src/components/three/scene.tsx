import { CameraRig } from './camera-rig'
import { Lighting } from './lighting'
import { PostProcessing } from './effects/post-processing'
import { HologramPlane } from './effects/hologram-plane'
import { InteractiveObject } from './interactions/interactive-object'
import { useDeviceCapability } from '@/hooks/use-device-capability'
import { NEON_COLORS } from './materials/neon-material'
import { profile } from '@/data/portfolio-data'

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

      {/* Interactive Monitor 1 - 3D & Creative skills */}
      <InteractiveObject target="skills-3d">
        <mesh position={[-0.8, 0.8, -0.3]}>
          <boxGeometry args={[0.8, 0.5, 0.05]} />
          <meshStandardMaterial
            color="#111122"
            emissive={NEON_COLORS.cyan}
            emissiveIntensity={0.3}
          />
        </mesh>
      </InteractiveObject>

      {/* Interactive Monitor 2 - Frontend skills */}
      <InteractiveObject target="skills-frontend">
        <mesh position={[0.8, 0.8, -0.3]}>
          <boxGeometry args={[0.8, 0.5, 0.05]} />
          <meshStandardMaterial
            color="#111122"
            emissive={NEON_COLORS.purple}
            emissiveIntensity={0.3}
          />
        </mesh>
      </InteractiveObject>

      {/* Holographic Backend skills (hover only) */}
      <InteractiveObject target="skills-backend" hoverOnly>
        <HologramPlane position={[0.8, 1.5, 0]} color={NEON_COLORS.green} />
      </InteractiveObject>

      {/* Holographic Tools skills (hover only) */}
      <InteractiveObject target="skills-tools" hoverOnly>
        <HologramPlane position={[-0.8, 1.5, 0]} color={NEON_COLORS.magenta} />
      </InteractiveObject>

      {/* Coffee mug - Contact trigger */}
      <InteractiveObject target="contact">
        <mesh position={[1.2, 0.15, 0.5]}>
          <cylinderGeometry args={[0.08, 0.06, 0.15, 16]} />
          <meshStandardMaterial color="#2a2a3e" />
        </mesh>
      </InteractiveObject>

      {/* Neon GitHub sign */}
      <InteractiveObject target="none" externalLink={profile.social.github}>
        <mesh position={[-1.4, 1.2, -0.9]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.4, 0.15, 0.02]} />
          <meshStandardMaterial
            color={NEON_COLORS.cyan}
            emissive={NEON_COLORS.cyan}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </InteractiveObject>

      {/* Neon LinkedIn sign */}
      <InteractiveObject target="none" externalLink={profile.social.linkedin}>
        <mesh position={[1.4, 1.2, -0.9]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.4, 0.15, 0.02]} />
          <meshStandardMaterial
            color={NEON_COLORS.purple}
            emissive={NEON_COLORS.purple}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </InteractiveObject>

      {/* Post-processing - must be last */}
      <PostProcessing quality={quality} />
    </>
  )
}
