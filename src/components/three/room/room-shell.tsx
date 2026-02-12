import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

const ROOM_WIDTH = 6
const ROOM_DEPTH = 4
const ROOM_HEIGHT = 3

const WINDOW_WIDTH = 1.2
const WINDOW_HEIGHT = 1.5
const WINDOW_CENTER_Y = 1.5
const FRAME_THICKNESS = 0.05
const FRAME_COLOR = '#3d2817'

export function RoomShell() {
  const floorMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#8B6F47',
      roughness: 0.7,
      metalness: 0,
    })
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        varying vec2 vUv2;`
      )
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vUv2 = uv;`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        varying vec2 vUv2;
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float plankId = floor(vUv2.y * 8.0);
        float grain = hash(vec2(plankId, vUv2.x * 20.0)) * 0.08;
        float grout = smoothstep(0.0, 0.04, fract(vUv2.y * 8.0));
        diffuseColor.rgb *= (0.85 + grain) * grout;`
      )
    }
    return mat
  }, [])

  const wallMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#3a3028',
      roughness: 0.85,
      side: THREE.DoubleSide,
    })
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        varying vec2 vUv2;`
      )
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vUv2 = uv;`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        varying vec2 vUv2;
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float noise = hash(vUv2 * 50.0) * 0.03;
        diffuseColor.rgb *= (1.0 + noise);`
      )
    }
    return mat
  }, [])

  const baseboardMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2a2018', roughness: 0.9 }),
    []
  )

  // Back wall split into 4 sections around window
  const halfW = ROOM_WIDTH / 2
  const halfD = ROOM_DEPTH / 2
  const winLeft = -WINDOW_WIDTH / 2
  const winRight = WINDOW_WIDTH / 2
  const winBottom = WINDOW_CENTER_Y - WINDOW_HEIGHT / 2
  const winTop = WINDOW_CENTER_Y + WINDOW_HEIGHT / 2

  return (
    <group name="room-shell">
      {/* Floor with wood planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={floorMaterial}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
      </mesh>

      {/* Back wall - left section */}
      <mesh position={[(winLeft - halfW) / 2 - 0.5, ROOM_HEIGHT / 2, -halfD]} material={wallMaterial} receiveShadow>
        <planeGeometry args={[halfW + winLeft - 0.5, ROOM_HEIGHT]} />
      </mesh>

      {/* Back wall - right section */}
      <mesh position={[(winRight + halfW) / 2 + 0.5, ROOM_HEIGHT / 2, -halfD]} material={wallMaterial} receiveShadow>
        <planeGeometry args={[halfW - winRight - 0.5, ROOM_HEIGHT]} />
      </mesh>

      {/* Back wall - above window */}
      <mesh position={[0, (winTop + ROOM_HEIGHT) / 2, -halfD]} material={wallMaterial} receiveShadow>
        <planeGeometry args={[WINDOW_WIDTH, ROOM_HEIGHT - winTop]} />
      </mesh>

      {/* Back wall - below window */}
      <mesh position={[0, winBottom / 2, -halfD]} material={wallMaterial} receiveShadow>
        <planeGeometry args={[WINDOW_WIDTH, winBottom]} />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-halfW, ROOM_HEIGHT / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={wallMaterial}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
      </mesh>

      {/* Window frame - 4 beams */}
      <WindowFrame />

      {/* Curtains */}
      <Curtain position={[-WINDOW_WIDTH / 2 - 0.15, WINDOW_CENTER_Y + 0.1, -halfD + 0.03]} />
      <Curtain position={[WINDOW_WIDTH / 2 + 0.15, WINDOW_CENTER_Y + 0.1, -halfD + 0.03]} />

      {/* Baseboard - back wall */}
      <mesh position={[0, 0.04, -halfD + 0.025]} material={baseboardMaterial}>
        <boxGeometry args={[ROOM_WIDTH, 0.08, 0.05]} />
      </mesh>

      {/* Baseboard - left wall */}
      <mesh position={[-halfW + 0.025, 0.04, 0]} material={baseboardMaterial}>
        <boxGeometry args={[0.05, 0.08, ROOM_DEPTH]} />
      </mesh>
    </group>
  )
}

function WindowFrame() {
  const halfD = ROOM_DEPTH / 2
  const frameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: FRAME_COLOR, roughness: 0.6 }),
    []
  )

  return (
    <group position={[0, WINDOW_CENTER_Y, -halfD + 0.01]}>
      {/* Top beam */}
      <RoundedBox args={[WINDOW_WIDTH + 0.1, FRAME_THICKNESS, FRAME_THICKNESS]} radius={0.01} smoothness={2} position={[0, WINDOW_HEIGHT / 2, 0]} material={frameMat} castShadow />
      {/* Bottom beam */}
      <RoundedBox args={[WINDOW_WIDTH + 0.1, FRAME_THICKNESS, FRAME_THICKNESS]} radius={0.01} smoothness={2} position={[0, -WINDOW_HEIGHT / 2, 0]} material={frameMat} castShadow />
      {/* Left beam */}
      <RoundedBox args={[FRAME_THICKNESS, WINDOW_HEIGHT + 0.1, FRAME_THICKNESS]} radius={0.01} smoothness={2} position={[-WINDOW_WIDTH / 2, 0, 0]} material={frameMat} castShadow />
      {/* Right beam */}
      <RoundedBox args={[FRAME_THICKNESS, WINDOW_HEIGHT + 0.1, FRAME_THICKNESS]} radius={0.01} smoothness={2} position={[WINDOW_WIDTH / 2, 0, 0]} material={frameMat} castShadow />
      {/* Center cross vertical */}
      <RoundedBox args={[0.02, WINDOW_HEIGHT, 0.02]} radius={0.005} smoothness={2} position={[0, 0, 0]} material={frameMat} />
      {/* Center cross horizontal */}
      <RoundedBox args={[WINDOW_WIDTH, 0.02, 0.02]} radius={0.005} smoothness={2} position={[0, 0.1, 0]} material={frameMat} />
    </group>
  )
}

function Curtain({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <planeGeometry args={[0.35, WINDOW_HEIGHT + 0.2]} />
      <meshStandardMaterial
        color="#e8d5b7"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
        roughness={0.9}
      />
    </mesh>
  )
}
