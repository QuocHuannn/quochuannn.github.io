import { useWebGLSupport } from '@/hooks/use-webgl-support'
import { CanvasContainer } from '@/components/three/canvas-container'
import { OverlayPortal } from '@/components/overlays/overlay-portal'
import { HoverTooltip } from '@/components/overlays/hover-tooltip'
import { WelcomeIntro } from '@/components/overlays/welcome-intro'
import { NavigationHud } from '@/components/ui/navigation-hud'
import { StaticFallback } from '@/components/fallback/static-fallback'

export default function App() {
  const { supported, loading } = useWebGLSupport()

  if (loading) {
    return <div className="min-h-screen bg-[#050510]" />
  }

  if (!supported) {
    return <StaticFallback />
  }

  return (
    <div className="min-h-screen bg-[#050510]">
      <CanvasContainer />
      <OverlayPortal />
      <HoverTooltip />
      <NavigationHud />
      <WelcomeIntro />
    </div>
  )
}
