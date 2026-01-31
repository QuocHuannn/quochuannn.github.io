// Cyberpunk color palette
const CYBERPUNK_BG = '#050510'
const CYBERPUNK_RIM = '#4a00ff'
const CYBERPUNK_FILL = '#00ffff'

export function Lighting() {
  return (
    <>
      {/* Minimal ambient - let emissives do the work */}
      <ambientLight intensity={0.1} color="#1a1a2e" />

      {/* Rim light from window direction */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color={CYBERPUNK_RIM}
      />

      {/* Cyan fill light from above */}
      <pointLight
        position={[0, 3, 0]}
        intensity={0.2}
        color={CYBERPUNK_FILL}
        distance={10}
        decay={2}
      />

      {/* Dark cyberpunk background */}
      <color attach="background" args={[CYBERPUNK_BG]} />

      {/* Atmospheric fog for depth */}
      <fog attach="fog" args={[CYBERPUNK_BG, 5, 30]} />
    </>
  )
}
