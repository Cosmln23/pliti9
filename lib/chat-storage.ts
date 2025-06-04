// Shared in-memory storage for chat messages
// In production, this should be replaced with Redis or database

export interface ChatMessage {
  id: string
  streamId: string
  username: string
  message: string
  timestamp: string
  type: 'user' | 'system' | 'admin'
  likes?: number
}

// Global message storage
export const chatMessages: ChatMessage[] = []
export let messageIdCounter = 1

// Add some demo messages for testing
function initializeDemoMessages() {
  if (chatMessages.length === 0) {
    const demoMessages = [
      {
        streamId: 'plipli9-paranormal-live',
        username: 'Investigator1',
        message: 'Salut tuturor! 👻 Gata pentru o nouă sesiune paranormală?',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'user' as const,
        likes: 0
      },
      {
        streamId: 'plipli9-paranormal-live',
        username: 'GhostHunter',
        message: 'Am auzit că locul de azi e cu adevărat bântuit! 💀🔮',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        type: 'user' as const,
        likes: 0
      },
      {
        streamId: 'plipli9-paranormal-live',
        username: 'PLIPLI9',
        message: 'Bun venit tuturor! Să începem investigația! ⚡🕯️',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'admin' as const,
        likes: 0
      }
    ]

    demoMessages.forEach(msg => {
      chatMessages.push({
        ...msg,
        id: messageIdCounter.toString()
      })
      messageIdCounter++
    })
  }
}

// Initialize demo messages on first load
initializeDemoMessages()

export function addMessage(message: Omit<ChatMessage, 'id'>): ChatMessage {
  const newMessage: ChatMessage = {
    ...message,
    id: messageIdCounter.toString()
  }
  
  chatMessages.push(newMessage)
  messageIdCounter++
  
  // Keep only last 100 messages per stream
  const streamMessages = chatMessages.filter(m => m.streamId === message.streamId)
  if (streamMessages.length > 100) {
    const excessCount = streamMessages.length - 100
    for (let i = 0; i < excessCount; i++) {
      const index = chatMessages.findIndex(m => m.streamId === message.streamId)
      if (index !== -1) {
        chatMessages.splice(index, 1)
      }
    }
  }
  
  return newMessage
}

export function getMessages(streamId: string, limit: number = 50): ChatMessage[] {
  return chatMessages
    .filter(msg => msg.streamId === streamId)
    .slice(-limit)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
} 