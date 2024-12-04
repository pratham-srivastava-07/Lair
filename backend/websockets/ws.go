package mywebsockets

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
}

func upgraderFunction(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error){
	upgrader.CheckOrigin = func(r *http.Request) bool {return true}    // for handling cors 

	connection, err := upgrader.Upgrade(w, r, nil);
	if err != nil {
		log.Println("Error occured",err)
		return nil, err
	}
	return connection, nil
}