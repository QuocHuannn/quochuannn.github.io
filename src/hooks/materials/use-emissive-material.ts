import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

export function useEmissiveMaterial(color = '#fff5e1', emissiveIntensity = 1.0) {
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity,
      roughness: 0.5,
      metalness: 0,
    })
  }, [color, emissiveIntensity])

  useEffect(() => () => { material.dispose() }, [material])

  return material
}
