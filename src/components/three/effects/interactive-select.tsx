import { useState, type ReactNode } from 'react'
import { Select } from '@react-three/postprocessing'

interface InteractiveSelectProps {
  children: ReactNode
}

/**
 * Wraps children in a Select context for Outline post-processing.
 * When hovered, the Outline effect will highlight the wrapped meshes.
 * This is purely visual - existing hover/click behavior inside children is unaffected.
 */
export function InteractiveSelect({ children }: InteractiveSelectProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Select enabled={hovered}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        {children}
      </group>
    </Select>
  )
}
