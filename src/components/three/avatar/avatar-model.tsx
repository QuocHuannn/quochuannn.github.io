import { useRef, useEffect, useMemo, useState, Suspense } from 'react'
import { useGLTF, useAnimations, useCursor } from '@react-three/drei'
import { Group, MeshStandardMaterial, CapsuleGeometry, SphereGeometry } from 'three'
import { useFrame } from '@react-three/fiber'
import { NEON_COLORS } from '../materials/neon-material'

export type AvatarAnimation = 'Idle' | 'Wave' | 'Typing'

// Animation timing constants
const ANIMATION_FADE_IN_DURATION = 0.3
const ANIMATION_FADE_OUT_DURATION = 0.3

interface AvatarModelProps {
  animation?: AvatarAnimation
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  onClick?: () => void
}

// Placeholder Avatar Component
function PlaceholderAvatar({ animation }: { animation: AvatarAnimation }) {
  const groupRef = useRef<Group>(null)
  const bodyRef = useRef<Group>(null)
  const headRef = useRef<Group>(null)
  const armRightRef = useRef<Group>(null)

  // Materials
  const bodyMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#1a1a2e',
        metalness: 0.3,
        roughness: 0.7,
      }),
    []
  )

  const neonAccentMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: NEON_COLORS.cyan,
        emissive: NEON_COLORS.cyan,
        emissiveIntensity: 2,
        toneMapped: false,
      }),
    []
  )

  const headMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#2a2a3e',
        metalness: 0.2,
        roughness: 0.8,
      }),
    []
  )

  // Animation oscillators
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    if (!bodyRef.current || !headRef.current || !armRightRef.current) return

    switch (animation) {
      case 'Idle':
        // Subtle breathing motion
        bodyRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02
        headRef.current.position.y = 0.55 + Math.sin(time * 2) * 0.01
        armRightRef.current.rotation.z = 0
        break

      case 'Wave':
        // Raise right arm
        const waveAngle = Math.sin(time * 6) * 0.3 + 0.8
        armRightRef.current.rotation.z = -waveAngle
        break

      case 'Typing':
        // Subtle arm movement
        armRightRef.current.rotation.z = Math.sin(time * 4) * 0.1
        break
    }
  })

  return (
    <group ref={groupRef}>
      {/* Body - capsule/cylinder */}
      <group ref={bodyRef} position={[0, 0.15, 0]}>
        <mesh geometry={new CapsuleGeometry(0.15, 0.4, 8, 16)} material={bodyMaterial} />
      </group>

      {/* Head - sphere */}
      <group ref={headRef} position={[0, 0.55, 0]}>
        <mesh geometry={new SphereGeometry(0.12, 16, 16)} material={headMaterial} />
      </group>

      {/* Neon accent - ring around neck */}
      <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.01, 8, 16]} />
        <primitive object={neonAccentMaterial} attach="material" />
      </mesh>

      {/* Right arm (for wave animation) */}
      <group ref={armRightRef} position={[0.2, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.06, 0.25, 0.06]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>
        {/* Neon wrist band */}
        <mesh position={[0, -0.15, 0]}>
          <torusGeometry args={[0.035, 0.008, 6, 12]} />
          <meshStandardMaterial
            color={NEON_COLORS.magenta}
            emissive={NEON_COLORS.magenta}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Left arm */}
      <group position={[-0.2, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.06, 0.25, 0.06]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  )
}

// Real Avatar Model - loaded via Suspense
function RealAvatarModel({ animation }: { animation: AvatarAnimation }) {
  const groupRef = useRef<Group>(null)
  const { scene, animations } = useGLTF('/models/avatar.glb')
  const { actions } = useAnimations(animations, groupRef)

  useEffect(() => {
    // Stop all animations
    Object.values(actions).forEach(action => action?.stop())

    // Play requested animation
    const action = actions[animation]
    if (action) {
      action.reset().fadeIn(ANIMATION_FADE_IN_DURATION).play()
    }

    return () => {
      action?.fadeOut(ANIMATION_FADE_OUT_DURATION)
    }
  }, [animation, actions])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

// Error boundary fallback - renders placeholder when model fails to load
function AvatarWithFallback({ animation }: { animation: AvatarAnimation }) {
  const [hasError, setHasError] = useState(false)

  // Check if model exists by trying to preload
  useEffect(() => {
    const checkModel = async () => {
      try {
        const response = await fetch('/models/avatar.glb', { method: 'HEAD' })
        if (!response.ok) {
          setHasError(true)
        }
      } catch {
        setHasError(true)
      }
    }
    checkModel()
  }, [])

  if (hasError) {
    return <PlaceholderAvatar animation={animation} />
  }

  return (
    <Suspense fallback={<PlaceholderAvatar animation={animation} />}>
      <RealAvatarModel animation={animation} />
    </Suspense>
  )
}

// Main Avatar Model Component
export function AvatarModel({
  animation = 'Idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
}: AvatarModelProps) {
  const [hovered, setHovered] = useState(false)

  // State-driven cursor management via drei's useCursor
  useCursor(hovered, 'pointer', 'default')

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <AvatarWithFallback animation={animation} />
    </group>
  )
}
