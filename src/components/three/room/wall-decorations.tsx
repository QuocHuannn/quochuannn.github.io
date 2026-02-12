import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox, Text } from '@react-three/drei'
import { profile } from '@/data/portfolio-data'
import { useInteractiveHover } from '@/hooks/use-interactive-hover'

const FRAME_COLOR = '#3a2a1a'
const LED_COLOR = '#ffeedd'

export function WallDecorations() {
  return (
    <group name="wall-decorations">
      {/* Picture frames on back wall - improved with RoundedBox */}
      <PictureFrame position={[-1.5, 2, -1.93]} color="#cc6644" size={[0.4, 0.3]} />
      <PictureFrame position={[-0.8, 2.2, -1.93]} color="#4488aa" size={[0.3, 0.35]} />
      <PictureFrame position={[-0.3, 1.9, -1.93]} color="#66aa55" size={[0.25, 0.25]} />

      {/* Social posters on left wall - with drei Text labels */}
      <SocialPoster
        position={[-2.93, 2, -1]}
        label="GitHub"
        color="#333333"
        url={profile.social.github}
      />
      <SocialPoster
        position={[-2.93, 2, 0.2]}
        label="LinkedIn"
        color="#0a66c2"
        url={profile.social.linkedin}
      />

      {/* LED strip along desk back edge */}
      <mesh position={[1, 0.82, -1.72]}>
        <boxGeometry args={[1.6, 0.015, 0.015]} />
        <meshStandardMaterial
          color={LED_COLOR}
          emissive={LED_COLOR}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  )
}

function PictureFrame({ position, color, size }: {
  position: [number, number, number]
  color: string
  size: [number, number]
}) {
  return (
    <group position={position}>
      {/* Outer frame - RoundedBox */}
      <RoundedBox args={[size[0] + 0.06, size[1] + 0.06, 0.025]} radius={0.008} smoothness={2} castShadow>
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </RoundedBox>
      {/* Inner mat border */}
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[size[0] + 0.02, size[1] + 0.02]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.95} />
      </mesh>
      {/* Picture content */}
      <mesh position={[0, 0, 0.013]}>
        <planeGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  )
}

function SocialPoster({ position, label, color, url }: {
  position: [number, number, number]
  label: string
  color: string
  url: string
}) {
  const { hovered, onPointerOver, onPointerOut } = useInteractiveHover()

  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.7 }),
    [color]
  )

  const hoverMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.4,
      roughness: 0.7,
    }),
    [color]
  )

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <group
      position={position}
      rotation={[0, Math.PI / 2, 0]}
      onClick={handleClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Poster background - RoundedBox */}
      <RoundedBox args={[0.35, 0.45, 0.01]} radius={0.01} smoothness={2} material={hovered ? hoverMat : mat} castShadow />

      {/* Label icon placeholder */}
      <mesh position={[0, 0.05, 0.006]}>
        <planeGeometry args={[0.15, 0.15]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>

      {/* drei Text label */}
      <Text
        position={[0, -0.12, 0.006]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {label}
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </Text>
    </group>
  )
}
