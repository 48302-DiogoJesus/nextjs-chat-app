import { RoomModel } from "@/models/RoomModel"
import Image from "next/image"
import { CircularProgress, Input } from '@chakra-ui/react'
import { trpc } from "@/utils/trpc"
import { useRef, useState } from "react"
import RoomCard from "./RoomCard"
import isUUID from "@/utils/isUUID"
import CreateJoinRoom from "./CreateJoinRoom"

export type RoomsTabProps = {
  onRoomSelected: (room: RoomModel) => void
  onRoomsChanged: (rooms: RoomModel[]) => void
}

export default function RoomsTab(
  { onRoomSelected, onRoomsChanged }: RoomsTabProps
) {

  const [selectedRoom, selectRoom] = useState<RoomModel | null>(null)

  // * TRPC interactions 
  const trpcCtx = trpc.useContext()

  const createRoom = trpc.rooms.createRoom.useMutation({
    onSuccess: () => trpcCtx.rooms.getMyRooms.invalidate()
  })

  const joinRoom = trpc.rooms.joinRoom.useMutation({
    onSuccess: () => trpcCtx.rooms.getMyRooms.invalidate()
  })

  const { data: myRooms } = trpc.rooms.getMyRooms.useQuery(undefined, {
    onSuccess: (newRooms) => {
      onRoomsChanged(newRooms)
      if (newRooms.length > 0) {
        const firstRoom = newRooms[0]
        selectRoom(firstRoom)
        onRoomSelected(firstRoom)
      }
    }
  })

  const onCreateRoom = (roomName: string) => {
    createRoom.mutate({ roomName })
  }

  const onJoinRoom = (roomId: string) => {
    if (!isUUID(roomId)) {
      alert("You must enter a valid room ID, not a name!")
    } else {
      joinRoom.mutate({ roomId })
    }
  }

  return (
    <div
      id="rooms-tab"
      className="
        flex flex-col justify-center
        mx-7 my-8
      "
    >
      {
        !myRooms
          ? <CircularProgress isIndeterminate color='green.300' />
          :
          <>
            <CreateJoinRoom
              onJoinRoom={onJoinRoom}
              onCreateRoom={onCreateRoom}
            />

            <div className="flex justify-center items-center">
              <hr className="border-gray-700 my-4 w-[80%]" />
            </div>

            <div className="
              flex flex-row lg:flex-col gap-3 
              max-h-[60vh] overflow-x-visible overflow-y-scroll
            ">
              <>
                {myRooms.map(room =>
                  <RoomCard key={room.id}
                    room={room}
                    isSelected={room === selectedRoom}

                    onClicked={() => {
                      onRoomSelected(room)
                      selectRoom(room)
                    }}
                  />
                )}
              </>
            </div>
          </>
      }
    </div >
  )
}