import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useInteractionState } from '@/hooks/use-interaction-state'
import { useInteractiveHover } from '@/hooks/use-interactive-hover'
import { useWoodMaterial } from '@/hooks/materials/use-wood-material'
import { useFabricMaterial } from '@/hooks/materials/use-fabric-material'

export function Bed() {
  const glowRef = useRef<THREE.PointLight>(null)
  const setActiveTarget = useInteractionState((s) => s.setActiveTarget)
  const { hovered, onPointerOver, onPointerOut } = useInteractiveHover()

  const frameMat = useWoodMaterial('#5a4530')
  const mattressMat = useFabricMaterial('#e8e8e8', 0.9)
  const pillowMat = useFabricMaterial('#ffffff', 0.95)
  const blanketMat = useFabricMaterial('#c8a882', 0.9)
  const accentPillowMat = useFabricMaterial('#7b9bb5', 0.9)

  useFrame(() => {
    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.lerp(
        glowRef.current.intensity, hovered ? 1.2 : 0, 0.08
      )
    }
  })

  return (
    <group
      name="bed"
      position={[-1.8, 0, 0.8]}
      rotation={[0, Math.PI / 2, 0]}
      onClick={() => setActiveTarget('about')}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <pointLight ref={glowRef} position={[0, 0.8, 0]} color="#ffcc88" intensity={0} distance={3} />

      {/* Bed frame */}
      <RoundedBox args={[1.2, 0.15, 0.8]} radius={0.02} smoothness={2} position={[0, 0.2, 0]} castShadow receiveShadow material={frameMat} />

      {/* Paneled headboard - 3 vertical panels with gaps */}
      {[-0.22, 0, 0.22].map((z, i) => (
        <RoundedBox key={i} args={[0.05, 0.6, 0.24]} radius={0.02} smoothness={2} position={[-0.55, 0.5, z]} castShadow material={frameMat} />
      ))}

      {/* Frame legs */}
      {[[-0.55, -0.35], [-0.55, 0.35], [0.55, -0.35], [0.55, 0.35]].map(([x, z], i) => (
        <RoundedBox key={i} args={[0.08, 0.12, 0.08]} radius={0.02} smoothness={2} position={[x, 0.06, z]} material={frameMat} />
      ))}

      {/* Thicker mattress */}
      <RoundedBox args={[1.1, 0.15, 0.76]} radius={0.04} smoothness={2} position={[0.02, 0.355, 0]} material={mattressMat} />

      {/* Pillows */}
      <RoundedBox args={[0.2, 0.08, 0.25]} radius={0.03} smoothness={2} position={[-0.38, 0.47, -0.15]} material={pillowMat} />
      <RoundedBox args={[0.2, 0.08, 0.25]} radius={0.03} smoothness={2} position={[-0.38, 0.47, 0.15]} material={pillowMat} />

      {/* Accent throw pillow */}
      <RoundedBox args={[0.12, 0.06, 0.12]} radius={0.025} smoothness={2} position={[-0.22, 0.47, 0]} rotation={[0, 0.3, 0]} material={accentPillowMat} />

      {/* Blanket */}
      <RoundedBox args={[0.7, 0.05, 0.78]} radius={0.02} smoothness={2} position={[0.2, 0.455, 0]} material={blanketMat} />

      {/* Blanket folded edge */}
      <RoundedBox args={[0.08, 0.03, 0.78]} radius={0.01} smoothness={2} position={[-0.12, 0.47, 0]} rotation={[0, 0, -0.15]} material={blanketMat} />
    </group>
  )
}
