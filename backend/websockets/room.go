package mywebsockets

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"sync"
)

type Room struct {
	ID      string
	Clients map[*Client]bool
	mu      sync.Mutex
}

type RoomManager struct {
	Rooms map[string]*Room
	mu      sync.Mutex 
}

func NewRoomManager() *RoomManager {
	return &RoomManager{
		Rooms: make(map[string]*Room),
	}
}
// generates room id 
func GenerateRoomID() string {
	const regex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, 5)

	for res := range result {
		n,_ := rand.Int(rand.Reader, big.NewInt(int64(len(regex))))
		result[res] = regex[n.Int64()]
	}
	return string(result)
}
// creates a room when clicked on create room
func (rm *RoomManager) CreatesRoom(client *Client) string {
	rm.mu.Lock()
	defer rm.mu.Unlock()

	for {
		roomId := GenerateRoomID()
		if _, exists := rm.Rooms[roomId]; !exists  {
			rm.Rooms[roomId] = &Room{
				ID: roomId,
				Clients: make(map[*Client]bool),
			}
			// notify client here 
			mes  := Message{
				Type: 1,
				Body: roomId,
				Sender: "Server",
			}
			err := client.Conn.WriteJSON(mes)
			if err != nil {
				fmt.Println("Error sending room ID to client:", err)
			}
			
			fmt.Println("Room created with ID:", roomId)
			return roomId // Return the created room ID
		}
	}
}

// joins an existing room with a unique id 
func (rm *RoomManager) JoinRoom(roomId string, client *Client) error {
	rm.mu.Lock()
	room, exists := rm.Rooms[roomId]
	if !exists {
		return fmt.Errorf("room %s does not exist", roomId)
	}
	room.mu.Lock()
	room.Clients[client] = true
	room.mu.Unlock()

	return nil;
}

// LeaveRoom removes a client from a room

func (rm *RoomManager) LeaveRoom(roomId string, client *Client) error {
	rm.mu.Lock()
	room, exists := rm.Rooms[roomId]
	rm.mu.Unlock()

	if !exists {
		return fmt.Errorf("room %s does not exist", roomId)
	}
	
	room.mu.Lock()
	delete(room.Clients, client)
	room.mu.Unlock()

	return nil
}


// Broadcast function to notify everyone in the room

func (rm *RoomManager) BroadcastToAll(roomId string, message Message) error {
	rm.mu.Lock()
	room, exists := rm.Rooms[roomId]
	rm.mu.Unlock()

	if !exists {
		return fmt.Errorf("room %s does not exist", roomId)
	}

	room.mu.Lock()
	defer room.mu.Unlock()

	for client := range room.Clients {
		client.mu.Lock()
		err := client.Conn.WriteJSON(message)
		client.mu.Unlock()
		if err != nil {
			fmt.Println("Error occured broadcasting in a room", err)
		}
	}
	return nil
}