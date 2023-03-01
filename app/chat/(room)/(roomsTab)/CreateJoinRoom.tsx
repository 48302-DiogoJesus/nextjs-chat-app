import { useRef } from "react"

export type CreateJoinRoomProps = {
  onJoinRoom: (roomId: string) => void
  onCreateRoom: (roomName: string) => void
}

export default function CreateJoinRoom(
  { onJoinRoom, onCreateRoom }: CreateJoinRoomProps
) {
  const roomNameElem = useRef<HTMLInputElement | null>(null)
  const roomIdElem = useRef<HTMLInputElement | null>(null)

  const clearRoomName = () => {
    roomNameElem.current!.value = ""
  }

  const clearRoomId = () => {
    roomIdElem.current!.value = ""
  }

  return (
    <div id="create-or-join-room-container"
      className="flex flex-col"
    >
      <div className="flex items-center gap-2">
        <input
          ref={roomIdElem}
          className="input m-1 py-3 text-center"
          placeholder="Room ID..."
          onKeyDown={e => {
            if (e.key === "Enter") {
              onJoinRoom(roomIdElem.current!.value)
              clearRoomId()
            }
          }}
        />
        <button
          className="btn bg-blue-800 hover:bg-blue-700 w-24"
          onClick={() => {
            onJoinRoom(roomIdElem.current!.value)
            clearRoomId()
          }}
        >
          Join
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={roomNameElem}
          className="input m-1 py-3 text-center"
          placeholder="Room Name..."
          onKeyDown={e => {
            if (e.key === "Enter") {
              onCreateRoom(roomNameElem.current!.value)
              clearRoomName()
            }
          }}
        />
        <button
          className="btn bg-green-900 hover:bg-green-800 w-24"
          onClick={() => {
            onCreateRoom(roomNameElem.current!.value)
            clearRoomName()
          }}
        >
          Create
        </button>
      </div>
    </div >
  )
}