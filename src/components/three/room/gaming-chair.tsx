import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useFabricMaterial } from '@/hooks/materials/use-fabric-material'
import { useMetalMaterial } from '@/hooks/materials/use-metal-material'

const CHAIR_ACCENT = '#cc3333'

export function GamingChair() {
  const fabricMat = useFabricMaterial('#2d2d2d', 0.85)
  const baseMat = useMetalMaterial('#555555', 0.3)
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: CHAIR_ACCENT, roughness: 0.6 }),
    []
  )

  const legAngles = [0, (Math.PI * 2) / 5, (Math.PI * 4) / 5, (Math.PI * 6) / 5, (Math.PI * 8) / 5]

  return (
    <group name="gaming-chair" position={[1, 0, -0.5]} rotation={[0, Math.PI, 0]}>
      {/* Center post */}
      <mesh position={[0, 0.3, 0]} material={baseMat}>
        <cylinderGeometry args={[0.025, 0.03, 0.35, 8]} />
      </mesh>

      {/* 5-star base legs with torus casters */}
      {legAngles.map((angle, i) => (
        <group key={i}>
          <mesh
            position={[Math.cos(angle) * 0.15, 0.06, Math.sin(angle) * 0.15]}
            rotation={[0, -angle, Math.PI / 2]}
            material={baseMat}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.3, 4]} />
          </mesh>
          {/* Torus wheel casters */}
          <mesh
            position={[Math.cos(angle) * 0.28, 0.02, Math.sin(angle) * 0.28]}
            rotation={[Math.PI / 2, 0, angle]}
            material={baseMat}
          >
            <torusGeometry args={[0.015, 0.008, 6, 12]} />
          </mesh>
        </group>
      ))}

      {/* Seat */}
      <RoundedBox args={[0.5, 0.1, 0.5]} radius={0.03} smoothness={2} position={[0, 0.5, 0]} material={fabricMat} castShadow receiveShadow />

      {/* Backrest */}
      <RoundedBox args={[0.48, 0.6, 0.05]} radius={0.03} smoothness={2} position={[0, 0.82, -0.17]} rotation={[0.1, 0, 0]} material={fabricMat} castShadow />

      {/* Headrest cushion */}
      <RoundedBox args={[0.22, 0.1, 0.06]} radius={0.03} smoothness={2} position={[0, 1.16, -0.19]} rotation={[0.1, 0, 0]} material={fabricMat} />

      {/* Lumbar support pillow */}
      <RoundedBox args={[0.2, 0.1, 0.05]} radius={0.03} smoothness={2} position={[0, 0.65, -0.13]} rotation={[0.1, 0, 0]} material={accentMat} />

      {/* Accent stripes */}
      <mesh position={[-0.15, 0.82, -0.14]} rotation={[0.1, 0, 0]} material={accentMat}>
        <boxGeometry args={[0.03, 0.55, 0.01]} />
      </mesh>
      <mesh position={[0.15, 0.82, -0.14]} rotation={[0.1, 0, 0]} material={accentMat}>
        <boxGeometry args={[0.03, 0.55, 0.01]} />
      </mesh>

      {/* Armrests */}
      <RoundedBox args={[0.1, 0.05, 0.25]} radius={0.02} smoothness={2} position={[-0.27, 0.6, -0.05]} material={fabricMat} />
      <RoundedBox args={[0.1, 0.05, 0.25]} radius={0.02} smoothness={2} position={[0.27, 0.6, -0.05]} material={fabricMat} />

      {/* Armrest supports */}
      <mesh position={[-0.27, 0.55, -0.05]} material={baseMat}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
      </mesh>
      <mesh position={[0.27, 0.55, -0.05]} material={baseMat}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
      </mesh>
    </group>
  )
}
