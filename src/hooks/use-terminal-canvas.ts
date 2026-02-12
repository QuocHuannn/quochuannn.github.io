import { useCallback } from 'react'
import { useCanvasTexture } from './use-canvas-texture'

const TERMINAL_LINES = [
  '$ npm run dev',
  '',
  'VITE v6.0.0  ready in 342ms',
  '',
  '  ➜  Local:   http://localhost:5173/',
  '  ➜  Network: use --host to expose',
  '',
  '$ git status',
  'On branch main',
  'Changes not staged for commit:',
  '  modified:   src/App.tsx',
  '  modified:   src/scene.tsx',
  '',
  '$',
]

export function useTerminalCanvas(width = 512, height = 256) {
  const draw = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    ctx.fillStyle = '#0c0c0c'
    ctx.fillRect(0, 0, width, height)

    ctx.font = '13px monospace'
    const lineHeight = 18

    TERMINAL_LINES.forEach((line, index) => {
      const y = 18 + index * lineHeight
      if (line.startsWith('$')) {
        ctx.fillStyle = '#50fa7b'
      } else if (line.startsWith('  ➜')) {
        ctx.fillStyle = '#8be9fd'
      } else {
        ctx.fillStyle = '#f8f8f2'
      }
      ctx.fillText(line, 8, y)
    })

    // Blinking cursor
    const cursorBlink = Math.floor(time * 2) % 2
    if (cursorBlink) {
      const cursorY = 18 + (TERMINAL_LINES.length - 1) * lineHeight
      ctx.fillStyle = '#50fa7b'
      ctx.fillRect(22, cursorY - 13, 8, 16)
    }
  }, [width, height])

  return useCanvasTexture(width, height, draw, 2)
}
