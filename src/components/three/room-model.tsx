import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState, Suspense } from 'react'
import { Group, Mesh } from 'three'
import { NEON_COLORS } from './materials/neon-material'
import { useDeviceCapability } from '@/hooks/use-device-capability'

// Model paths
const MODEL_PATH_DESKTOP = '/models/room.glb'
const MODEL_PATH_MOBILE = '/models/room-mobile.glb'

// Placeholder room geometry matching the cyberpunk scene hierarchy
function PlaceholderRoom() {
  return (
    <group>
      {/* Floor - dark base */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[6, 0.1, 6]} />
        <meshStandardMaterial color="#0a0a15" />
      </mesh>

      {/* Back wall with neon grid accent */}
      <mesh position={[0, 1.5, -2.5]} receiveShadow>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshStandardMaterial color="#0f0f20" />
      </mesh>

      {/* Window cutout glow */}
      <mesh position={[0, 1.8, -2.4]}>
        <planeGeometry args={[2.5, 1.5]} />
        <meshStandardMaterial
          color={NEON_COLORS.cyan}
          emissive={NEON_COLORS.cyan}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Cityscape backdrop (simplified building silhouettes) */}
      <group position={[0, 1, -2.8]}>
        <mesh position={[-1, 0.5, 0]}>
          <boxGeometry args={[0.4, 1, 0.1]} />
          <meshStandardMaterial color="#050510" emissive="#ff00ff" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.5, 0.8, 0]}>
          <boxGeometry args={[0.5, 1.6, 0.1]} />
          <meshStandardMaterial color="#050510" emissive="#00ffff" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[1.2, 0.3, 0]}>
          <boxGeometry args={[0.3, 0.6, 0.1]} />
          <meshStandardMaterial color="#050510" emissive="#8800ff" emissiveIntensity={0.25} />
        </mesh>
      </group>

      {/* Left wall */}
      <mesh position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshStandardMaterial color="#0f0f20" />
      </mesh>

      {/* Ceiling with neon accent strips */}
      <mesh position={[0, 3.5, 0]} receiveShadow>
        <boxGeometry args={[6, 0.1, 6]} />
        <meshStandardMaterial color="#0a0a15" />
      </mesh>
      <mesh position={[0, 3.45, 0]}>
        <boxGeometry args={[0.1, 0.05, 5]} />
        <meshStandardMaterial
          color={NEON_COLORS.purple}
          emissive={NEON_COLORS.purple}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Desk platform - dark metallic */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.08, 1.2]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Desk legs */}
        <mesh position={[-1, -0.6, -0.5]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#0a0a15" metalness={0.8} />
        </mesh>
        <mesh position={[1, -0.6, -0.5]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#0a0a15" metalness={0.8} />
        </mesh>
        <mesh position={[-1, -0.6, 0.5]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#0a0a15" metalness={0.8} />
        </mesh>
        <mesh position={[1, -0.6, 0.5]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#0a0a15" metalness={0.8} />
        </mesh>
        {/* Neon edge accent */}
        <mesh position={[0, -0.19, 0.6]}>
          <boxGeometry args={[2.4, 0.02, 0.03]} />
          <meshStandardMaterial
            color={NEON_COLORS.cyan}
            emissive={NEON_COLORS.cyan}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Monitor 1 - Left (3D & Creative) */}
      <group position={[-0.7, 0.5, -0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.03]} />
          <meshStandardMaterial
            color="#0a0a15"
            emissive={NEON_COLORS.cyan}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, -0.25, 0.05]}>
          <cylinderGeometry args={[0.03, 0.04, 0.1, 8]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.7} />
        </mesh>
      </group>

      {/* Monitor 2 - Right (Frontend) */}
      <group position={[0.7, 0.5, -0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.03]} />
          <meshStandardMaterial
            color="#0a0a15"
            emissive={NEON_COLORS.purple}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, -0.25, 0.05]}>
          <cylinderGeometry args={[0.03, 0.04, 0.1, 8]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.7} />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh position={[0, -0.18, 0.3]} castShadow>
        <boxGeometry args={[0.4, 0.02, 0.15]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.5, -0.16, 0.3]} castShadow>
        <boxGeometry args={[0.06, 0.03, 0.09]} />
        <meshStandardMaterial color="#0f0f20" />
      </mesh>

      {/* Chair (simplified) */}
      <group position={[0, -0.3, 1.2]}>
        {/* Seat */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.4, -0.2]} castShadow>
          <boxGeometry args={[0.5, 0.7, 0.08]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 6]} />
          <meshStandardMaterial color="#0a0a15" metalness={0.8} />
        </mesh>
      </group>

      {/* Wall-mounted shelf */}
      <group position={[-2, 1.5, -1.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.05, 0.25]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Neon shelf edge */}
        <mesh position={[0, -0.02, 0.13]}>
          <boxGeometry args={[0.8, 0.01, 0.01]} />
          <meshStandardMaterial
            color={NEON_COLORS.magenta}
            emissive={NEON_COLORS.magenta}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
        {/* Decorative items on shelf */}
        <mesh position={[-0.25, 0.08, 0]} castShadow>
          <boxGeometry args={[0.1, 0.12, 0.08]} />
          <meshStandardMaterial color="#2a2a3e" />
        </mesh>
        <mesh position={[0.15, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
          <meshStandardMaterial color="#2a2a3e" />
        </mesh>
      </group>

      {/* Coffee mug with neon accent */}
      <group position={[1, -0.13, 0.4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.12, 16]} />
          <meshStandardMaterial color="#2a2a3e" />
        </mesh>
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.03, 0.008, 8, 12]} />
          <meshStandardMaterial color="#2a2a3e" />
        </mesh>
        {/* Steam effect (glowing particles) */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial
            color={NEON_COLORS.cyan}
            emissive={NEON_COLORS.cyan}
            emissiveIntensity={1}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>

      {/* Neon social signs on walls */}
      {/* GitHub sign - Left wall */}
      <group position={[-1.2, 1.8, -1.8]} rotation={[0, 0.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.12, 0.02]} />
          <meshStandardMaterial
            color={NEON_COLORS.cyan}
            emissive={NEON_COLORS.cyan}
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* LinkedIn sign - Right wall */}
      <group position={[1.2, 1.8, -1.8]} rotation={[0, -0.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.12, 0.02]} />
          <meshStandardMaterial
            color={NEON_COLORS.purple}
            emissive={NEON_COLORS.purple}
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Holographic display frames (Backend skills) */}
      <group position={[0.8, 1.2, 0]}>
        <mesh>
          <planeGeometry args={[0.5, 0.35]} />
          <meshStandardMaterial
            color={NEON_COLORS.green}
            emissive={NEON_COLORS.green}
            emissiveIntensity={1.2}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Holographic display frames (Tools skills) */}
      <group position={[-0.8, 1.2, 0]}>
        <mesh>
          <planeGeometry args={[0.5, 0.35]} />
          <meshStandardMaterial
            color={NEON_COLORS.magenta}
            emissive={NEON_COLORS.magenta}
            emissiveIntensity={1.2}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

// Real Room Model - loaded via Suspense
function RealRoomModel({ modelPath }: { modelPath: string }) {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(modelPath)

  useEffect(() => {
    if (scene && groupRef.current) {
      // Setup shadows on loaded model
      scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true
        }
      })
    }
  }, [scene])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

// Room with fallback - checks model availability
function RoomWithFallback({ modelPath }: { modelPath: string }) {
  const [hasError, setHasError] = useState(false)

  // Check if model exists
  useEffect(() => {
    const checkModel = async () => {
      try {
        const response = await fetch(modelPath, { method: 'HEAD' })
        if (!response.ok) {
          setHasError(true)
        }
      } catch {
        setHasError(true)
      }
    }
    checkModel()
  }, [modelPath])

  if (hasError) {
    return <PlaceholderRoom />
  }

  return (
    <Suspense fallback={<PlaceholderRoom />}>
      <RealRoomModel modelPath={modelPath} />
    </Suspense>
  )
}

// Room model component with glTF loading and fallback
export function RoomModel() {
  const { quality } = useDeviceCapability()

  // Determine model path based on device capability
  const modelPath = quality === 'low' ? MODEL_PATH_MOBILE : MODEL_PATH_DESKTOP

  return <RoomWithFallback modelPath={modelPath} />
}
