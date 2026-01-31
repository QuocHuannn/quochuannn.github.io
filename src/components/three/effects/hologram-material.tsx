import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Custom hologram shader with scanlines and edge glow
export const HologramMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00ffff'),
    uOpacity: 0.6,
  },
  // Vertex shader
  `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;

    void main() {
      // Scanline effect
      float scanline = sin(vUv.y * 100.0 + uTime * 2.0) * 0.1 + 0.9;

      // Edge glow - stronger at edges
      float edge = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0);
      edge *= pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0);

      // Subtle flicker
      float flicker = sin(uTime * 10.0) * 0.05 + 0.95;

      vec3 finalColor = uColor * scanline * flicker;
      float alpha = uOpacity * edge;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

extend({ HologramMaterial })

// Export type for ref usage
export type HologramMaterialType = InstanceType<typeof HologramMaterial>
