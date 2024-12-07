// import WebSocket from "ws";

const socket = new WebSocket('ws://localhost:9000/ws')

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

export {connection, sendMsg}