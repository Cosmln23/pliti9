// Server-side Twitch IRC Bot pentru Next.js API
import WebSocket from 'ws'

interface TwitchConfig {
  botUsername: string
  oauth: string
  channel: string
}

class ServerTwitchBot {
  private ws: WebSocket | null = null
  private isConnected = false
  private config: TwitchConfig | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null

  // Configure bot from environment or parameters
  configure(botUsername?: string, oauth?: string, channel?: string) {
    this.config = {
      botUsername: botUsername || process.env.TWITCH_BOT_USERNAME || 'plipli9_bot',
      oauth: oauth || process.env.TWITCH_OAUTH_TOKEN || '',
      channel: channel || process.env.TWITCH_CHANNEL || 'plipli9'
    }
    
    console.log(`🎮 Server bot configured for: #${this.config.channel}`)
    return !!this.config.oauth
  }

  // Auto-configure with hardcoded credentials for production
  autoConfigureForProduction() {
    if (this.config?.oauth) {
      console.log('🎮 Bot already configured')
      return true
    }

    // Use the credentials from setup
    this.config = {
      botUsername: 'plipli9_bot',
      oauth: 'oauth:ofmzemzx56e09fxzxanwaarmlpchj3',
      channel: 'plipli9'
    }
    
    console.log(`🎮 AUTO-CONFIGURED for production: #${this.config.channel}`)
    return true
  }

  // Connect to Twitch IRC
  async connect(): Promise<boolean> {
    // Auto-configure if not configured
    if (!this.config?.oauth) {
      this.autoConfigureForProduction()
    }

    if (!this.config?.oauth) {
      console.log('❌ Twitch bot not configured or missing OAuth token')
      return false
    }

    if (this.isConnected) {
      console.log('✅ Already connected to Twitch IRC')
      return true
    }

    try {
      console.log('🎮 Connecting to Twitch IRC from server...')
      
      // Connect to Twitch IRC WebSocket
      this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443')
      
      this.ws.on('open', () => {
        console.log('🔌 Server WebSocket connected to Twitch IRC')
        this.authenticate()
      })

      this.ws.on('message', (data) => {
        this.handleMessage(data.toString())
      })

      this.ws.on('close', () => {
        console.log('🔌 Disconnected from Twitch IRC')
        this.isConnected = false
        this.scheduleReconnect()
      })

      this.ws.on('error', (error) => {
        console.error('❌ Twitch IRC WebSocket error:', error)
        this.isConnected = false
      })

      return true
    } catch (error) {
      console.error('❌ Failed to connect to Twitch IRC:', error)
      return false
    }
  }

  // Authenticate with Twitch IRC
  private authenticate() {
    if (!this.ws || !this.config) return

    // Send authentication
    this.ws.send(`PASS ${this.config.oauth}`)
    this.ws.send(`NICK ${this.config.botUsername}`)
    this.ws.send(`JOIN #${this.config.channel}`)
    
    // Start heartbeat
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('PING :tmi.twitch.tv')
      }
    }, 30000)
  }

  // Handle incoming messages from Twitch
  private handleMessage(data: string) {
    const lines = data.trim().split('\n')
    
    for (const line of lines) {
      console.log('📥 Twitch IRC:', line) // Debug log
      
      if (line.includes('001')) {
        // Successfully connected
        this.isConnected = true
        console.log('✅ Successfully authenticated with Twitch IRC')
        console.log(`🎯 Server bot active in channel: #${this.config?.channel}`)
      } else if (line.startsWith('PING')) {
        // Respond to ping
        this.ws?.send('PONG :tmi.twitch.tv')
      } else if (line.includes('NOTICE') && line.includes('Login authentication failed')) {
        console.error('❌ Twitch authentication failed - check OAuth token')
      }
    }
  }

  // Send message to Twitch chat
  async sendMessage(username: string, message: string): Promise<boolean> {
    if (!this.isConnected || !this.ws || !this.config) {
      console.log('🔄 Twitch not connected, message dropped:', `${username}: ${message}`)
      return false
    }

    try {
      // Format message for Twitch chat (clean format without [SITE])
      const twitchMessage = `${username}: ${message}`
      
      // Send to Twitch IRC
      this.ws.send(`PRIVMSG #${this.config.channel} :${twitchMessage}`)
      
      console.log(`🎮 ✅ Sent to Twitch #${this.config.channel}: ${twitchMessage}`)
      return true
      
    } catch (error) {
      console.error('❌ Failed to send to Twitch:', error)
      return false
    }
  }

  // Schedule reconnection
  private scheduleReconnect() {
    if (this.reconnectTimeout) return

    console.log('🔄 Scheduling Twitch IRC reconnection in 5 seconds...')
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null
      this.connect()
    }, 5000)
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      configured: !!this.config?.oauth,
      channel: this.config?.channel || null,
      botUsername: this.config?.botUsername || null
    }
  }

  // Disconnect from Twitch
  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    
    this.isConnected = false
    console.log('🔌 Disconnected from Twitch IRC')
  }
}

// Export singleton instance
export const serverTwitchBot = new ServerTwitchBot()

// Auto-configure and connect on server startup
setTimeout(() => {
  console.log('🚀 Starting auto-connect to Twitch IRC...')
  serverTwitchBot.autoConfigureForProduction()
  serverTwitchBot.connect()
}, 2000) // Give server 2 seconds to start properly

export default serverTwitchBot 