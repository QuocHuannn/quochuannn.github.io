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
        }`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float grain = hash(vUv2 * 100.0) * 0.1;
        float bands = sin(vUv2.y * 30.0 + hash(vUv2 * 50.0) * 2.0) * 0.05;
        diffuseColor.rgb *= (1.0 + grain + bands);`
      )
    }

    return mat
  }, [color])

  useEffect(() => () => { material.dispose() }, [material])

  return material
}
