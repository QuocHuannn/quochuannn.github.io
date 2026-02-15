/**
 * Singleton audio manager using Web Audio API.
 * Generates hover tick, click pop, and whoosh sounds programmatically.
 * Respects browser autoplay policy by lazily creating AudioContext.
 */

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let muted = typeof localStorage !== 'undefined'
  ? localStorage.getItem('audio-muted') === 'true'
  : false

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = muted ? 0 : 0.3
    masterGain.connect(audioCtx.destination)
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function getGain(): GainNode {
  getContext()
  return masterGain!
}

/** Short sine tick at 3000Hz, 40ms, peak gain 0.08 */
function playHover() {
  const ctx = getContext()
  const osc = ctx.createOscillator()
  const env = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 3000
  env.gain.setValueAtTime(0, ctx.currentTime)
  env.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.005)
  env.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04)
  osc.connect(env)
  env.connect(getGain())
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.04)
}

/** Sine sweep 800Hz->200Hz over 80ms, peak gain 0.15 */
function playClick() {
  const ctx = getContext()
  const osc = ctx.createOscillator()
  const env = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.08)
  env.gain.setValueAtTime(0, ctx.currentTime)
  env.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01)
  env.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08)
  osc.connect(env)
  env.connect(getGain())
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.08)
}

/** White noise through low-pass filter (1000Hz cutoff), 200ms */
function playWhoosh() {
  const ctx = getContext()
  const bufferSize = Math.floor(ctx.sampleRate * 0.2)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1000
  const env = ctx.createGain()
  env.gain.setValueAtTime(0, ctx.currentTime)
  env.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.03)
  env.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2)
  source.connect(filter)
  filter.connect(env)
  env.connect(getGain())
  source.start(ctx.currentTime)
  source.stop(ctx.currentTime + 0.2)
}

export type SoundName = 'hover' | 'click' | 'whoosh'

export function playSound(name: SoundName) {
  if (muted) return
  switch (name) {
    case 'hover': playHover(); break
    case 'click': playClick(); break
    case 'whoosh': playWhoosh(); break
  }
}

export function toggleMute(): boolean {
  muted = !muted
  localStorage.setItem('audio-muted', String(muted))
  if (masterGain) masterGain.gain.value = muted ? 0 : 0.3
  return muted
}

export function isMuted(): boolean {
  return muted
}
