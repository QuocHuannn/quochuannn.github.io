import * as THREE from 'three'

export function WindowLightBeam() {
  return (
    <mesh
      position={[0, 1.2, -0.8]}
      rotation={[Math.PI / 2.5, 0, 0]}
    >
      <coneGeometry args={[1.0, 3, 8, 1, true]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.06}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
