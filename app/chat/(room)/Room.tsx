import { useSession } from "next-auth/react";
import Message from "./Message";
import BottomInput from "./BottomInput";
import TopRoomData from "./TopRoomData";
import { RoomModel } from "models/RoomModel";
import { MessageModel } from "models/MessageModel";

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
      id="chat-room-container"
      className="
      bg-gray-800
        flex flex-col justify-between
        p-7  m-5 rounded-lg
        h-[85vh] lg:max-h-[1000px]
        min-w-[90vw] lg:min-w-[600px] lg:w-[40vw] lg:max-w-[1000px]

        border-2 border-gray-600
        opacity-80
      "
    >
      <TopRoomData room={room} />

      <div
        id="chat-contents"
        className="
          min-w-full
          h-full
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
  )
}