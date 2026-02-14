import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vPosition;
  void main() {
    // Fade opacity based on distance from top (window source)
    float fadeY = smoothstep(-1.5, 1.5, vPosition.y);
    // Fade edges horizontally
    float fadeX = 1.0 - smoothstep(0.3, 0.6, abs(vPosition.x));
    // Subtle pulse animation
    float pulse = 0.9 + sin(uTime * 0.5) * 0.1;
    float alpha = fadeY * fadeX * 0.08 * pulse;
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
      position={[0, 1.2, -0.8]}
      rotation={[Math.PI / 2.5, 0, 0]}
    >
      <planeGeometry args={[1.2, 3, 1, 8]} />
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
