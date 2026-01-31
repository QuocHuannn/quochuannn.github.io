import { EffectComposer, Bloom } from '@react-three/postprocessing'

interface PostProcessingProps {
  enabled?: boolean
  quality?: 'high' | 'low'
}

export function PostProcessing({ enabled = true, quality = 'high' }: PostProcessingProps) {
  if (!enabled) return null

  const intensity = quality === 'high' ? 1.5 : 0.8

  return (
    <EffectComposer>
      <Bloom
        intensity={intensity}
        luminanceThreshold={1}
        luminanceSmoothing={0.9}
        mipmapBlur={quality === 'high'}
      />
    </EffectComposer>
  )
}
