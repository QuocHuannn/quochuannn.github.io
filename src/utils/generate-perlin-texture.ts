import * as THREE from 'three'

// Seeded pseudo-random for deterministic noise
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Generate a grid of random gradient vectors
function createGradientGrid(gridSize: number, rand: () => number): Float32Array {
  const grid = new Float32Array(gridSize * gridSize * 2)
  for (let i = 0; i < gridSize * gridSize; i++) {
    const angle = rand() * Math.PI * 2
    grid[i * 2] = Math.cos(angle)
    grid[i * 2 + 1] = Math.sin(angle)
  }
  return grid
}

function smoothstep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10) // quintic fade
}

function dotGradient(
  grid: Float32Array,
  gridSize: number,
  ix: number,
  iy: number,
  dx: number,
  dy: number,
): number {
  const wrapped_ix = ((ix % gridSize) + gridSize) % gridSize
  const wrapped_iy = ((iy % gridSize) + gridSize) % gridSize
  const idx = (wrapped_iy * gridSize + wrapped_ix) * 2
  return grid[idx] * dx + grid[idx + 1] * dy
}

function perlinNoise(
  x: number,
  y: number,
  grid: Float32Array,
  gridSize: number,
): number {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const dx = x - x0
  const dy = y - y0

  const n00 = dotGradient(grid, gridSize, x0, y0, dx, dy)
  const n10 = dotGradient(grid, gridSize, x0 + 1, y0, dx - 1, dy)
  const n01 = dotGradient(grid, gridSize, x0, y0 + 1, dx, dy - 1)
  const n11 = dotGradient(grid, gridSize, x0 + 1, y0 + 1, dx - 1, dy - 1)

  const u = smoothstep(dx)
  const v = smoothstep(dy)

  const nx0 = n00 + u * (n10 - n00)
  const nx1 = n01 + u * (n11 - n01)

  return nx0 + v * (nx1 - nx0)
}

/**
 * Generate a tileable Perlin noise CanvasTexture procedurally.
 * Deterministic via seed for consistent results across renders.
 */
export function generatePerlinTexture(
  size = 256,
  seed = 42,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.createImageData(size, size)

  const gridSize = 8
  const rand = seededRandom(seed)
  const grid = createGradientGrid(gridSize, rand)
  const scale = gridSize / size

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Multi-octave for richer noise
      let value = 0
      value += perlinNoise(x * scale, y * scale, grid, gridSize) * 1.0
      value += perlinNoise(x * scale * 2, y * scale * 2, grid, gridSize) * 0.5
      value += perlinNoise(x * scale * 4, y * scale * 4, grid, gridSize) * 0.25

      // Normalize from [-1.75, 1.75] to [0, 1]
      const normalized = (value / 1.75 + 1) * 0.5
      const byte = Math.max(0, Math.min(255, Math.floor(normalized * 255)))

      const idx = (y * size + x) * 4
      imageData.data[idx] = byte
      imageData.data[idx + 1] = byte
      imageData.data[idx + 2] = byte
      imageData.data[idx + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}
