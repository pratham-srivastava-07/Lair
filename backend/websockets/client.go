package mywebsockets

import (
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn *websocket.Conn
	Username string
	Pool *Pool
	mu    sync.Mutex
}


type Message struct {
	Type int `json:"type"`
	Body string `json:"body"`
	Sender string `json:"sender"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	} ()
	for {
		msgType, msg,  err := c.Conn.ReadMessage()
		if err != nil {
			fmt.Println("Error occured", err)
			return 
		}
		m := Message{Type: msgType, Body: string(msg), Sender: c.Username}
		c.Pool.Broadcast <- m
		fmt.Println("Message", m)
	}
}

