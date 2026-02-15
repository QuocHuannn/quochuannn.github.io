import { create } from 'zustand'
import type { CameraPresetName } from '@/config/camera-presets'

export type InteractionTarget =
  | 'none'
  | 'about'
  | 'skills'
  | 'projects'
  | 'contact'

interface InteractionState {
  activeTarget: InteractionTarget
  hoveredTarget: InteractionTarget
  cameraPreset: CameraPresetName
  isCameraAnimating: boolean
  setActiveTarget: (target: InteractionTarget) => void
  setHoveredTarget: (target: InteractionTarget) => void
  setCameraPreset: (preset: CameraPresetName) => void
  setCameraAnimating: (v: boolean) => void
  closeOverlay: () => void
}

export const useInteractionState = create<InteractionState>((set) => ({
  activeTarget: 'none',
  hoveredTarget: 'none',
  cameraPreset: 'overview',
  isCameraAnimating: false,
  setActiveTarget: (target) => set({ activeTarget: target }),
  setHoveredTarget: (target) => set({ hoveredTarget: target }),
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  setCameraAnimating: (v) => set({ isCameraAnimating: v }),
  closeOverlay: () => set({ activeTarget: 'none', cameraPreset: 'overview' }),
}))
