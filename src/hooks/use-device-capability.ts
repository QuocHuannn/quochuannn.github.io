import { useMemo } from 'react'

export type QualityLevel = 'high' | 'medium' | 'low'

interface DeviceCapability {
  isMobile: boolean
  isLowEnd: boolean
  pixelRatio: number
  quality: QualityLevel
}

function detectCapability(): DeviceCapability {
  if (typeof window === 'undefined') {
    return { isMobile: false, isLowEnd: false, pixelRatio: 1, quality: 'high' }
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency || 4
  const isLowEnd = cores <= 4 || isMobile
  const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)

  let quality: QualityLevel = 'high'
  if (isMobile && cores <= 4) quality = 'low'
  else if (isMobile || cores <= 6) quality = 'medium'

  return { isMobile, isLowEnd, pixelRatio, quality }
}

export function useDeviceCapability(): DeviceCapability {
  return useMemo(detectCapability, [])
}
