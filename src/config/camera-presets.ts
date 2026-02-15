import type { InteractionTarget } from '@/hooks/use-interaction-state'

export type CameraPresetName = 'overview' | 'desk' | 'bookshelf' | 'bed' | 'window'

export interface CameraPreset {
  position: [number, number, number]
  target: [number, number, number]
  fov?: number
  controls?: {
    minDistance?: number
    maxDistance?: number
    minPolarAngle?: number
    maxPolarAngle?: number
    minAzimuthAngle?: number
    maxAzimuthAngle?: number
  }
}

export const CAMERA_PRESETS: Record<CameraPresetName, CameraPreset> = {
  overview: {
    position: [8, 6, 8],
    target: [0, 1, -0.5],
    controls: {
      minDistance: 8,
      maxDistance: 16,
      minPolarAngle: Math.PI / 4,
      maxPolarAngle: Math.PI / 2.5,
      minAzimuthAngle: -Math.PI / 6,
      maxAzimuthAngle: Math.PI / 3,
    },
  },
  desk: {
    position: [3.5, 3, 2],
    target: [1, 1.1, -1.4],
    controls: {
      minDistance: 3,
      maxDistance: 6,
      minPolarAngle: Math.PI / 4,
      maxPolarAngle: Math.PI / 2.2,
      minAzimuthAngle: -Math.PI / 8,
      maxAzimuthAngle: Math.PI / 4,
    },
  },
  bookshelf: {
    position: [0.5, 3, 3],
    target: [-2.5, 1.1, -0.5],
    controls: {
      minDistance: 3,
      maxDistance: 6,
      minPolarAngle: Math.PI / 4,
      maxPolarAngle: Math.PI / 2.2,
      minAzimuthAngle: -Math.PI / 4,
      maxAzimuthAngle: Math.PI / 6,
    },
  },
  bed: {
    position: [1, 3.5, 4],
    target: [-1.8, 0.5, 0.8],
    controls: {
      minDistance: 3,
      maxDistance: 6,
      minPolarAngle: Math.PI / 4,
      maxPolarAngle: Math.PI / 2.2,
      minAzimuthAngle: -Math.PI / 6,
      maxAzimuthAngle: Math.PI / 3,
    },
  },
  window: {
    position: [2, 4, 1],
    target: [-1, 1.5, -2],
    controls: {
      minDistance: 3,
      maxDistance: 6,
      minPolarAngle: Math.PI / 4,
      maxPolarAngle: Math.PI / 2.2,
      minAzimuthAngle: -Math.PI / 4,
      maxAzimuthAngle: Math.PI / 4,
    },
  },
}

/** Map camera preset to overlay target */
export const PRESET_TO_TARGET: Record<CameraPresetName, InteractionTarget> = {
  overview: 'none',
  desk: 'projects',
  bookshelf: 'skills',
  bed: 'about',
  window: 'contact',
}

/** Map interaction target to camera preset */
export const TARGET_TO_PRESET: Partial<Record<InteractionTarget, CameraPresetName>> = {
  projects: 'desk',
  skills: 'bookshelf',
  about: 'bed',
  contact: 'window',
}
