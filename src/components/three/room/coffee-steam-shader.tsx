import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { generatePerlinTexture } from '@/utils/generate-perlin-texture'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform sampler2D uPerlinTexture;
  varying vec2 vUv;

  vec2 rotate2D(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
  }

  void main() {
    vec3 newPosition = position;
    vUv = uv;

    // Twist based on perlin noise
    float twistPerlin = texture2D(
      uPerlinTexture,
      vec2(0.5, uv.y * 0.2 - uTime * 0.005)
    ).r;
    float angle = twistPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind displacement scaled by height squared
    vec2 windOffset = vec2(
      texture2D(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
      texture2D(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 1.0;
    newPosition.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform sampler2D uPerlinTexture;
  varying vec2 vUv;

  void main() {
    // Smoke pattern from perlin texture
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;

    float smoke = texture2D(uPerlinTexture, smokeUv).r;
    smoke = smoothstep(0.4, 1.0, smoke);

    // Edge fadeout on all sides
    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.2, vUv.y);

    // Warm white steam color
    gl_FragColor = vec4(1.0, 0.98, 0.95, smoke);
  }
`

interface CoffeeSteamShaderProps {
  position: [number, number, number]
}

export function CoffeeSteamShader({ position }: CoffeeSteamShaderProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const perlinTexture = useMemo(() => generatePerlinTexture(256, 42), [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPerlinTexture: { value: perlinTexture },
    }),
    [perlinTexture],
  )

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
    }
  })

  return (
    <Billboard position={position}>
      <planeGeometry args={[0.15, 0.4, 16, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </Billboard>
  )
}
