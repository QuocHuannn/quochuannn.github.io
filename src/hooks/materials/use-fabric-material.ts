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
        float weave = hash(vUv2 * 200.0) * 0.05;
        diffuseColor.rgb *= (1.0 + weave);`
      )
    }

    return mat
  }, [color, roughness])

  useEffect(() => () => { material.dispose() }, [material])

  return material
}
