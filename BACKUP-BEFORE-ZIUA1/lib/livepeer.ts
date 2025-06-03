// Livepeer Service pentru LIVE Streaming Real
import { Livepeer } from 'livepeer'

// Configurare client Livepeer
const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY || 'demo-key'
})

// Tipuri pentru stream management
export interface StreamData {
  id: string
  name: string
  streamKey: string
  rtmpIngestUrl: string
  playbackId: string
  playbackUrl: string
  status: 'idle' | 'active' | 'offline'
  isActive: boolean
  createdAt: string
}

export interface StreamProfiles {
  name: string
  bitrate: number
  fps: number
  width: number
  height: number
}

// Profiluri de calitate pentru streaming
const STREAM_PROFILES: StreamProfiles[] = [
  { name: "1080p", bitrate: 6000000, fps: 30, width: 1920, height: 1080 },
  { name: "720p", bitrate: 3000000, fps: 30, width: 1280, height: 720 },
  { name: "480p", bitrate: 1500000, fps: 30, width: 854, height: 480 },
  { name: "360p", bitrate: 800000, fps: 30, width: 640, height: 360 }
]

/**
 * Creează un nou stream pentru LIVE
 */
export async function createLiveStream(name: string = 'Plipli9 Paranormal Live'): Promise<StreamData> {
  try {
    // În DEMO mode, returnează date simulate
    if (process.env.DEMO_MODE === 'true') {
      const mockStreamId = `stream_${Date.now()}`
      const mockPlaybackId = `playback_${Date.now()}`
      
      return {
        id: mockStreamId,
        name: name,
        streamKey: `demo-key-${Date.now()}`,
        rtmpIngestUrl: `rtmp://ingest.livepeer.studio/live/demo-key-${Date.now()}`,
        playbackId: mockPlaybackId,
        playbackUrl: `https://lvpr.tv?v=${mockPlaybackId}`,
        status: 'idle',
        isActive: false,
        createdAt: new Date().toISOString()
      }
    }

    // Creare stream real via Livepeer API
    const streamRequest = await livepeer.stream.create({
      name: name,
      profiles: STREAM_PROFILES.map(profile => ({
        name: profile.name,
        bitrate: profile.bitrate,
        fps: profile.fps,
        width: profile.width,
        height: profile.height,
        gop: "2.0"
      })),
      record: true, // Înregistrează automat pentru replay
      multistream: {
        targets: [] // Opțional: streaming simultan pe alte platforme
      }
    })

    if (!streamRequest.stream) {
      throw new Error('Failed to create stream')
    }

    const stream = streamRequest.stream

    return {
      id: stream.id || `stream_${Date.now()}`,
      name: stream.name || name,
      streamKey: stream.streamKey || `key_${Date.now()}`,
      rtmpIngestUrl: `rtmp://rtmp.livepeer.com/live/${stream.streamKey || 'default'}`,
      playbackId: stream.playbackId || `playback_${Date.now()}`,
      playbackUrl: `https://lvpr.tv?v=${stream.playbackId || 'default'}`,
      status: 'idle',
      isActive: false,
      createdAt: stream.createdAt ? new Date(stream.createdAt).toISOString() : new Date().toISOString()
    }

  } catch (error) {
    console.error('Error creating live stream:', error)
    throw new Error('Failed to create live stream')
  }
}

/**
 * Verifică statusul unui stream
 */
export async function getStreamStatus(streamId: string): Promise<StreamData | null> {
  try {
    // În DEMO mode, returnează status simulat
    if (process.env.DEMO_MODE === 'true') {
      // Simulează că stream-ul este activ în 50% din timp
      const isActive = Math.random() > 0.5
      
      return {
        id: streamId,
        name: 'Plipli9 Paranormal Live',
        streamKey: `demo-key-${streamId}`,
        rtmpIngestUrl: `rtmp://ingest.livepeer.studio/live/demo-key-${streamId}`,
        playbackId: `playback_${streamId}`,
        playbackUrl: `https://lvpr.tv?v=playback_${streamId}`,
        status: isActive ? 'active' : 'idle',
        isActive: isActive,
        createdAt: new Date().toISOString()
      }
    }

    // Verificare status real via Livepeer API
    const streamResponse = await livepeer.stream.get(streamId)
    
    if (!streamResponse.stream) {
      return null
    }

    const stream = streamResponse.stream

    return {
      id: stream.id || streamId,
      name: stream.name || 'Plipli9 Paranormal Live',
      streamKey: stream.streamKey || `key_${streamId}`,
      rtmpIngestUrl: `rtmp://rtmp.livepeer.com/live/${stream.streamKey || 'default'}`,
      playbackId: stream.playbackId || `playback_${streamId}`,
      playbackUrl: `https://lvpr.tv?v=${stream.playbackId || 'default'}`,
      status: stream.isActive ? 'active' : 'idle',
      isActive: stream.isActive || false,
      createdAt: stream.createdAt ? new Date(stream.createdAt).toISOString() : new Date().toISOString()
    }

  } catch (error) {
    console.error('Error getting stream status:', error)
    return null
  }
}

/**
 * Oprește un stream
 */
export async function terminateStream(streamId: string): Promise<boolean> {
  try {
    // În DEMO mode, returnează success
    if (process.env.DEMO_MODE === 'true') {
      console.log(`[DEMO] Terminated stream: ${streamId}`)
      return true
    }

    // Terminare stream real
    await livepeer.stream.terminate(streamId)
    return true

  } catch (error) {
    console.error('Error terminating stream:', error)
    return false
  }
}

/**
 * Listează toate stream-urile active
 */
export async function getActiveStreams(): Promise<StreamData[]> {
  try {
    // În DEMO mode, returnează liste simulate
    if (process.env.DEMO_MODE === 'true') {
      return [
        {
          id: 'demo_stream_1',
          name: 'Plipli9 Paranormal Live',
          streamKey: 'demo-key-123',
          rtmpIngestUrl: 'rtmp://ingest.livepeer.studio/live/demo-key-123',
          playbackId: 'demo-playback-123',
          playbackUrl: 'https://lvpr.tv?v=demo-playback-123',
          status: 'active',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
    }

    // Listare stream-uri reale
    const streamsResponse = await livepeer.stream.getAll()
    
    if (!streamsResponse.data) {
      return []
    }

    return streamsResponse.data
      .filter(stream => stream.isActive && stream.id && stream.streamKey && stream.playbackId)
      .map(stream => ({
        id: stream.id!,
        name: stream.name || 'Plipli9 Paranormal Live',
        streamKey: stream.streamKey!,
        rtmpIngestUrl: `rtmp://rtmp.livepeer.com/live/${stream.streamKey}`,
        playbackId: stream.playbackId!,
        playbackUrl: `https://lvpr.tv?v=${stream.playbackId}`,
        status: 'active' as const,
        isActive: true,
        createdAt: stream.createdAt ? new Date(stream.createdAt).toISOString() : new Date().toISOString()
      }))

  } catch (error) {
    console.error('Error getting active streams:', error)
    return []
  }
}

/**
 * Webhook handler pentru status changes de la Livepeer
 */
export function handleLivepeerWebhook(webhookData: any) {
  const { type, streamId, isActive } = webhookData

  console.log(`[Livepeer Webhook] ${type} for stream ${streamId}, active: ${isActive}`)

  // Aici poți adăuga logica pentru notificări automate via Make.com
  switch (type) {
    case 'stream.started':
      console.log(`🔴 Stream started: ${streamId}`)
      // Trigger Make.com webhook pentru "live started"
      break
    
    case 'stream.ended':
      console.log(`⏹️ Stream ended: ${streamId}`)
      // Trigger Make.com webhook pentru "live ended"
      break
      
    default:
      console.log(`Unknown webhook type: ${type}`)
  }

  return { received: true, type, streamId }
} 