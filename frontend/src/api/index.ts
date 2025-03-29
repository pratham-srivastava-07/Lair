// Remove this import as it's for Node.js
// import WebSocket from "ws";

// Use the browser's native WebSocket
const socket = new WebSocket('https://lair-production.up.railway.app');

let connection = (cb: (m: any) => void) => {
    console.log('connecting');

    socket.onopen = () => {
        console.log("socket connected successfully");
    };

    socket.onmessage = (msg) => {
        console.log("Message from socket", msg);
        cb(msg);
    };

    socket.onclose = (event) => {
        // Add event details for better debugging
        console.log("socket disconnected", event.code, event.reason);
    };

    socket.onerror = (e) => {
        console.log("Socket error", e);
    };
};

let sendMsg = (msg: string) => {
    // Add check to ensure socket is open before sending
    if (socket.readyState === WebSocket.OPEN) {
        console.log("Message sent: ", msg);
        socket.send(msg);
    } else {
        console.error("Socket not open. Current state:", socket.readyState);
    }
};

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

export {connection, sendMsg, generateRoomID};