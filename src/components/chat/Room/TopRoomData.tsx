import { launchModal } from "@/components/modals/Modal"
import { RoomModel } from "@/models/RoomModel"
import { copyIcon } from "@/_resources/icons"

type TopRoomData = {
  room: RoomModel
}

export default function TopRoomData(
  { room }: TopRoomData
) {
  return (
    <div id="top-chat-room-info" className=" text-gray-200">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">
          {room.name}
        </h1>
        <span
          className="
            hover:cursor-pointer hover:scale-105 w-6
          "
          onClick={() => {
            navigator.clipboard.writeText(room.id)
            launchModal({
              title: "Copied to clipboard",
              showButtons: false,
              closeAutomaticAfterSeconds: 3
            })
          }}
        >{copyIcon}</span>
        <span className="text-sm">Click to copy room id and invite others</span>
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