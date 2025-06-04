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

// Demo messages pentru testing - doar unul simplu
const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 'demo-1',
    streamId: 'plipli9-paranormal-live',
    username: 'PLIPLI9',
    message: 'Bună seara tuturor! 👻',
    timestamp: new Date().toISOString(),
    type: 'admin',
    likes: 0
  }
]

// Add some demo messages for testing
if (chatMessages.length === 0) {
  chatMessages.push(...DEMO_MESSAGES)
}

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