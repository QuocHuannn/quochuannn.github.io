import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

export function useMetalMaterial(color = '#888888', roughness = 0.3) {
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.9,
    })
  }, [color, roughness])

  useEffect(() => () => { material.dispose() }, [material])

  return material
}
