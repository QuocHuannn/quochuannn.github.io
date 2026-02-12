import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useInteractionState } from '@/hooks/use-interaction-state'
import { useInteractiveHover } from '@/hooks/use-interactive-hover'
import { useWoodMaterial } from '@/hooks/materials/use-wood-material'
import { useMetalMaterial } from '@/hooks/materials/use-metal-material'
import { useCodeScrollCanvas } from '@/hooks/use-code-scroll-canvas'
import { useTerminalCanvas } from '@/hooks/use-terminal-canvas'

const MOUSEPAD_COLOR = '#1a1a2a'
const MUG_COLOR = '#cc6644'

export function DeveloperDesk() {
  const screenRef = useRef<THREE.Group>(null)
  const setActiveTarget = useInteractionState((s) => s.setActiveTarget)
  const { hovered, onPointerOver, onPointerOut } = useInteractiveHover()

  const woodMat = useWoodMaterial('#5a4530')
  const monitorMetal = useMetalMaterial('#2a2a2a', 0.4)
  const handleMetal = useMetalMaterial('#888888', 0.3)

  // Animated screen textures
  const codeTexture = useCodeScrollCanvas(256, 128)
  const terminalTexture = useTerminalCanvas(256, 128)

  const handleClick = () => setActiveTarget('projects')

  return (
    <group name="developer-desk" position={[1, 0, -1.4]}>
      {/* Desk surface */}
      <RoundedBox args={[1.6, 0.05, 0.8]} radius={0.02} smoothness={2} position={[0, 0.75, 0]} castShadow receiveShadow material={woodMat} />

      {/* 4 legs */}
      {[[-0.7, -0.3], [-0.7, 0.3], [0.7, -0.3], [0.7, 0.3]].map(([x, z], i) => (
        <RoundedBox key={i} args={[0.05, 0.75, 0.05]} radius={0.01} smoothness={2} position={[x, 0.375, z]} castShadow material={woodMat} />
      ))}

      {/* Drawer fronts */}
      <RoundedBox args={[0.4, 0.15, 0.03]} radius={0.01} smoothness={2} position={[-0.5, 0.6, 0.39]} castShadow material={woodMat} />
      <RoundedBox args={[0.4, 0.15, 0.03]} radius={0.01} smoothness={2} position={[-0.5, 0.42, 0.39]} castShadow material={woodMat} />
      {/* Drawer handles */}
      {[0.6, 0.42].map((y, i) => (
        <mesh key={i} position={[-0.5, y, 0.41]} material={handleMetal}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
        </mesh>
      ))}

      {/* Monitors group - clickable */}
      <group
        ref={screenRef}
        onClick={handleClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {/* Left monitor - code scroll */}
        <Monitor
          position={[-0.28, 1.15, -0.2]}
          rotation={[0, 0.08, 0]}
          frameMat={monitorMetal}
          screenTexture={codeTexture}
          screenEmissive="#1e1e1e"
          hovered={hovered}
        />
        {/* Right monitor - terminal */}
        <Monitor
          position={[0.28, 1.15, -0.2]}
          rotation={[0, -0.08, 0]}
          frameMat={monitorMetal}
          screenTexture={terminalTexture}
          screenEmissive="#0c0c0c"
          hovered={hovered}
        />
      </group>

      {/* Keyboard */}
      <RoundedBox args={[0.35, 0.015, 0.12]} radius={0.005} smoothness={2} position={[0, 0.8, 0.05]}>
        <meshStandardMaterial color="#222222" roughness={0.8} metalness={0.2} />
      </RoundedBox>

      {/* Mouse */}
      <RoundedBox args={[0.04, 0.02, 0.065]} radius={0.008} smoothness={2} position={[0.35, 0.79, 0.05]}>
        <meshStandardMaterial color="#222222" roughness={0.7} />
      </RoundedBox>

      {/* Mousepad */}
      <RoundedBox args={[0.2, 0.005, 0.18]} radius={0.003} smoothness={2} position={[0.35, 0.775, 0.05]}>
        <meshStandardMaterial color={MOUSEPAD_COLOR} roughness={0.9} />
      </RoundedBox>

      {/* Coffee mug */}
      <group position={[-0.55, 0.82, 0.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.035, 0.03, 0.07, 8]} />
          <meshStandardMaterial color={MUG_COLOR} roughness={0.5} />
        </mesh>
        <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.025, 0.007, 6, 12]} />
          <meshStandardMaterial color={MUG_COLOR} roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

function Monitor({ position, rotation, frameMat, screenTexture, screenEmissive, hovered }: {
  position: [number, number, number]
  rotation: [number, number, number]
  frameMat: THREE.MeshStandardMaterial
  screenTexture: THREE.CanvasTexture | null
  screenEmissive: string
  hovered: boolean
}) {
  const screenRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(() => {
    if (screenRef.current) {
      screenRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        screenRef.current.emissiveIntensity,
        hovered ? 0.6 : 0.3,
        0.1
      )
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Bezel frame */}
      <RoundedBox args={[0.5, 0.3, 0.02]} radius={0.01} smoothness={2} castShadow material={frameMat} />
      {/* Screen with canvas texture */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[0.46, 0.26]} />
        <meshStandardMaterial
          ref={screenRef}
          map={screenTexture}
          emissive={screenEmissive}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Stand neck */}
      <RoundedBox args={[0.03, 0.12, 0.03]} radius={0.005} smoothness={2} position={[0, -0.2, 0]} material={frameMat} />
      {/* Stand base */}
      <RoundedBox args={[0.12, 0.01, 0.08]} radius={0.003} smoothness={2} position={[0, -0.26, 0.05]} material={frameMat} />
    </group>
  )
}
