import React, { useState } from 'react'
import { Copy, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'


interface ChatRoomProps {
  roomId: string
  sender: string
  messages: { sender: string; content: string }[]
  onSendMessage: (message: string) => void
}

export default function ChatRoom({ roomId, sender, messages, onSendMessage }: ChatRoomProps) {
  const [message, setMessage] = useState('')

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
    } catch (err) {
      console.error('Failed to copy room ID:', err)
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Room - {roomId}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:text-white"
              onClick={copyRoomId}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy room ID</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Status:</span>
            <span className="text-emerald-500">Connected</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[80%] rounded-lg p-3",
              msg.sender === sender ? "ml-auto bg-blue-500" : "bg-white/10"
            )}
          >
            <div className="font-bold">{msg.sender}</div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Send Message"
            className="min-h-[44px] bg-transparent border-white/20 focus-visible:ring-white/20"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-11 w-11 shrink-0 bg-white/10 hover:bg-white/20"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

