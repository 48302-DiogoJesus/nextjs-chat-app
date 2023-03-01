import { UUID } from "models/commonSchemas";
import { RoomModel } from "models/RoomModel";
import React from "react";
import { trashIcon } from "_resources/icons";

type RoomCardProps = {
  room: RoomModel
  onClicked: () => void
  isSelected: boolean

  onDeleteRoom: ((roomId: UUID) => void) | null
}

export const RoomCard: React.FC<RoomCardProps> = (
  { room, onClicked, isSelected, onDeleteRoom }
) => (
  <span
    className={`
        ${isSelected ? "bg-gray-700" : "bg-gray-800"}
        rounded-md shadow-lg
        py-5 px-4
        flex flex-col items-start justify-start
        transition-all duration-300
        hover:cursor-pointer hover:shadow-xl hover:opacity-90 hover:-translate-y-[1px] hover:scale-[.98]

        w-90 sm:min-w-90 sm:max-w-[400px]
      `}
    onClick={() => {
      onClicked()
    }}
  >
    <div className="text-gray-300 text-xl font-bold flex gap-3 justify-between items-center w-full">
      <span>{room.name}</span>
      {onDeleteRoom &&
        <span className="w-4 lg:w-5" onClick={(e) => {
          e.stopPropagation()
          onDeleteRoom(room.id)
        }}>
          {trashIcon}
        </span>
      }
    </div>
    <span className="text-gray-500">({room.users.map(member => `${member.name}`).join(', ')})</span>
  </span>
)