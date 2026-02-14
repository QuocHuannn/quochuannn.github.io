import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
    // Fade from tip (top) to base (bottom) of cone
    float fadeY = 1.0 - vUv.y;
    // Fade edges around the circumference
    float angle = atan(vPosition.x, vPosition.z);
    float fadeEdge = 1.0 - smoothstep(0.5, 1.0, abs(sin(angle * 0.5)));
    // Subtle pulse animation
    float pulse = 0.9 + sin(uTime * 0.5) * 0.1;
    float alpha = fadeY * fadeEdge * 0.04 * pulse;
    gl_FragColor = vec4(1.0, 0.98, 0.92, alpha);
  }
`

export function WindowLightBeam() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 } }),
    []
  )

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime
    }
  })

  return (
    <mesh
      position={[0, 0.5, -1.0]}
      rotation={[Math.PI / 2.3, 0, 0]}
    >
      <coneGeometry args={[1.2, 3.5, 12, 1, true]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
