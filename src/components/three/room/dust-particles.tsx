import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDeviceCapability } from '@/hooks/use-device-capability'

const SPREAD = { x: 3, y: 2.5, z: 2.5 }
const CENTER = { x: 0, y: 1.5, z: -0.5 }

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aBrightness;
  attribute float aPhase;
  uniform float uTime;
  varying float vBrightness;
  void main() {
    vBrightness = aBrightness;
    // Twinkle effect per particle
    float twinkle = 0.7 + sin(uTime * 2.0 + aPhase * 6.28) * 0.3;
    vBrightness *= twinkle;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  varying float vBrightness;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 0.5 * vBrightness * (1.0 - dist * 2.0);
    gl_FragColor = vec4(1.0, 0.92, 0.80, alpha);
  }
`

export function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { quality } = useDeviceCapability()

  const particleCount = quality === 'high' ? 80 : quality === 'medium' ? 40 : 20

  const { positionAttr, sizeAttr, brightnessAttr, phaseAttr, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const brightness = new Float32Array(particleCount)
    const phases = new Float32Array(particleCount)
    const spd = new Float32Array(particleCount)
    const off = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const x = CENTER.x + (Math.random() - 0.5) * SPREAD.x
      const y = CENTER.y + Math.random() * SPREAD.y
      const z = CENTER.z + (Math.random() - 0.5) * SPREAD.z
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      sizes[i] = 0.02 + Math.random() * 0.03
      // Particles in window light beam area are 2x brighter
      const inBeam = z < -0.5 && y > 0.5
      brightness[i] = inBeam ? 2.0 : 1.0
      phases[i] = Math.random()
      spd[i] = 0.0005 + Math.random() * 0.001
      off[i] = Math.random() * Math.PI * 2
    }

    return {
      positionAttr: new THREE.Float32BufferAttribute(pos, 3),
      sizeAttr: new THREE.Float32BufferAttribute(sizes, 1),
      brightnessAttr: new THREE.Float32BufferAttribute(brightness, 1),
      phaseAttr: new THREE.Float32BufferAttribute(phases, 1),
      speeds: spd,
      offsets: off,
    }
  }, [particleCount])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
    const time = clock.elapsedTime

    if (matRef.current) {
      matRef.current.uniforms.uTime.value = time
    }

    for (let i = 0; i < particleCount; i++) {
      let y = posAttr.getY(i) + speeds[i]
      const x = posAttr.getX(i) + Math.sin(time * 0.2 + offsets[i]) * 0.0003
      const z = posAttr.getZ(i) + Math.cos(time * 0.15 + offsets[i]) * 0.0003

      if (y > CENTER.y + SPREAD.y) {
        y = CENTER.y - 0.2
      }

      posAttr.setX(i, x)
      posAttr.setY(i, y)
      posAttr.setZ(i, z)
    }

    posAttr.needsUpdate = true
  })

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  return (
    <points ref={pointsRef} name="dust-particles">
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttr} />
        <primitive attach="attributes-aSize" object={sizeAttr} />
        <primitive attach="attributes-aBrightness" object={brightnessAttr} />
        <primitive attach="attributes-aPhase" object={phaseAttr} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
