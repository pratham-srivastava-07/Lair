import { connection, sendMsg } from '@/api'
import ChatRoom from '@/components/conntent/ChatWindow'
import  { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'


export default function ChatPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([])

  const searchParams = new URLSearchParams(location.search)
  const roomId = searchParams.get('roomId')
  const sender = searchParams.get('sender')

  useEffect(() => {
    if (!roomId || !sender) {
      navigate('/')
    }
  }, [roomId, sender, navigate])

  useEffect(() => {
    const handleMessage = (msg: string) => {
      try {
        const parsedMsg = JSON.parse(msg)
        setMessages((prev) => [...prev, parsedMsg])
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    }

    if (roomId && sender) {
      connection(handleMessage)
      // Send a message to join the room
      sendMsg(JSON.stringify({ type: 'join', roomId, sender }))
    }

    return () => {
      // Clean up the connection if needed
      if (roomId && sender) {
        sendMsg(JSON.stringify({ type: 'leave', roomId, sender }))
      }
    }
  }, [roomId, sender])

  const handleSendMessage = (message: string) => {
    if (roomId && sender) {
      const messageObj = { type: 'message', roomId, sender, content: message }
      sendMsg(JSON.stringify(messageObj))
    }
  }

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

