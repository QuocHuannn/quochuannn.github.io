import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox, Text } from '@react-three/drei'
import { profile } from '@/data/portfolio-data'
import { useInteractiveHover } from '@/hooks/use-interactive-hover'

const FRAME_COLOR = '#3a2a1a'
const LED_COLOR = '#ffeedd'

export function WallDecorations() {
  return (
    <group name="wall-decorations">
      {/* Picture frames with abstract art */}
      <PictureFrame position={[-1.5, 2, -1.93]} color="#cc6644" size={[0.4, 0.3]} artSeed={1} />
      <PictureFrame position={[-0.8, 2.2, -1.93]} color="#4488aa" size={[0.3, 0.35]} artSeed={2} />
      <PictureFrame position={[-0.3, 1.9, -1.93]} color="#66aa55" size={[0.25, 0.25]} artSeed={3} />

      {/* Social posters with icon shapes */}
      <SocialPoster position={[-2.93, 2, -1]} label="GitHub" color="#333333" url={profile.social.github} icon="github" />
      <SocialPoster position={[-2.93, 2, 0.2]} label="LinkedIn" color="#0a66c2" url={profile.social.linkedin} icon="linkedin" />

      {/* LED strip */}
      <mesh position={[1, 0.82, -1.72]}>
        <boxGeometry args={[1.6, 0.015, 0.015]} />
        <meshStandardMaterial color={LED_COLOR} emissive={LED_COLOR} emissiveIntensity={0.8} />
      </mesh>

      {/* Wall clock */}
      <WallClock position={[0.5, 2.3, -1.93]} />
    </group>
  )
}

function WallClock({ position }: { position: [number, number, number] }) {
  const minuteRef = useRef<THREE.Mesh>(null)
  const hourRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.1
    if (minuteRef.current) minuteRef.current.rotation.z = -t * 6
    if (hourRef.current) hourRef.current.rotation.z = -t * 0.5
  })

  return (
    <group position={position}>
      {/* Clock frame ring */}
      <mesh>
        <torusGeometry args={[0.1, 0.012, 8, 24]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Clock face */}
      <mesh position={[0, 0, 0.005]}>
        <circleGeometry args={[0.09, 24]} />
        <meshStandardMaterial color="#f0ece4" roughness={0.9} />
      </mesh>
      {/* Hour hand */}
      <mesh ref={hourRef} position={[0, 0, 0.01]}>
        <boxGeometry args={[0.008, 0.055, 0.004]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Minute hand */}
      <mesh ref={minuteRef} position={[0, 0, 0.012]}>
        <boxGeometry args={[0.005, 0.075, 0.004]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Center dot */}
      <mesh position={[0, 0, 0.014]}>
        <circleGeometry args={[0.006, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  )
}

function AbstractArt({ size, seed }: { size: [number, number]; seed: number }) {
  const r = (i: number) => {
    const v = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453
    return v - Math.floor(v)
  }
  return (
    <group position={[0, 0, 0.014]}>
      {/* Background */}
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial color={`hsl(${r(0) * 360}, 30%, 75%)`} roughness={0.9} />
      </mesh>
      {/* Circle */}
      <mesh position={[(r(1) - 0.5) * size[0] * 0.5, (r(2) - 0.5) * size[1] * 0.5, 0.001]}>
        <circleGeometry args={[size[0] * 0.12, 16]} />
        <meshStandardMaterial color={`hsl(${r(3) * 360}, 50%, 55%)`} roughness={0.8} />
      </mesh>
      {/* Triangle */}
      <mesh position={[(r(4) - 0.5) * size[0] * 0.4, (r(5) - 0.5) * size[1] * 0.4, 0.001]} rotation={[0, 0, r(6) * Math.PI]}>
        <coneGeometry args={[size[0] * 0.08, size[1] * 0.15, 3]} />
        <meshStandardMaterial color={`hsl(${r(7) * 360}, 45%, 50%)`} roughness={0.8} />
      </mesh>
      {/* Line accent */}
      <mesh position={[0, (r(8) - 0.5) * size[1] * 0.3, 0.001]}>
        <boxGeometry args={[size[0] * 0.7, 0.006, 0.001]} />
        <meshStandardMaterial color={`hsl(${r(9) * 360}, 40%, 40%)`} />
      </mesh>
    </group>
  )
}

function PictureFrame({ position, color: _color, size, artSeed }: {
  position: [number, number, number]; color: string; size: [number, number]; artSeed: number
}) {
  return (
    <group position={position}>
      <RoundedBox args={[size[0] + 0.06, size[1] + 0.06, 0.025]} radius={0.008} smoothness={2} castShadow>
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[size[0] + 0.02, size[1] + 0.02]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.95} />
      </mesh>
      <AbstractArt size={size} seed={artSeed} />
    </group>
  )
}

function GitHubIcon() {
  return (
    <mesh position={[0, 0.05, 0.006]} rotation={[0, 0, Math.PI / 8]}>
      <cylinderGeometry args={[0.06, 0.06, 0.005, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
    </mesh>
  )
}

function LinkedInIcon() {
  return (
    <group position={[0, 0.05, 0.006]}>
      <RoundedBox args={[0.12, 0.12, 0.005]} radius={0.02} smoothness={2}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
      </RoundedBox>
      <Text position={[0, 0, 0.004]} fontSize={0.07} color="#0a66c2" anchorX="center" anchorY="middle" font={undefined}>
        in
      </Text>
    </group>
  )
}

function SocialPoster({ position, label, color, url, icon }: {
  position: [number, number, number]; label: string; color: string; url: string; icon: string
}) {
  const { hovered, onPointerOver, onPointerOut } = useInteractiveHover()

  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.7 }),
    [color]
  )
  const hoverMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, roughness: 0.7 }),
    [color]
  )

  const handleClick = () => { window.open(url, '_blank', 'noopener,noreferrer') }

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]} onClick={handleClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <RoundedBox args={[0.35, 0.45, 0.01]} radius={0.01} smoothness={2} material={hovered ? hoverMat : mat} castShadow />
      {icon === 'github' ? <GitHubIcon /> : <LinkedInIcon />}
      <Text position={[0, -0.12, 0.006]} fontSize={0.06} color="#ffffff" anchorX="center" anchorY="middle" font={undefined}>
        {label}
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </Text>
    </group>
  )
}
