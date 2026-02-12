import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useFabricMaterial } from '@/hooks/materials/use-fabric-material'

const POT_COLOR = '#8B5E3C'
const FOLIAGE_COLOR = '#4a8844'
const FIGURINE_COLOR = '#cc8855'

export function RoomProps() {
  const potMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: POT_COLOR, roughness: 0.8 }),
    []
  )
  const foliageMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: FOLIAGE_COLOR, roughness: 0.9 }),
    []
  )

  useEffect(() => () => { potMat.dispose(); foliageMat.dispose() }, [potMat, foliageMat])
  const rugMat = useFabricMaterial('#8b7355', 0.95)
  const figurineRef = useRef<THREE.Group>(null)

  // Subtle figurine sway
  useFrame(({ clock }) => {
    if (figurineRef.current) {
      figurineRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.3) * 0.02
    }
  })

  return (
    <group name="room-props">
      {/* Potted plant - corner near bookshelf */}
      <Plant position={[-2.3, 0, -1.5]} potMat={potMat} foliageMat={foliageMat} scale={1} swayOffset={0} />

      {/* Small plant on desk */}
      <Plant position={[1.65, 0.78, -1.2]} potMat={potMat} foliageMat={foliageMat} scale={0.5} swayOffset={1.5} />

      {/* Figurine on bookshelf top */}
      <group ref={figurineRef} position={[-2.5, 2.25, -0.5]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.025, 0.02, 0.1, 6]} />
          <meshStandardMaterial color={FIGURINE_COLOR} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={FIGURINE_COLOR} roughness={0.5} />
        </mesh>
      </group>

      {/* Rug on floor */}
      <mesh position={[0, 0.005, 0.3]} rotation={[-Math.PI / 2, 0, 0.1]} material={rugMat}>
        <planeGeometry args={[1.8, 1.2]} />
      </mesh>
    </group>
  )
}

function Plant({ position, potMat, foliageMat, scale, swayOffset }: {
  position: [number, number, number]
  potMat: THREE.MeshStandardMaterial
  foliageMat: THREE.MeshStandardMaterial
  scale: number
  swayOffset: number
}) {
  const foliageRef = useRef<THREE.Group>(null)

  // Gentle plant sway
  useFrame(({ clock }) => {
    if (foliageRef.current) {
      foliageRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5 + swayOffset) * 0.04
      foliageRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.4 + swayOffset + 1) * 0.02
    }
  })

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.08, 0]} material={potMat} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.16, 8]} />
      </mesh>
      <group ref={foliageRef}>
        <mesh position={[0, 0.25, 0]} material={foliageMat} castShadow>
          <sphereGeometry args={[0.12, 8, 8]} />
        </mesh>
        <mesh position={[0.06, 0.3, 0.04]} material={foliageMat}>
          <sphereGeometry args={[0.07, 6, 6]} />
        </mesh>
      </group>
    </group>
  )
}
