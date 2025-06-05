// Twitch Chat Integration - REAL IRC Connection
// This sends messages from our chat directly to Twitch IRC

interface TwitchMessage {
  username: string
  message: string
  channel: string
}

interface TwitchConfig {
  botUsername: string
  oauth: string
  channel: string
}

class TwitchChatBot {
  private ws: WebSocket | null = null
  private isConnected = false
  private config: TwitchConfig | null = null
  private reconnectInterval: NodeJS.Timeout | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor() {
    // Load config from environment or localStorage
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('twitch-config')
      if (savedConfig) {
        this.config = JSON.parse(savedConfig)
      }
    }
  }

  // Configure bot credentials
  configure(botUsername: string, oauth: string, channel: string) {
    this.config = { botUsername, oauth, channel }
    
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('twitch-config', JSON.stringify(this.config))
    }
    
    console.log(`🎮 Configured for Twitch channel: ${channel}`)
  }

  // Connect to Twitch IRC
  async connect(): Promise<boolean> {
    if (!this.config) {
      console.log('❌ Twitch bot not configured. Run bot.configure() first.')
      return false
    }

    if (this.isConnected) {
      console.log('✅ Already connected to Twitch IRC')
      return true
    }

    try {
      console.log('🎮 Connecting to Twitch IRC...')
      
      // Connect to Twitch IRC WebSocket
      this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443')
      
      this.ws.onopen = () => {
        console.log('🔌 WebSocket connected to Twitch IRC')
        this.authenticate()
      }

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data)
      }

      this.ws.onclose = () => {
        console.log('🔌 Disconnected from Twitch IRC')
        this.isConnected = false
        this.scheduleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('❌ Twitch IRC WebSocket error:', error)
        this.isConnected = false
      }

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
      if (line.includes('001')) {
        // Successfully connected
        this.isConnected = true
        console.log('✅ Successfully authenticated with Twitch IRC')
        console.log(`🎯 Bot active in channel: #${this.config?.channel}`)
      } else if (line.startsWith('PING')) {
        // Respond to ping
        this.ws?.send('PONG :tmi.twitch.tv')
      }
    }
  }

  // Send message to Twitch chat
  async sendMessage(username: string, message: string): Promise<boolean> {
    if (!this.isConnected || !this.ws || !this.config) {
      console.log('🔄 Twitch not connected, storing message for manual bridge')
      return false
    }

    try {
      // Format message for Twitch chat
      const twitchMessage = `[SITE] ${username}: ${message}`
      
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
    if (this.reconnectInterval) return

    console.log('🔄 Scheduling Twitch IRC reconnection in 5 seconds...')
    this.reconnectInterval = setTimeout(() => {
      this.reconnectInterval = null
      this.connect()
    }, 5000)
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      configured: !!this.config,
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
    
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval)
      this.reconnectInterval = null
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
export const twitchBot = new TwitchChatBot()

export default twitchBot 