import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Users, Zap } from 'lucide-react'
import { useEffect, useState } from "react"
import { connection, generateRoomID, sendMsg } from "@/api"
import { useNavigate } from "react-router-dom"
import { toast } from "@/hooks/use-toast"

export default function Landing() {
  const [roomId, setRoomId] = useState("")
  const [sender, setSEnder] = useState("")
  const [messages, setMessages] = useState<string[]>([]);
  const [flag, setFlag] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
      connection((msg: string) => {
        setMessages((prev: any) => [...prev, msg])
      })
  }, [])
  async function handleCreateRoom() {
    sendMsg("create_room")
    const newRoomId = generateRoomID()
    setFlag(true)
    setRoomId(newRoomId)
    
    if (sender) {
      navigate(`/chat?roomId=${newRoomId}&sender=${sender}`)
    } else {
      toast({
        title: "ERROR",
        description: "Please enter a username"
      })
    }
  }

  const copyRoomId = async () => {
    if (!roomId) {
      toast({
        title: "ERROR",
        description: "No Room ID to copy"
      });
      return;
    }
  
    try {
      await navigator.clipboard.writeText(roomId);
      toast({
        title: "Success",
        description: "Room ID copied to clipboard!"
      });
    } catch (err) {
      console.error("Failed to copy Room ID:", err);
      toast({
        title: "ERROR",
        description: "Failed to copy Room ID"
      });
    }
  };
  

  function handleJoinRoom() {
    if (!roomId || !sender) {
      toast({
        title: "ERROR",
        description: "Please enter both room ID and username"
      })
      return
    }

    sendMsg(`Room id ${roomId}, Sender: ${sender}`)
    navigate(`/chat?roomId=${roomId}&sender=${sender}`)
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <div className="container px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Room Chat
              <MessageCircle className="inline-block ml-4 size-12 md:size-16" />
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Connect instantly with friends and colleagues. Create or join rooms for seamless real-time communication.
            </p>
          </div>
          
          {/* Main Card */}
          <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-background/95">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <span className="text-sm font-medium">Status:</span>
                <span className="text-emerald-500 animate-pulse">Connected</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Enter Room ID (5 characters)" 
                className="text-center"
                maxLength={5}
                onChange={(e: any) => setRoomId(e.target.value)}
              />
              <Input 
                placeholder="Enter Username (max 10 characters)" 
                className="text-center"
                maxLength={10}
                value={sender}
                onChange={(e: any) => setSEnder(e.target.value)}
              />
              <div className="space-y-2">
                <Button className="w-full" size="lg" onClick={handleJoinRoom}>
                  Join Room
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>
                <Button onClick={handleCreateRoom} className="w-full" variant="outline" size="lg">
                  Create Room
                </Button>
              </div>
            </CardContent>
          </Card>
          <div>
          {flag && (
              <div className="flex items-center justify-center gap-4">
                <div className="text-lg font-medium">{roomId}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black text-white"
                  onClick={copyRoomId}
                >
                  Copy
                </Button>
              </div>
          )}

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="backdrop-blur-sm bg-background/95">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <MessageCircle className="size-12 text-primary" />
                <h3 className="text-xl font-semibold">Real-time Chat</h3>
                <p className="text-center text-muted-foreground">
                  Experience seamless real-time messaging with zero latency
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-background/95">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Users className="size-12 text-primary" />
                <h3 className="text-xl font-semibold">Group Rooms</h3>
                <p className="text-center text-muted-foreground">
                  Create or join group rooms for team collaboration
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-background/95">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Zap className="size-12 text-primary" />
                <h3 className="text-xl font-semibold">Instant Setup</h3>
                <p className="text-center text-muted-foreground">
                  No registration required. Start chatting in seconds
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

