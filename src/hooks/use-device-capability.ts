import { useState, useEffect } from 'react'

export type QualityLevel = 'high' | 'medium' | 'low'

interface DeviceCapability {
  isMobile: boolean
  isLowEnd: boolean
  pixelRatio: number
  quality: QualityLevel
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    isMobile: false,
    isLowEnd: false,
    pixelRatio: 1,
    quality: 'high',
  })

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const cores = navigator.hardwareConcurrency || 4
    const isLowEnd = cores <= 4 || isMobile
    const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)

    // Determine quality level based on device capabilities
    let quality: QualityLevel = 'high'
    if (isMobile && cores <= 4) quality = 'low'
    else if (isMobile || cores <= 6) quality = 'medium'

    setCapability({ isMobile, isLowEnd, pixelRatio, quality })
  }, [])

  return capability
}
