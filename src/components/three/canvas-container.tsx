import { Canvas } from '@react-three/fiber'
import { Suspense, Component, type ReactNode, useEffect, useRef } from 'react'
import { ACESFilmicToneMapping } from 'three'
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
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle WebGL context lost - attempt recovery
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const canvas = el.querySelector('canvas')
    if (!canvas) return

    const onLost = (e: Event) => {
      e.preventDefault()
      console.warn('WebGL context lost, attempting restore...')
    }
    const onRestored = () => {
      console.log('WebGL context restored')
      window.location.reload()
    }

    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full" role="img" aria-label="3D portfolio scene">
      <ThreeErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Canvas
            shadows
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
              toneMapping: ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
            }}
            dpr={[1, getDevicePixelRatio()]}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  )
}
