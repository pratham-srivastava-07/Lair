package mywebsockets

import (
	"fmt"

	// "golang.org/x/text/message"
)

// import "fmt"
type Pool struct {
	Register chan *Client
	Unregister chan *Client
	Clients map[*Client]bool
	Broadcast chan Message
}

func NewPool() *Pool {
	return &Pool{
		Register: make(chan *Client),
		Unregister: make(chan *Client),
		Clients: make(map[*Client]bool),
		Broadcast: make(chan Message),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register: // to consume or take data from channels we use <-
			pool.Clients[client] = true;
			for c, _ := range pool.Clients {
				c.mu.Lock();
				err := c.Conn.WriteJSON(Message{Type: 1, Body: fmt.Sprintf("%s joined the room", client.Username)}); // captures any error while joining the user
				c.mu.Unlock();
				if err != nil {
					fmt.Printf("Error happened while connecting", err)
				}
				fmt.Printf("%s joined the room", client.Username)
			}
		case client := <- pool.Unregister:
			// pool.Clients[client] = false
			delete(pool.Clients, client);
			for c,_ := range pool.Clients {
				c.mu.Lock()
				err := c.Conn.WriteJSON(Message{Type: 1, Body: fmt.Sprintf("%s left the room", client.Username)})
				c.mu.Unlock()
				if err != nil {
					fmt.Println("Error happened while disconnecting", err)
				}
				fmt.Printf("%s left the room", client.Username)
			}
			case message := <-pool.Broadcast: // Broadcast messages to all clients
			for c := range pool.Clients {
				c.mu.Lock()
				// Include sender info in the broadcast message
				err := c.Conn.WriteJSON(Message{
					Type:   message.Type,
					Body:   message.Body,
					Sender: message.Sender, // Sender's name
				})
				c.mu.Unlock()
				if err != nil {
					fmt.Println("Error broadcasting message:", err)
				}
			}
		}
	}
} 
