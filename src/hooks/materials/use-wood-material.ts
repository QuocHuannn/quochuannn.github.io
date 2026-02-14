import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

export function useWoodMaterial(color = '#8B6F47') {
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.7,
      metalness: 0,
    })

    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        varying vec2 vUv2;`
      )
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vUv2 = uv;`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        varying vec2 vUv2;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float noise2d(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise2d(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        // Directional grain along Y
        float grainY = vUv2.y * 40.0;
        float warp = fbm(vUv2 * vec2(3.0, 8.0)) * 3.0;
        float grain = sin(grainY + warp) * 0.5 + 0.5;
        grain = smoothstep(0.3, 0.7, grain) * 0.12;

        // Fine grain detail
        float fine = noise2d(vUv2 * vec2(8.0, 80.0)) * 0.06;

        // Warm/cool color shift
        float shift = fbm(vUv2 * 5.0);
        vec3 warm = vec3(0.04, 0.02, -0.02);
        vec3 cool = vec3(-0.02, 0.0, 0.03);
        vec3 tint = mix(cool, warm, shift);

        diffuseColor.rgb *= (1.0 + grain + fine);
        diffuseColor.rgb += tint;`
      )
    }

    return mat
  }, [color])

  useEffect(() => () => { material.dispose() }, [material])

  return material
}
