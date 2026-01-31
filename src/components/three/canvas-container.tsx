import { Canvas } from '@react-three/fiber'
import { Suspense, Component, type ReactNode } from 'react'
import { Scene } from './scene'
import { LoadingScreen } from '../ui/loading-screen'

// SSR-safe pixel ratio calculation
const getDevicePixelRatio = () => {
  if (typeof window === 'undefined') return 1
  return Math.min(window.devicePixelRatio, 1.5)
}

// Error boundary for Three.js rendering failures
interface ErrorBoundaryState {
  hasError: boolean
}

class ThreeErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-xl mb-2">WebGL Not Available</p>
            <p className="text-sm">Please use a browser that supports WebGL</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export function CanvasContainer() {
  return (
    <div className="fixed inset-0 w-full h-full" role="img" aria-label="3D portfolio scene">
      <ThreeErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Canvas
            gl={{ antialias: true, alpha: false }}
            dpr={[1, getDevicePixelRatio()]}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  )
}
