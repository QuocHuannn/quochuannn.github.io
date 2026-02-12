import { PerspectiveCamera, OrbitControls } from '@react-three/drei'

const CAMERA_POSITION: [number, number, number] = [5, 5, 5]
const CAMERA_TARGET: [number, number, number] = [0, 1, 0]
const CAMERA_FOV = 40

export function CameraRig() {
  return (
    <>
      <PerspectiveCamera makeDefault position={CAMERA_POSITION} fov={CAMERA_FOV} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={12}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 3}
        target={CAMERA_TARGET}
        autoRotate={false}
      />
    </>
  )
}
