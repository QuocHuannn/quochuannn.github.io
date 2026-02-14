import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

export function useFabricMaterial(color = '#4a4a4a', roughness = 0.9) {
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
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
        }`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        // Cross-weave pattern
        float scaleX = vUv2.x * 120.0;
        float scaleY = vUv2.y * 120.0;
        float warpX = sin(scaleX * 3.14159) * 0.5 + 0.5;
        float warpY = sin(scaleY * 3.14159) * 0.5 + 0.5;
        float weave = warpX * warpY;

        // Darken at intersections for bump illusion
        float intersection = (1.0 - warpX) * (1.0 - warpY);
        float shadow = intersection * 0.15;

        // Subtle fuzz noise for softness
        float fuzz = hash(vUv2 * 400.0) * 0.04;

        diffuseColor.rgb *= (1.0 + weave * 0.08 - shadow + fuzz);`
      )
    }

    return mat
  }, [color, roughness])

  useEffect(() => () => { material.dispose() }, [material])

  return material
}
