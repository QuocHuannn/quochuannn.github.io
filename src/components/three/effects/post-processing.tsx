import { EffectComposer, Bloom, N8AO, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import type { QualityLevel } from '@/hooks/use-device-capability'

interface PostProcessingProps {
  enabled?: boolean
  quality?: QualityLevel
}

export function PostProcessing({ enabled = true, quality = 'high' }: PostProcessingProps) {
  if (!enabled) return null

  const multisampling = quality === 'high' ? 4 : quality === 'medium' ? 2 : 0

  // Render quality-specific EffectComposer to avoid conditional children type issues
  if (quality === 'low') {
    return (
      <EffectComposer multisampling={0}>
        <Vignette
          offset={0.3}
          darkness={0.4}
          blendFunction={BlendFunction.NORMAL}
        />
        <Bloom
          intensity={0.3}
          luminanceThreshold={1.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    )
  }

  return (
    <EffectComposer multisampling={multisampling}>
      <N8AO
        aoRadius={0.4}
        intensity={quality === 'high' ? 1.5 : 1}
        quality="medium"
        distanceFalloff={0.8}
        halfRes
      />
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
      <Bloom
        intensity={quality === 'high' ? 0.5 : 0.4}
        luminanceThreshold={quality === 'high' ? 0.9 : 1.0}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  )
}
