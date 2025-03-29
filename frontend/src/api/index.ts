// import WebSocket from "ws";

const socket = new WebSocket('wss://lair-production.up.railway.app')

let connection = (cb: (m: any) => void) => {
    console.log('connecting')

    socket.onopen = () => {
        console.log("socket connected successfully")
    }

    socket.onmessage = (msg) => {
        console.log("Message from socket", msg)
        cb(msg)
    }

    socket.onclose = () => {
        console.log("socket disconnected")
    }

    socket.onerror = (e) => {
        console.log("Socket error", e)
    }
};

let sendMsg = (msg: string) => {
    console.log("Message sent: ", msg)
    socket.send(msg)
}

function generateRoomID() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 5;
    let result = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
  
    return result;
  }

export {connection, sendMsg, generateRoomID}