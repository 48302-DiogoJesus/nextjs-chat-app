import { RoomModel } from "@/models/RoomModel"
import Image from 'next/image'
import backgroundImage from '@/_resources/bg.png'
import { MessageModel } from "@/models/MessageModel";
import { useSession } from "next-auth/react";
import Message from "./Message";
import BottomInput from "./BottomInput";
import TopRoomData from "./TopRoomData";

type RoomProps = {
  room: RoomModel
  messages: MessageModel[] | null
  onSendMessage: (message: string, roomId: string) => void
}

export default function Room(
  { room, messages, onSendMessage: sendMessage }: RoomProps
) {
  const session = useSession();
  const me = session.data?.user ?? null

  return (
    <div
      className="
      overflow-hidden
      relative
      "
    >
      <div
        id="background-image"
        className="blur-sm opacity-70"
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
        className="absolute top-0 left-0 p-7 w-full"
      >
        <TopRoomData room={room} />

        <div
          id="chat-contents"
          className="
              m-5 max-h-[45vh] min-h-[45vh] md:max-h-[53vh] md:min-h-[53vh]
              min-w-full
              flex flex-col items-start justify-start
              overflow-auto
            "
        >
          {messages?.map(msg =>
            <Message
              key={msg.id}
              message={msg}
              isMine={msg.author.email === me?.email}
            />
          )}
        </div>

        <BottomInput
          onSendMessage={(message) => sendMessage(message, room.id)}
        />
      </div>
    </div>
  )
}

