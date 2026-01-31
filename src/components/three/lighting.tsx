export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 10, 50]} />
    </>
  )
}
