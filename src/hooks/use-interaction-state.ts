import { create } from 'zustand'

export type InteractionTarget =
  | 'none'
  | 'skills-3d'
  | 'skills-frontend'
  | 'skills-backend'
  | 'skills-tools'
  | 'contact'

interface InteractionState {
  activeTarget: InteractionTarget
  hoveredTarget: InteractionTarget
  setActiveTarget: (target: InteractionTarget) => void
  setHoveredTarget: (target: InteractionTarget) => void
  closeOverlay: () => void
}

export const useInteractionState = create<InteractionState>((set) => ({
  activeTarget: 'none',
  hoveredTarget: 'none',
  setActiveTarget: (target) => set({ activeTarget: target }),
  setHoveredTarget: (target) => set({ hoveredTarget: target }),
  closeOverlay: () => set({ activeTarget: 'none' }),
}))
