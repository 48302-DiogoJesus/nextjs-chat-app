import { RoomModel } from "@/model/RoomModel"
import Image from 'next/image'
import backgroundImage from '@/resources/bg.png'
import Input from '@mui/joy/Input';
import { useEffect, useRef, useState } from "react";
import { MessageModel } from "@/model/MessageModel";
import { useSession } from "next-auth/react";
import { Button } from "@chakra-ui/react";
import copyIcon from '@/resources/copy-icon.svg';
import { IconButton, Tooltip } from "@mui/joy";
import { trpc } from "@/utils/trpc";
import { io, Socket } from "socket.io-client";

type RoomProps = {
  room: RoomModel
}

let socket: Socket;

export default function Room(
  { room }: RoomProps
) {
  const session = useSession();
  const me = session.data?.user ?? null
  const sendMessageInputRef = useRef<HTMLInputElement | null>(null)
  const [messages, setMessages] = useState<MessageModel[] | null>(null)

  useEffect(() => {
    console.log("Connecting to new room =>", room.name);
    setMessages([]);

    (async () => {
      await fetch('/api/ws')
      socket = io()

      socket.on('connect', () => {
        socket.emit('join-room', { roomName: room.name })
      })

      socket.on('server-message', (message: MessageModel) => {
        // ! TEMP fix. createdAt comes as string
        message.createdAt = new Date(message.createdAt)
        setMessages(prev => [...(prev ?? []), message])
      })
    })()

    return () => {
      socket.emit("leave-room", { roomName: room.name })
    }
  }, [room])

  const onSendMessage = async () => {
    const message = sendMessageInputRef.current!.value
    socket.emit("client-message", { roomName: room.name, message: message })
  }

  return (
    <div
      className="
      overflow-hidden
      "
    >
      <div
        className="relative"
      >
        <div
          id="bg-image-container"
          className="
            blur-sm opacity-70 
          "
        >
          <Image
            src={backgroundImage}
            alt='Mountains Background'
            style={{ width: "100vh" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-transparent"></div>
        </div>

        <div
          id="chat-container"
          className="absolute top-0 left-0 p-7"
        >
          <div id="top-chat-room-info" className=" text-gray-200">
            <h1 className="my-2 text-3xl font-bold flex gap-3">
              {room?.name}
              <Image src={copyIcon} alt={"Copy Room Name"} className="hover:cursor-pointer hover:scale-105" />
            </h1>
            <p className="text-lg text-gray-500">
              ({room?.users.map(member => `${member.name}`).join(', ')})
            </p>
          </div>

          <div
            id="chat-contents"
            className="
              m-5 max-h-[45vh] min-h-[45vh] md:max-h-[53vh] md:min-h-[53vh]
              min-w-full
              flex flex-col items-start justify-start
              overflow-auto
            "
          >
            {messages?.map(msg => <Message key={msg.createdAt.toString()} message={msg} isMine={msg.author.email === me?.email} />)}
          </div>

          <div id="chat-bottom"
            className="flex items-center justify-end"
          >
            <input
              ref={sendMessageInputRef}
              placeholder="Type a message ..."
              className="input w-full"
            />
            <button
              onClick={onSendMessage}

              className="
                btn  
                mx-4
                bg-red  
                hover:scale-105 hover:bg-red hover:opacity-90
              "
            >
              Send
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

function Message(
  { message, isMine }: { message: MessageModel, isMine: boolean }
) {
  return (
    <div
      className={`
        px-6 py-3 m-1
        max-w-[48%]
        rounded-md
        bg-gray-900 text-gray-300
        opacity-90
        shadow-md

        ${isMine ? "self-end" : "self-start"}
      `}
    >
      <div className="flex flex-col items-start">
        <p className="text-2xl font-bold">
          {message.author.name}
        </p>
        <p className="opacity-60 text-sm">
          {message.createdAt.toTimeString().slice(0, 5)}
        </p>
        <p className="text-lg text-light-blue">
          {message.content}
        </p>
      </div>
    </div>
  )
}