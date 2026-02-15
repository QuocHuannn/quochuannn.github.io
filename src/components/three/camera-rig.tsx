import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import gsap from 'gsap'
import * as THREE from 'three'
import { CAMERA_PRESETS, PRESET_TO_TARGET } from '@/config/camera-presets'
import { useInteractionState } from '@/hooks/use-interaction-state'
import { playSound } from '@/hooks/use-audio-manager'

const DEFAULT_PRESET = CAMERA_PRESETS.overview

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const cameraPreset = useInteractionState((s) => s.cameraPreset)
  const setCameraAnimating = useInteractionState((s) => s.setCameraAnimating)
  const setActiveTarget = useInteractionState((s) => s.setActiveTarget)

  const { invalidate } = useThree()

  // Animate camera on preset change
  useEffect(() => {
    const controls = controlsRef.current
    const camera = cameraRef.current
    if (!controls || !camera) return

    const preset = CAMERA_PRESETS[cameraPreset]
    if (!preset) return

    // Kill any running animation
    if (tlRef.current) tlRef.current.kill()

    // Play whoosh sound for camera transitions (not for initial overview)
    if (cameraPreset !== 'overview') playSound('whoosh')

    // Disable controls during animation
    controls.enabled = false
    setCameraAnimating(true)

    const posObj = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
    const tgtObj = { x: controls.target.x, y: controls.target.y, z: controls.target.z }

    const tl = gsap.timeline({
      onUpdate: () => {
        camera.position.set(posObj.x, posObj.y, posObj.z)
        controls.target.set(tgtObj.x, tgtObj.y, tgtObj.z)
        controls.update()
        invalidate()
      },
      onComplete: () => {
        applyPresetConstraints(controls, cameraPreset)
        controls.enabled = true
        setCameraAnimating(false)
        // Open overlay after fly-to completes
        const overlayTarget = PRESET_TO_TARGET[cameraPreset]
        if (overlayTarget !== 'none') {
          setActiveTarget(overlayTarget)
        }
      },
    })

    tl.to(posObj, {
      x: preset.position[0],
      y: preset.position[1],
      z: preset.position[2],
      duration: 1.2,
      ease: 'power2.out',
    }, 0)

    tl.to(tgtObj, {
      x: preset.target[0],
      y: preset.target[1],
      z: preset.target[2],
      duration: 1.2,
      ease: 'power2.out',
    }, 0)

    tlRef.current = tl

    return () => { tl.kill() }
  }, [cameraPreset]) // eslint-disable-line react-hooks/exhaustive-deps

  // ESC key returns to overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && cameraPreset !== 'overview') {
        useInteractionState.getState().closeOverlay()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cameraPreset])

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={DEFAULT_PRESET.position}
        fov={28}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom={true}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={DEFAULT_PRESET.controls?.minDistance ?? 8}
        maxDistance={DEFAULT_PRESET.controls?.maxDistance ?? 16}
        minPolarAngle={DEFAULT_PRESET.controls?.minPolarAngle ?? Math.PI / 4}
        maxPolarAngle={DEFAULT_PRESET.controls?.maxPolarAngle ?? Math.PI / 2.5}
        minAzimuthAngle={DEFAULT_PRESET.controls?.minAzimuthAngle ?? -Math.PI / 6}
        maxAzimuthAngle={DEFAULT_PRESET.controls?.maxAzimuthAngle ?? Math.PI / 3}
        target={DEFAULT_PRESET.target}
        autoRotate={false}
      />
    </>
  )
}

function applyPresetConstraints(
  controls: OrbitControlsImpl,
  presetName: string
) {
  const preset = CAMERA_PRESETS[presetName as keyof typeof CAMERA_PRESETS]
  if (!preset?.controls) return
  const c = preset.controls
  if (c.minDistance !== undefined) controls.minDistance = c.minDistance
  if (c.maxDistance !== undefined) controls.maxDistance = c.maxDistance
  if (c.minPolarAngle !== undefined) controls.minPolarAngle = c.minPolarAngle
  if (c.maxPolarAngle !== undefined) controls.maxPolarAngle = c.maxPolarAngle
  if (c.minAzimuthAngle !== undefined) controls.minAzimuthAngle = c.minAzimuthAngle
  if (c.maxAzimuthAngle !== undefined) controls.maxAzimuthAngle = c.maxAzimuthAngle
}
