import React, { useEffect, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useLocation, useNavigate } from 'react-router-dom'
import { connection, sendMsg } from '@/api'
import ChatRoom from '@/components/conntent/ChatWindow'


interface Message {
  id: string
  type: 'message' | 'join' | 'leave'
  sender: string
  content: string
}

export default function ChatPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [roomId, setRoomId] = useState<string | null>(null)
  const [sender, setSender] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const roomIdParam = searchParams.get('roomId')
    const senderParam = searchParams.get('sender')

    if (!roomIdParam || !senderParam) {
      navigate('/')
      return
    }

    setRoomId(roomIdParam)
    setSender(senderParam)
  }, [location, navigate])

  const handleMessage = useCallback((msg: MessageEvent) => {
    try {
      const parsedData = JSON.parse(msg.data)
      const messageData = JSON.parse(parsedData.body)

      if (messageData.roomId === roomId) {
        setMessages(prev => {
          const newMessage: Message = {
            id: uuidv4(),
            type: messageData.type,
            sender: messageData.sender,
            content: messageData.type === 'join' 
              ? `${messageData.sender} joined the room`
              : messageData.type === 'leave'
              ? `${messageData.sender} left the chat`
              : messageData.content
          }
          // Check if the message is already in the state
          const messageExists = prev.some(m =>
            m.sender === newMessage.sender &&
            m.content === newMessage.content &&
            m.type === newMessage.type
          )

          if (!messageExists) {
            return [...prev, newMessage]
          }
          return prev
        })
      }
    } catch (error) {
      console.error('Failed to parse message:', error)
    }
  }, [roomId])

  useEffect(() => {
    if (roomId && sender) {
      const cleanup = connection(handleMessage)

      
      sendMsg(JSON.stringify({ type: 'join', roomId, sender }))

      return () => {
        
        sendMsg(JSON.stringify({ type: 'leave', roomId, sender }))
      }
    }
  }, [roomId, sender, handleMessage])

  const handleSendMessage = useCallback((message: string) => {
    if (roomId && sender && message.trim()) {
      const messageObj = { type: 'message', roomId, sender, content: message }
      sendMsg(JSON.stringify(messageObj))
    }
  }, [roomId, sender])

  if (!roomId || !sender) {
    return null
  }

  return (
    <ChatRoom
      roomId={roomId}
      sender={sender}
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  )
}

