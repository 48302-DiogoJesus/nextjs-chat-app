import CreateJoinRoom from "./CreateJoinRoom"
import { useSession } from "next-auth/react"
import { RoomCard } from "./RoomCard";
import { RoomModel } from "models/RoomModel";
import { UserPublicModel } from "models/UserPublicModel";
import { trpc } from "utils/trpc";
import { launchModal } from "@/(modals)/Modal";
import { UUID } from "models/commonSchemas";
import Loader from "@/(global-components)/Loader";

export type RoomsTabProps = {
  rooms: RoomModel[] | null
  selectedRoom: RoomModel | null

  onRoomSelected: (room: RoomModel) => void
  onRoomAdded: (room: RoomModel) => void
}

export default function RoomsTab(
  { rooms, selectedRoom, onRoomSelected, onRoomAdded }: RoomsTabProps
) {
  const { data } = useSession()
  const me: UserPublicModel | null = data?.user ?? null

  // * TRPC * \\
  const trpcCtx = trpc.useContext()

  const { mutate: createRoom } = trpc.rooms.createRoom.useMutation({
    onSuccess: (room) => {
      onRoomAdded(room)
      trpcCtx.rooms.getMyRooms.invalidate()
    },
    onError: (err) => {
      launchModal({
        title: "Error creating room",
        content: err.message,
        closeAutomaticAfterSeconds: 10
      })
    }
  })

  const { mutate: joinRoom } = trpc.rooms.joinRoom.useMutation({
    onSuccess: (room) => {
      onRoomAdded(room)
      trpcCtx.rooms.getMyRooms.invalidate()
    },
    onError: ({ message }) => {
      launchModal({ title: "Error joining room", content: message, closeAutomaticAfterSeconds: 10 })
    }
  })

  const { mutate: deleteRoom } = trpc.rooms.deleteRoom.useMutation({
    onSuccess: (roomId) => {
      trpcCtx.rooms.getMyRooms.invalidate()
    },
    onError: ({ message }) => {
      launchModal({ title: "Error deleting room", content: message, closeAutomaticAfterSeconds: 10 })
    }
  })

  // * Event Handlers * \\

  const onCreateRoom = (roomName: string) => {
    createRoom({ roomName })
  }

  const onJoinRoom = (roomId: string) => {
    if (!UUID.safeParse(roomId).success) {
      launchModal({
        title: "Invalid Room Id",
        content: "Ex: 2f9d7416-d3d7-4802-be54-2aa57c9b7f58"
      })
    } else {
      joinRoom({ roomId })
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
        !rooms
          ? <Loader message="Loading Your Rooms..." />
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
              flex justify-center flex-row lg:flex-col gap-3 
              max-h-[60vh] overflow-x-visible overflow-y-scroll
            ">
              <>
                {rooms.map(room =>
                  <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={room.id === selectedRoom?.id}

                    onDeleteRoom={
                      me?.email === room.admin.email
                        ? (roomId) => deleteRoom({ roomId })
                        : null
                    }

                    onClicked={() => onRoomSelected(room)}
                  />
                )}
              </>
            </div>
          </>
      }
    </div >
  )
}