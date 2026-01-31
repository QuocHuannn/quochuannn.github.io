import { Html } from '@react-three/drei'

interface FloatingLabelProps {
  position: [number, number, number]
  label: string
  color?: string
  pulse?: boolean
}

/**
 * Floating 3D label that renders as HTML overlay
 * Used to indicate interactive objects in the scene
 */
export function FloatingLabel({
  position,
  label,
  color = '#00ffff',
  pulse = true,
}: FloatingLabelProps) {
  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
          pulse ? 'animate-pulse' : ''
        }`}
        style={{
          color,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: `1px solid ${color}40`,
          textShadow: `0 0 10px ${color}`,
        }}
      >
        {label}
      </div>
    </Html>
  )
}
