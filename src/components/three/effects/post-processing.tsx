import { EffectComposer, Bloom } from '@react-three/postprocessing'
import type { QualityLevel } from '@/hooks/use-device-capability'

interface PostProcessingProps {
  enabled?: boolean
  quality?: QualityLevel
}

// Intensity settings per quality level
const INTENSITY_MAP: Record<QualityLevel, number> = {
  high: 1.5,
  medium: 1.0,
  low: 0.6,
}

export function PostProcessing({ enabled = true, quality = 'high' }: PostProcessingProps) {
  if (!enabled) return null

  const intensity = INTENSITY_MAP[quality]
  const useMipmapBlur = quality === 'high'

  return (
    <EffectComposer>
      <Bloom
        intensity={intensity}
        luminanceThreshold={1}
        luminanceSmoothing={0.9}
        mipmapBlur={useMipmapBlur}
      />
    </EffectComposer>
  )
}
