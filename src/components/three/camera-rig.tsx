import { OrthographicCamera, CameraControls } from '@react-three/drei'

// Isometric camera constants
const CAMERA_POSITION: [number, number, number] = [10, 10, 10]
const CAMERA_ZOOM = 50

// Orbit control limits (radians) - prevents extreme angles
const MIN_POLAR = Math.PI / 4      // 45deg from top
const MAX_POLAR = Math.PI / 2.5    // ~72deg from top
const AZIMUTH_LIMIT = Math.PI / 4  // ±45deg horizontal

export function CameraRig() {
  return (
    <>
      <OrthographicCamera
        makeDefault
        position={CAMERA_POSITION}
        zoom={CAMERA_ZOOM}
        near={0.1}
        far={1000}
      />
      <CameraControls
        minPolarAngle={MIN_POLAR}
        maxPolarAngle={MAX_POLAR}
        minAzimuthAngle={-AZIMUTH_LIMIT}
        maxAzimuthAngle={AZIMUTH_LIMIT}
        dollySpeed={0}
      />
    </>
  )
}
