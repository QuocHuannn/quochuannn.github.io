import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useInteractionState } from '@/hooks/use-interaction-state'
import { useInteractiveHover } from '@/hooks/use-interactive-hover'
import { useWoodMaterial } from '@/hooks/materials/use-wood-material'
import { useMetalMaterial } from '@/hooks/materials/use-metal-material'
import { useEmissiveMaterial } from '@/hooks/materials/use-emissive-material'
import { useTimeDisplayCanvas } from '@/hooks/use-time-display-canvas'

const LAMP_SHADE_COLOR = '#e8d8c0'

export function Nightstand() {
  const phoneScreenRef = useRef<THREE.MeshStandardMaterial>(null)
  const setActiveTarget = useInteractionState((s) => s.setActiveTarget)
  const { hovered, onPointerOver, onPointerOut } = useInteractiveHover()

  const tableMat = useWoodMaterial('#6b5744')
  const lampBaseMat = useMetalMaterial('#3d3d3d', 0.5)
  const handleMat = useMetalMaterial('#888888', 0.4)
  const bulbMat = useEmissiveMaterial('#fff5e1', 2.0)

  const timeTexture = useTimeDisplayCanvas(128, 64)

  const lampMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: LAMP_SHADE_COLOR,
      emissive: '#ffaa44',
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide,
    }),
    []
  )

  useFrame(() => {
    if (phoneScreenRef.current) {
      phoneScreenRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        phoneScreenRef.current.emissiveIntensity, hovered ? 1.2 : 0.2, 0.1
      )
    }
  })

  return (
    <group name="nightstand" position={[-2.5, 0, 1.5]}>
      {/* Table body */}
      <RoundedBox args={[0.5, 0.45, 0.4]} radius={0.02} smoothness={2} position={[0, 0.225, 0]} castShadow receiveShadow material={tableMat} />

      {/* Drawer front */}
      <RoundedBox args={[0.4, 0.12, 0.02]} radius={0.01} smoothness={2} position={[0, 0.25, 0.2]} material={tableMat} />

      {/* Drawer handle */}
      <mesh position={[0, 0.25, 0.22]} rotation={[0, 0, Math.PI / 2]} material={handleMat}>
        <cylinderGeometry args={[0.006, 0.006, 0.08, 6]} />
      </mesh>

      {/* Lamp base */}
      <mesh position={[-0.1, 0.52, -0.05]} castShadow material={lampBaseMat}>
        <cylinderGeometry args={[0.04, 0.05, 0.06, 8]} />
      </mesh>

      {/* Lamp pole */}
      <mesh position={[-0.1, 0.62, -0.05]} material={lampBaseMat}>
        <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
      </mesh>

      {/* Tapered lamp shade (wider bottom, narrower top, open ends) */}
      <mesh position={[-0.1, 0.74, -0.05]} material={lampMat}>
        <cylinderGeometry args={[0.04, 0.08, 0.1, 12, 1, true]} />
      </mesh>

      {/* Lamp bulb */}
      <mesh position={[-0.1, 0.7, -0.05]} material={bulbMat}>
        <sphereGeometry args={[0.015, 8, 8]} />
      </mesh>

      {/* Lamp light */}
      <pointLight position={[-0.1, 0.7, -0.05]} color="#ffaa44" intensity={0.5} distance={2.5} />

      {/* Coaster on table surface */}
      <mesh position={[0.15, 0.455, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.035, 16]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>

      {/* Small book laying flat */}
      <RoundedBox args={[0.07, 0.015, 0.1]} radius={0.003} smoothness={2} position={[-0.02, 0.46, 0.08]}>
        <meshStandardMaterial color="#cc4444" roughness={0.7} />
      </RoundedBox>

      {/* Phone - clickable for contact */}
      <group
        position={[0.1, 0.49, 0.05]}
        onClick={() => setActiveTarget('contact')}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <RoundedBox args={[0.06, 0.008, 0.12]} radius={0.003} smoothness={2}>
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 0.1]} />
          <meshStandardMaterial
            ref={phoneScreenRef}
            map={timeTexture}
            emissive="#000022"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </group>
  )
}
