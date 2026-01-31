import { useState, useEffect } from 'react'

interface WebGLSupport {
  supported: boolean
  loading: boolean
}

export function useWebGLSupport(): WebGLSupport {
  const [state, setState] = useState<WebGLSupport>({
    supported: true,
    loading: true,
  })

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      setState({ supported: !!gl, loading: false })
    } catch {
      setState({ supported: false, loading: false })
    }
  }, [])

  return state
}
