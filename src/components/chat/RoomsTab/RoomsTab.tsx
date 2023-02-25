import { RoomModel } from "@/models/RoomModel"
import { CircularProgress } from '@chakra-ui/react';
import { trpc } from "@/utils/trpc"
import { useState } from "react";
import RoomCard from "./RoomCard"
import isUUID from "@/utils/isUUID"
import CreateJoinRoom from "./CreateJoinRoom"
import { launchModal } from "@/components/modals/Modal"
import { unwrapErrorMessage } from "@/utils/mySafeParse";
import unwrapTrpcError from "@/utils/trpcErrorHelpers";

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
    onSuccess: () => trpcCtx.rooms.getMyRooms.invalidate(),
    onError: (err) => {
      launchModal({
        title: "Error creating room",
        message: err.message,
        closeAutomaticAfterSeconds: 10
      })
    }
  })

  const joinRoom = trpc.rooms.joinRoom.useMutation({
    onSuccess: () => trpcCtx.rooms.getMyRooms.invalidate(),
    onError: ({ message }) => {
      launchModal({ title: "Error joining room", message, closeAutomaticAfterSeconds: 10 })
    }
  })

  const { data: myRooms } = trpc.rooms.getMyRooms.useQuery(undefined, {
    onSuccess: (newRooms) => {
      onRoomsChanged(newRooms)
      if (newRooms.length > 0) {
        const firstRoom = newRooms[0]
        selectRoom(firstRoom)
        onRoomSelected(firstRoom)
      }
    },
    onError: ({ message }) => {
      launchModal({ title: "Error getting your list of rooms", message })
    }
  })

  const onCreateRoom = (roomName: string) => {
    createRoom.mutate({ roomName })
  }

  const onJoinRoom = (roomId: string) => {
    if (!isUUID(roomId)) {
      launchModal({
        title: "Error joining room",
        message: "Invalid room id.\n Valid room id example: 2f9d7416-d3d7-4802-be54-2aa57c9b7f58"
      })
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