import { Selection } from '@react-three/postprocessing'
import { CameraRig } from './camera-rig'
import { Lighting } from './lighting'
import { PostProcessing } from './effects/post-processing'
import { InteractiveSelect } from './effects/interactive-select'
import { RoomShell } from './room/room-shell'
import { DeveloperDesk } from './room/developer-desk'
import { GamingChair } from './room/gaming-chair'
import { Bookshelf } from './room/bookshelf'
import { Bed } from './room/bed'
import { Nightstand } from './room/nightstand'
import { WallDecorations } from './room/wall-decorations'
import { RoomProps } from './room/room-props'
import { DustParticles } from './room/dust-particles'
import { WindowLightBeam } from './room/window-light-beam'
import { CoffeeSteamShader } from './room/coffee-steam-shader'
import { useDeviceCapability } from '@/hooks/use-device-capability'

export function Scene() {
  const { quality } = useDeviceCapability()

  return (
    <Selection>
      <CameraRig />
      <Lighting />
      <RoomShell />
      <InteractiveSelect>
        <DeveloperDesk />
      </InteractiveSelect>
      <GamingChair />
      <InteractiveSelect>
        <Bookshelf />
      </InteractiveSelect>
      <InteractiveSelect>
        <Bed />
      </InteractiveSelect>
      <Nightstand />
      <WallDecorations />
      <RoomProps />
      <DustParticles />
      <WindowLightBeam />
      {/* Coffee steam above mug - only on high/medium quality */}
      {quality !== 'low' && <CoffeeSteamShader position={[0.45, 0.9, -1.25]} />}
      <PostProcessing quality={quality} />
    </Selection>
  )
}
