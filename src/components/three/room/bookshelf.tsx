import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useInteractionState } from '@/hooks/use-interaction-state'
import { useInteractiveHover } from '@/hooks/use-interactive-hover'
import { useWoodMaterial } from '@/hooks/materials/use-wood-material'

const BOOK_COLORS = [
  '#cc4444', '#dd6633', '#44aa66', '#4488cc',
  '#cc8844', '#8855aa', '#dd5555', '#55aa88',
  '#6677cc', '#bb7733', '#aa4466', '#558844',
]

export function Bookshelf() {
  const booksRef = useRef<THREE.Group>(null)
  const setActiveTarget = useInteractionState((s) => s.setActiveTarget)
  const { hovered, onPointerOver, onPointerOut } = useInteractiveHover()
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
      onClick={() => setActiveTarget('skills')}
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
        <BookRow y={1.12} count={7} offset={6} />
        <BookRow y={1.67} count={5} offset={9} />
      </group>
    </group>
  )
}

function BookRow({ y, count, offset }: { y: number; count: number; offset: number }) {
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
      result.push({ x: x + width / 2, width, height, lean, color })
      x += width + 0.008
    }
    return result
  }, [count, offset])

  return (
    <group position={[0, y, 0.02]}>
      {books.map((book, i) => (
        <mesh
          key={i}
          position={[book.x, book.height / 2, 0]}
          rotation={[0, 0, book.lean]}
          userData={{ isBook: true }}
        >
          <boxGeometry args={[book.width, book.height, 0.2]} />
          <meshStandardMaterial
            color={book.color}
            emissive={book.color}
            emissiveIntensity={0}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}
