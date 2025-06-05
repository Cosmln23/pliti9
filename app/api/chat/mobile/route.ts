import { NextRequest, NextResponse } from 'next/server'
import { getMessages } from '@/lib/chat-storage'

export async function GET(request: NextRequest) {
  try {
    // Get last 5 messages for mobile display
    const messages = getMessages('plipli9-paranormal-live', 5)

    // Format simple pentru mobile
    const mobileMessages = messages.map(msg => ({
      username: msg.username,
      message: msg.message,
      time: new Date(msg.timestamp).toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isAdmin: msg.type === 'admin'
    }))

    // HTML simplu pentru display direct
    const htmlOutput = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PLIPLI9 Chat Mobile</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: transparent; 
            font-family: Arial, sans-serif;
            color: white;
            overflow: hidden;
        }
        .chat-overlay {
            position: fixed;
            bottom: 60px;
            left: 10px;
            right: 10px;
            max-height: 300px;
            overflow: hidden;
            z-index: 9999;
        }
        .message {
            background: rgba(0,0,0,0.8);
            margin-bottom: 8px;
            padding: 12px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            animation: slideUp 0.5s ease-out;
            max-width: 90%;
        }
        .username {
            font-weight: bold;
            margin-bottom: 4px;
            font-size: 14px;
        }
        .admin { color: #fbbf24; }
        .user { color: #a855f7; }
        .message-text {
            font-size: 16px;
            line-height: 1.4;
        }
        .time {
            font-size: 12px;
            color: #9ca3af;
            margin-left: 8px;
        }
        .status {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 9999;
        }
        .live-indicator {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            display: inline-block;
            margin-right: 6px;
            animation: pulse 2s infinite;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="status">
        <span class="live-indicator"></span>
        ${messages.length} mesaje LIVE
    </div>
    
    <div class="chat-overlay">
        ${mobileMessages.map(msg => `
            <div class="message">
                <div class="username ${msg.isAdmin ? 'admin' : 'user'}">
                    ${msg.username}${msg.isAdmin ? ' 👑' : ''}
                    <span class="time">${msg.time}</span>
                </div>
                <div class="message-text">${msg.message}</div>
            </div>
        `).join('')}
    </div>

    <script>
        // Auto-refresh la 3 secunde
        setInterval(() => {
            window.location.reload();
        }, 3000);
    </script>
</body>
</html>`

    return new NextResponse(htmlOutput, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Mobile API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mobile messages' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic' 