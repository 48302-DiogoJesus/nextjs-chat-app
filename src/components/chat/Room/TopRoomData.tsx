import { RoomModel } from "@/models/RoomModel"
import { copyIcon } from "@/_resources/icons"
import { useState } from "react"

type TopRoomData = {
  room: RoomModel
}

export default function TopRoomData(
  { room }: TopRoomData
) {

  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false)

  return (
    <div id="top-chat-room-info" className=" text-gray-200">
      <div className="flex items-center gap-3">

        <h1 className="text-3xl font-bold" >
          {room.name}
        </h1>
        <span
          className="w-7 hover:cursor-pointer"
          title="Copy Room Id"
          onClick={async () => {
            await navigator.clipboard.writeText(room.id)
            setCopiedToClipboard(true)
            setTimeout(() => setCopiedToClipboard(false), 4 * 1000)
          }}
        >
          {copyIcon}
        </span>

        {copiedToClipboard && <span>✅ Room ID copied to clipboard</span>}
      </div>

      <p className="mt-2 text-gray-400">
        <span className="font-bold text-lg">Admin: </span>
        <span>{room.admin.name}</span>
      </p>

      <p className="text-gray-400">
        <span className="font-bold text-lg">Members: </span>
        <span>
          {room.users.map(member => `${member.name}`).join(', ')}
        </span>
      </p>
    </div>
  )
}