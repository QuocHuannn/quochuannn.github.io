import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { progress, active } = useProgress()

  if (!active) return null

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-cyan-400 text-2xl mb-4">Loading</div>
        <div className="w-48 h-1 bg-gray-800 rounded">
          <div
            className="h-full bg-cyan-400 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-gray-500 mt-2">{Math.round(progress)}%</div>
      </div>
    </div>
  )
}
