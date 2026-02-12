import { useRef, useCallback } from 'react'
import { useCanvasTexture } from './use-canvas-texture'

const CODE_LINES = [
  'const scene = new THREE.Scene();',
  'const camera = new PerspectiveCamera();',
  'const renderer = new WebGLRenderer();',
  '',
  'function animate() {',
  '  requestAnimationFrame(animate);',
  '  renderer.render(scene, cam);',
  '}',
  '',
  'const geometry = new BoxGeometry();',
  'const material = new MeshStandard({',
  '  color: 0xff6644,',
  '  roughness: 0.7,',
  '});',
  'const mesh = new Mesh(geo, mat);',
  'scene.add(mesh);',
  '',
  'const light = new DirectionalLight();',
  'light.position.set(4, 6, 3);',
  'scene.add(light);',
  '',
  '// Post-processing',
  'const composer = new EffectComposer();',
  'composer.addPass(new RenderPass());',
  'composer.addPass(new BloomPass());',
]

export function useCodeScrollCanvas(width = 512, height = 256) {
  const offsetRef = useRef(0)

  const draw = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    ctx.fillStyle = '#1e1e1e'
    ctx.fillRect(0, 0, width, height)

    ctx.font = '14px monospace'
    const lineHeight = 20
    const visibleLines = Math.ceil(height / lineHeight) + 1

    offsetRef.current = (time * 12) % (CODE_LINES.length * lineHeight)

    for (let i = 0; i < visibleLines; i++) {
      const lineIndex = Math.floor(offsetRef.current / lineHeight) + i
      const line = CODE_LINES[lineIndex % CODE_LINES.length]
      const y = (i * lineHeight) - (offsetRef.current % lineHeight) + 20

      // Syntax coloring
      if (line.startsWith('//') || line.startsWith('  //')) {
        ctx.fillStyle = '#6a9955'
      } else if (line.startsWith('const ') || line.startsWith('function ')) {
        ctx.fillStyle = '#569cd6'
      } else {
        ctx.fillStyle = '#d4d4d4'
      }
      ctx.fillText(line, 10, y)
    }

    // Line number gutter
    ctx.fillStyle = '#858585'
    ctx.font = '12px monospace'
    for (let i = 0; i < visibleLines; i++) {
      const lineNum = (Math.floor(offsetRef.current / lineHeight) + i) % CODE_LINES.length + 1
      const y = (i * lineHeight) - (offsetRef.current % lineHeight) + 20
      ctx.fillText(String(lineNum).padStart(2, ' '), 0, y)
    }
  }, [width, height])

  return useCanvasTexture(width, height, draw, 10)
}
