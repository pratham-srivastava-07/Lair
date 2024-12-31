import React, { useState, useEffect, useRef } from 'react'
import { Copy, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  type: 'message' | 'join' | 'leave'
  sender: string
  content: string
}

interface ChatRoomProps {
  roomId: string
  sender: string
  messages: Message[]
  onSendMessage: (message: string) => void
}

export default function ChatRoom({ roomId, sender, messages, onSendMessage }: ChatRoomProps) {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
    } catch (err) {
      console.error('Failed to copy room ID:', err)
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
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
      <div className="flex flex-col items-center justify-center py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-normal">Room - {roomId}</h1>
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
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="text-white/70">Status : </span>
          <span className="text-emerald-500">Connected</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 mx-auto w-full max-w-3xl px-4 border">
        <div className="h-full border border-white/10 rounded-sm overflow-auto">
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "max-w-[50%] rounded p-3",
                  msg.type === 'join' || msg.type === 'leave'
                    ? "mx-auto rounded-full w-1/2 bg-gray-800 text-center" 
                    : msg.sender === sender 
                      ? "ml-auto bg-white/20" 
                      : "mr-auto bg-white/10"
                )}
              >
                {msg.type === 'join' || msg.type === 'leave' ? (
                  <div className="text-gray-400 text-sm">{msg.content}</div>
                ) : (
                  <>
                    <div className="font-medium text-sm text-white/80">
                      {msg.sender === sender ? 'You' : msg.sender}
                    </div>
                    <div className="text-white/90">{msg.content}</div>
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 mx-auto w-full max-w-3xl">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Send Message"
            className="min-h-[44px] bg-transparent border-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-11 w-11 shrink-0 bg-black hover:bg-white/10 border border-white/10"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

