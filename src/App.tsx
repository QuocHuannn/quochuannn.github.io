import { CanvasContainer } from '@/components/three/canvas-container'
import { OverlayPortal } from '@/components/overlays/overlay-portal'
import { HoverTooltip } from '@/components/overlays/hover-tooltip'

export default function App() {
  return (
    <div className="min-h-screen bg-[#050510]">
      <CanvasContainer />
      <OverlayPortal />
      <HoverTooltip />
    </div>
  )
}
