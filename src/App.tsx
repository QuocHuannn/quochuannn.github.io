import { useWebGLSupport } from '@/hooks/use-webgl-support'
import { CanvasContainer } from '@/components/three/canvas-container'
import { OverlayPortal } from '@/components/overlays/overlay-portal'
import { HoverTooltip } from '@/components/overlays/hover-tooltip'
import { StaticFallback } from '@/components/fallback/static-fallback'

export default function App() {
  const { supported, loading } = useWebGLSupport()

  // Show loading state while checking WebGL support
  if (loading) {
    return <div className="min-h-screen bg-[#050510]" />
  }

  // Show static fallback if WebGL not supported
  if (!supported) {
    return <StaticFallback />
  }

  return (
    <div className="min-h-screen bg-[#050510]">
      <CanvasContainer />
      <OverlayPortal />
      <HoverTooltip />
    </div>
  )
}
