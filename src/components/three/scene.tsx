import { CameraRig } from './camera-rig'
import { Lighting } from './lighting'
import { PostProcessing } from './effects/post-processing'
import { HologramPlane } from './effects/hologram-plane'
import { InteractiveObject } from './interactions/interactive-object'
import { RoomModel } from './room-model'
import { AvatarController } from './avatar'
import { useDeviceCapability } from '@/hooks/use-device-capability'
import { NEON_COLORS } from './materials/neon-material'
import { profile } from '@/data/portfolio-data'

export function Scene() {
  const { quality } = useDeviceCapability()

  return (
    <>
      <CameraRig />
      <Lighting />

      {/* Room environment (placeholder or loaded .glb) */}
      <RoomModel />

      {/* Avatar at desk */}
      <AvatarController position={[0, -0.2, 0.3]} />

      {/* Interactive Monitor 1 - 3D & Creative skills */}
      <InteractiveObject target="skills-3d">
        <mesh position={[-0.7, 0.5, -0.2]}>
          <boxGeometry args={[0.6, 0.4, 0.05]} />
          <meshStandardMaterial
            color="#111122"
            emissive={NEON_COLORS.cyan}
            emissiveIntensity={0.3}
            transparent
            opacity={0.1}
          />
        </mesh>
      </InteractiveObject>

      {/* Interactive Monitor 2 - Frontend skills */}
      <InteractiveObject target="skills-frontend">
        <mesh position={[0.7, 0.5, -0.2]}>
          <boxGeometry args={[0.6, 0.4, 0.05]} />
          <meshStandardMaterial
            color="#111122"
            emissive={NEON_COLORS.purple}
            emissiveIntensity={0.3}
            transparent
            opacity={0.1}
          />
        </mesh>
      </InteractiveObject>

      {/* Holographic Backend skills (hover only) */}
      <InteractiveObject target="skills-backend" hoverOnly>
        <HologramPlane position={[0.8, 1.2, 0]} color={NEON_COLORS.green} />
      </InteractiveObject>

      {/* Holographic Tools skills (hover only) */}
      <InteractiveObject target="skills-tools" hoverOnly>
        <HologramPlane position={[-0.8, 1.2, 0]} color={NEON_COLORS.magenta} />
      </InteractiveObject>

      {/* Coffee mug - Contact trigger */}
      <InteractiveObject target="contact">
        <mesh position={[1, -0.13, 0.4]}>
          <cylinderGeometry args={[0.08, 0.06, 0.15, 16]} />
          <meshStandardMaterial color="#2a2a3e" transparent opacity={0.1} />
        </mesh>
      </InteractiveObject>

      {/* Neon GitHub sign */}
      <InteractiveObject target="none" externalLink={profile.social.github}>
        <mesh position={[-1.2, 1.8, -1.8]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.35, 0.12, 0.02]} />
          <meshStandardMaterial
            color={NEON_COLORS.cyan}
            emissive={NEON_COLORS.cyan}
            emissiveIntensity={2}
            toneMapped={false}
            transparent
            opacity={0.1}
          />
        </mesh>
      </InteractiveObject>

      {/* Neon LinkedIn sign */}
      <InteractiveObject target="none" externalLink={profile.social.linkedin}>
        <mesh position={[1.2, 1.8, -1.8]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.35, 0.12, 0.02]} />
          <meshStandardMaterial
            color={NEON_COLORS.purple}
            emissive={NEON_COLORS.purple}
            emissiveIntensity={2}
            toneMapped={false}
            transparent
            opacity={0.1}
          />
        </mesh>
      </InteractiveObject>

      {/* Post-processing - must be last */}
      <PostProcessing quality={quality} />
    </>
  )
}
