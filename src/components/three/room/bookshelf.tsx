import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useInteractionState } from '@/hooks/use-interaction-state'
import { useInteractiveHover } from '@/hooks/use-interactive-hover'
import { playSound } from '@/hooks/use-audio-manager'
import type { ThreeEvent } from '@react-three/fiber'
import { useWoodMaterial } from '@/hooks/materials/use-wood-material'

const BOOK_COLORS = [
  '#cc4444', '#dd6633', '#44aa66', '#4488cc',
  '#cc8844', '#8855aa', '#dd5555', '#55aa88',
  '#6677cc', '#bb7733', '#aa4466', '#558844',
]

export function Bookshelf() {
  const booksRef = useRef<THREE.Group>(null)
  const setCameraPreset = useInteractionState((s) => s.setCameraPreset)
  const { hovered, onPointerOver, onPointerOut, onPointerDown, isClick } = useInteractiveHover()
  const shelfMat = useWoodMaterial('#6b5744')

  useFrame(() => {
    if (!booksRef.current) return
    const target = hovered ? 0.25 : 0
    booksRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.isBook) {
        const mat = child.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, target, 0.1)
      }
    })
  })

  return (
    <group
      name="bookshelf"
      position={[-2.5, 0, -0.5]}
      onClick={(e: ThreeEvent<MouseEvent>) => { if (isClick(e)) { playSound('click'); setCameraPreset('bookshelf') } }}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Back panel */}
      <RoundedBox args={[0.8, 2.2, 0.03]} radius={0.01} smoothness={2} position={[0, 1.1, -0.14]} castShadow receiveShadow material={shelfMat} />

      {/* Side panels */}
      {[-0.39, 0.39].map((x, i) => (
        <RoundedBox key={i} args={[0.03, 2.2, 0.3]} radius={0.01} smoothness={2} position={[x, 1.1, 0]} castShadow material={shelfMat} />
      ))}

      {/* 5 shelves */}
      {[0.02, 0.55, 1.1, 1.65, 2.18].map((y, i) => (
        <RoundedBox key={i} args={[0.8, 0.03, 0.3]} radius={0.01} smoothness={2} position={[0, y, 0]} material={shelfMat} />
      ))}

      {/* Books */}
      <group ref={booksRef}>
        <BookRow y={0.04} count={7} offset={0} />
        <BookRow y={0.57} count={6} offset={3} />
        <BookRow y={1.12} count={7} offset={6} flatBookIndex={4} />
        <BookRow y={1.67} count={5} offset={9} />
      </group>

      {/* Top shelf decorations */}
      <ShelfDecorations />
    </group>
  )
}

function ShelfDecorations() {
  return (
    <group position={[0, 2.2, 0.02]}>
      {/* Mini succulent: pot + spheres */}
      <group position={[-0.15, 0, 0]}>
        <mesh position={[0, 0.025, 0]}>
          <cylinderGeometry args={[0.025, 0.02, 0.05, 6]} />
          <meshStandardMaterial color="#8B5E3C" roughness={0.8} />
        </mesh>
        {[0, 1.2, 2.4, 3.6, 5].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.015, 0.06, Math.sin(a) * 0.015]}>
            <sphereGeometry args={[0.012, 5, 5]} />
            <meshStandardMaterial color="#5a9a50" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Mini photo frame */}
      <group position={[0.15, 0, 0]}>
        <RoundedBox args={[0.08, 0.06, 0.01]} radius={0.003} smoothness={2} position={[0, 0.035, 0]}>
          <meshStandardMaterial color="#3a2a1a" roughness={0.6} />
        </RoundedBox>
        <mesh position={[0, 0.035, 0.006]}>
          <planeGeometry args={[0.06, 0.04]} />
          <meshStandardMaterial color="#aaccdd" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

function BookRow({ y, count, offset, flatBookIndex }: {
  y: number; count: number; offset: number; flatBookIndex?: number
}) {
  const books = useMemo(() => {
    const result = []
    let x = -0.3
    const seed = offset * 17 + count * 7
    const rand = (i: number) => {
      const val = Math.sin(seed + i * 127.1) * 43758.5453
      return val - Math.floor(val)
    }
    for (let i = 0; i < count; i++) {
      const width = 0.03 + rand(i) * 0.05
      const height = 0.3 + rand(i + 50) * 0.2
      const lean = i === count - 2 ? 0.12 : (rand(i + 100) > 0.85 ? rand(i + 200) * 0.08 : 0)
      const color = BOOK_COLORS[(i + offset) % BOOK_COLORS.length]
      const flat = flatBookIndex !== undefined && i === flatBookIndex
      result.push({ x: x + width / 2, width, height, lean, color, flat })
      x += width + 0.008
    }
    return result
  }, [count, offset, flatBookIndex])

  return (
    <group position={[0, y, 0.02]}>
      {books.map((book, i) => (
        book.flat ? (
          <RoundedBox
            key={i}
            args={[book.width + 0.02, 0.04, 0.18]}
            radius={0.005}
            smoothness={2}
            position={[book.x, 0.02, 0]}
            userData={{ isBook: true }}
          >
            <meshStandardMaterial color={book.color} emissive={book.color} emissiveIntensity={0} roughness={0.7} />
          </RoundedBox>
        ) : (
          <RoundedBox
            key={i}
            args={[book.width, book.height, 0.2]}
            radius={0.004}
            smoothness={2}
            position={[book.x, book.height / 2, 0]}
            rotation={[0, 0, book.lean]}
            userData={{ isBook: true }}
          >
            <meshStandardMaterial color={book.color} emissive={book.color} emissiveIntensity={0} roughness={0.7} />
          </RoundedBox>
        )
      ))}
    </group>
  )
}
