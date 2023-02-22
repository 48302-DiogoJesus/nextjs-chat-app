import { RoomModel } from "@/model/RoomModel"
import Image from "next/image"
import { CircularProgress, Input } from '@chakra-ui/react'
import { trpc } from "@/utils/trpc"
import { useRef } from "react"
import { Room } from "@prisma/client"

export type RoomsTabProps = {
  onRoomSelected: (room: RoomModel) => void
}

export default function RoomsTab(
  { onRoomSelected }: RoomsTabProps
) {

  const roomNameElem = useRef<HTMLInputElement | null>(null)
  const trpcCtx = trpc.useContext()

  const myRoomsQuery = trpc.getMyRooms.useQuery()

  const createRoom = trpc.createRoom.useMutation({
    onSuccess: () => trpcCtx.getMyRooms.invalidate()
  })

  const joinRoom = trpc.joinRoom.useMutation({
    onSuccess: () => trpcCtx.getMyRooms.invalidate()
  })

  const onCreateRoom = () =>
    createRoom.mutate({ name: roomNameElem.current!.value })

  const onJoinRoom = () =>
    joinRoom.mutate({ name: roomNameElem.current!.value })

  return (
    <div
      id="rooms-tab"
      className="
        flex flex-col justify-center
        mx-7 my-8
      "
    >
      {
        !myRoomsQuery.data
          ? <CircularProgress isIndeterminate color='green.300' />
          :
          <>
            <div id="create-room-container"
              className="flex items-center justify-center"
            >
              <input
                ref={roomNameElem}
                className="input m-1 py-3 text-center"
                placeholder="Room Name..." />
              <button
                className="btn m-2 bg-blue-600 hover:bg-blue-500"
                onClick={onJoinRoom}
              >
                Join
              </button>
              <button
                className="btn bg-green-700 hover:bg-green-600"
                onClick={onCreateRoom}
              >
                Create
              </button>
            </div>

            <div className="flex justify-center items-center">
              <hr className="border-gray-700 my-4 w-[80%]" />
            </div>

            <div className="
              flex flex-row lg:flex-col gap-3 
              max-h-[60vh] overflow-x-visible overflow-y-scroll
            ">
              <>
                {myRoomsQuery.data.map(room =>
                  <RoomCard key={room.name}
                    room={room as unknown as RoomModel}
                    onClicked={() => onRoomSelected(room as unknown as RoomModel)}
                  />
                )}
              </>
            </div>
          </>
      }
    </div >
  )
}

function RoomCard(
  { room, onClicked }: { room: RoomModel, onClicked: () => void }
) {
  return (
    <span
      className="
        bg-gray-800
        rounded-md shadow-lg
        py-5 px-4
        flex flex-col items-start justify-start
        transition-all duration-300
        hover:cursor-pointer hover:shadow-xl hover:opacity-90 hover:-translate-y-[1px] hover:scale-95

        w-90 sm:min-w-90 sm:max-w-[400px]
      "
      onClick={onClicked}
    >
      <span className="text-gray-300 text-xl font-bold">{room.name}</span>
      <span className="text-gray-500">({room.users.map(member => `${member.name}`).join(', ')})</span>
    </span>
  )
}