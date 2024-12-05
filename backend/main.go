package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	mywebsockets "chatapp/websockets"
)

func createRoomHandler(w http.ResponseWriter, r *http.Request) {
	// CORS and method handling
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Generate room ID using existing function from room.go
	roomID := mywebsockets.GenerateRoomID()
	
	// Respond with the new room ID
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"roomID": roomID})
}

func listenWs(pool *mywebsockets.Pool, w http.ResponseWriter, r *http.Request) {
	conn, err := mywebsockets.UpgraderFunction(w, r)
	if err != nil {
		fmt.Println("Error in listening", err)
		log.Println("Error in listening", err)
		return
	}

	username := r.URL.Query().Get("username")
	roomID := r.URL.Query().Get("roomID")

	if username == "" {
		username = "Anonymous" // Default username if not provided
	}

	client := &mywebsockets.Client{
		Conn:     conn,
		Pool:     pool,
		Username: username,
		RoomId:   roomID, // Add RoomID to client struct
	}
	
	pool.Register <- client
	client.Read()
}

func listenRoutes() {
	log.Println("Backend is up")
	pool := mywebsockets.NewPool()
	go pool.Start()

	// WebSocket connection handler
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		listenWs(pool, w, r)
	})

	// Room creation endpoint
	http.HandleFunc("/create-room", createRoomHandler)

	// CORS handling
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
	})
}

func main() {
	listenRoutes()
	http.ListenAndServe(":9000", nil)
}

