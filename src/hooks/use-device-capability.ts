import { useState, useEffect } from 'react'

interface DeviceCapability {
  isMobile: boolean
  isLowEnd: boolean
  quality: 'high' | 'low'
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    isMobile: false,
    isLowEnd: false,
    quality: 'high',
  })

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isLowEnd = navigator.hardwareConcurrency <= 4

    setCapability({
      isMobile,
      isLowEnd,
      quality: isMobile || isLowEnd ? 'low' : 'high',
    })
  }, [])

  return capability
}
