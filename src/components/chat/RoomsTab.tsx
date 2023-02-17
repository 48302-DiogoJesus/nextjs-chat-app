import { RoomModel } from "@/model/RoomModel"
import plusIcon from '@/resources/rounded-plus.svg'
import Image from "next/image"
import { CircularProgress, Input } from '@chakra-ui/react'

type RoomsTabProps = {
  rooms: Array<RoomModel> | null
}

export default function RoomsTab(
  { rooms }: RoomsTabProps
) {
  return (
    <div
      id="rooms-tab"
      className="
        flex flex-col justify-center
        overflow-auto
        mx-7 my-8
      "
    >
      <div id="create-room-container"
        className="flex items-center justify-center"
      >
        <input
          className="input m-1 py-3"
          placeholder="Create a group..." />
        <Image
          className="
            h-10 text-slate-200 opacity-60
            hover:cursor-pointer hover:opacity-75 hover:scale-105
          "
          src={plusIcon} alt="" />
      </div>

      <div className="flex justify-center items-center">
        <hr className="border-gray-700 my-4 w-[80%]" />
      </div>

      <div className="flex flex-row lg:flex-col gap-3">
        {
          !rooms
            ?
            <CircularProgress isIndeterminate color='green.300' />
            :
            <>{rooms.map(room => <RoomCard key={room.id} room={room} />)}</>
        }
      </div>
    </div>
  )
}

function RoomCard({ room }: { room: RoomModel }) {
  return (
    <span
      className="
        bg-gray-800
        rounded-md shadow-lg
        py-5 px-4
        flex flex-col items-start justify-start
        transition-all duration-300
        hover:cursor-pointer hover:shadow-xl hover:opacity-90 hover:-translate-x-1

        w-90 sm:min-w-90 sm:max-w-[400px]
      "
    >
      <span className="text-gray-300 text-xl font-bold">{room.name}</span>
      <span className="text-gray-500">({room.users.map(member => `${member.name}`).join(', ')})</span>
    </span>
  )
}