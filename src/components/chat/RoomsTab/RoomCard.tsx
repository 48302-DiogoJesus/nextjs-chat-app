import { RoomModel } from "@/models/RoomModel";

type RoomCardProps = {
  room: RoomModel
  onClicked: () => void
  isSelected: boolean
}

export default function RoomCard(
  { room, onClicked, isSelected }: RoomCardProps
) {
  return (
    <span
      className={`
        ${isSelected ? "bg-gray-700" : "bg-gray-800"}
        rounded-md shadow-lg
        py-5 px-4
        flex flex-col items-start justify-start
        transition-all duration-300
        hover:cursor-pointer hover:shadow-xl hover:opacity-90 hover:-translate-y-[1px] hover:scale-95

        w-90 sm:min-w-90 sm:max-w-[400px]
      `}
      onClick={onClicked}
    >
      <span className="text-gray-300 text-xl font-bold">{room.name}</span>
      <span className="text-gray-500">({room.users.map(member => `${member.name}`).join(', ')})</span>
    </span>
  )
}