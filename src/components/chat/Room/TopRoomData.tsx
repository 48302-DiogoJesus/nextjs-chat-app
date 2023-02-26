import { launchModal } from "@/components/modals/Modal"
import { RoomModel } from "@/models/RoomModel"
import { copyIcon, crownIcon } from "@/_resources/icons"
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

      <span
        className="btn text-sm h-10 min-h-0 my-2 bg-gray-800 hover:bg-gray-700"
        onClick={() => {
          launchModal({
            title: `Members of: "${room.name}"`,
            content: room.users.map(user =>
              <div className="
                w-full flex flex-col items-center justify-start overflow-auto max-h-[50vh]
              ">
                <div className="
                  py-2 my-1 rounded-md h-12 flex items-center justify-center
                  text-xl font-medium text-center 
                  bg-gray-700 w-[90%] 
                  transition-all
                ">
                  {user.name}
                  {user.email === room.admin.email &&
                    <span className="mx-1 text-gray-500 flex gap-2">
                      <span> (Admin)</span>
                      <span className="fill-yellow-400">{crownIcon}</span>
                    </span>
                  }
                </div>
              </div>
            )
          })
        }}
      >Show members</span>
    </div>
  )
}