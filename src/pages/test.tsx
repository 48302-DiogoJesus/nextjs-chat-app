import io, { Socket } from "socket.io-client";
import { useState, useEffect } from "react";

let socket: Socket | any;

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const socketInitializer = async () => {
    await fetch(`/api/ws`)
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('message', (message: string) => {
      console.log("Got message", message)
      setMessages((prev: string[]) => [...prev, message])
    })
  }

  useEffect(() => { socketInitializer() }, [])

  return <>
    <h1>Messages</h1>
    <ul>{messages.map(msg => <li className="text-white">{JSON.stringify(msg)}</li>)}</ul>
    <hr />
    <input
      value={message}
      onChange={(e) => {
        setMessage(e.target.value)
      }}
      type="text" />
    <button
      onClick={() => {
        socket.emit("message", message);
        setMessage("");
      }}
    >SEND</button>
  </>
}