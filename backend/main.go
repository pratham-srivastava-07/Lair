package main

import (
	mywebsockets "chatapp/websockets"
	"fmt"
	"log"
	"net/http"
)

func listenWs(pool *mywebsockets.Pool,w http.ResponseWriter, r *http.Request) {
	conn, err:= mywebsockets.UpgraderFunction(w, r)
	if err != nil {
		fmt.Println("Error in listening", err)
		log.Println("Error in listening", err)
	}

	username := r.URL.Query().Get("username")
	if username == "" {
		username = "Anonymous" // Default username if not provided
	}

	client :=  &mywebsockets.Client {
		Conn: conn,
		Pool: pool,
		Username: username,
	}
	pool.Register <- client
	client.Read()

}

func listenRoutes() {
	log.Println("Backend is up")
	pool := mywebsockets.NewPool()
	go pool.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		listenWs(pool, w, r);
	})
}

func main() {
	listenRoutes()
	http.ListenAndServe(":9000", nil);
}