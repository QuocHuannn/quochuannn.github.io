import { CameraRig } from './camera-rig'
import { Lighting } from './lighting'

export function Scene() {
  return (
    <>
      <CameraRig />
      <Lighting />
      {/* Placeholder geometry for testing */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.5, 2]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </>
  )
}
