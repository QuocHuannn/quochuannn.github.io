import { useCallback } from 'react'
import { useCanvasTexture } from './use-canvas-texture'

export function useTimeDisplayCanvas(width = 256, height = 128) {
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    // Time display
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 40px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(timeString, width / 2, height / 2 + 12)

    // Date below
    ctx.fillStyle = '#888888'
    ctx.font = '14px sans-serif'
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    ctx.fillText(dateStr, width / 2, height / 2 + 35)

    // Notification dots
    ctx.fillStyle = '#ff4444'
    ctx.beginPath()
    ctx.arc(width - 30, 20, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#44ff44'
    ctx.beginPath()
    ctx.arc(width - 16, 20, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.textAlign = 'start'
  }, [width, height])

  return useCanvasTexture(width, height, draw, 1)
}
