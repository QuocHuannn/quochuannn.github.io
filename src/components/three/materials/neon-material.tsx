import { MeshStandardMaterial } from 'three'

export const NEON_COLORS = {
  cyan: '#00ffff',
  magenta: '#ff00ff',
  green: '#00ff88',
  purple: '#8800ff',
} as const

export type NeonColorKey = keyof typeof NEON_COLORS

export function createNeonMaterial(color: NeonColorKey): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: NEON_COLORS[color],
    emissive: NEON_COLORS[color],
    emissiveIntensity: 2.5,
    toneMapped: false, // Allows values >1 for bloom pickup
  })
}
