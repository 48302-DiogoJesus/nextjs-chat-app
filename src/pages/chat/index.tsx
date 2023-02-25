import { establishInitialWSConnection } from "@/components/chat/establishInitialWSConnection"
import Room from "@/components/chat/Room/Room"
import RoomsTab from "@/components/chat/RoomsTab/RoomsTab"
import { launchModal } from "@/components/modals/Modal"
import { Notification, useNotifications } from "@/components/notifications/NotificationCtx"
import { useRefHotValue, useStateHotValue } from "@/hooks/useStateWithRef"
import { type UUID } from "@/models/commonSchemas"
import { MessageModel } from "@/models/MessageModel"
import { RoomModel } from "@/models/RoomModel"
import ProtectSSRPage from "@/utils/protectPage"
import { trpc } from "@/utils/trpc"
import { NextPageContext } from "next/dist/shared/lib/utils"
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// Page props are calculated in the server using getServerSideProps but the server won't pre-render the page
// export default dynamic(() => Promise.resolve(ChatPage), { ssr: false })

export default function ChatPage() {
	const { publishNotification } = useNotifications()

	// One socket that holds the connection with the server for all notifications 
	const [socket, getHotSocket, setSocket] = useRefHotValue<Socket | null>(null)

	const [roomsMessages, setRoomsMessages] = useState<Map<UUID, MessageModel[]>>(new Map())

	// Useful for functions where we need the CURRENT value but we also want to re-render when it changes
	const [selectedRoom, getHotSelectedRoom, setSelectedRoom]
		= useStateHotValue<RoomModel | null>(null)

	const { data } = trpc.rooms.getMyRooms.useQuery(undefined, {
		onSuccess: (rooms) => {
			if (rooms.length != 0 && !selectedRoom) {
				setSelectedRoom(rooms[0])
			}
		},
		onError: ({ message }) => {
			launchModal({ title: "Error getting your list of rooms", message })
		},
		refetchInterval: 10 * 1000
	})
	// useQuery returns undefined if there is no data
	const myRooms: RoomModel[] | null = data ?? null

	// Subscribe to messages from a room as soon as it appears in the myRooms list 
	const onRoomAddedToList = async (room: RoomModel) => {
		socket?.emit('join-room', { roomId: room.id })
	}

	// Establish web sockets connection once myRooms have been fetched 
	useEffect(() => {
		if (!myRooms)
			return

		// Selected room was deleted
		if (!myRooms.find(r => r.id === selectedRoom?.id))
			setSelectedRoom(null)

		if (socket)
			return

		establishInitialWSConnection(myRooms, setRoomsMessages, getHotSelectedRoom, publishNotification, setSocket)
	}, [myRooms])

	const onSendMessage = (message: string, roomId: string) => {
		const hotSocket = getHotSocket()
		hotSocket?.emit('client-message', { message, roomId })
	}

	return (
		<div
			id="chat-page"
			className="
			flex flex-col lg:flex-row items-center lg:items-start justify-center
		"
		>
			<RoomsTab
				rooms={myRooms}
				selectedRoom={selectedRoom}

				onRoomAdded={onRoomAddedToList}
				onRoomSelected={(room) => setSelectedRoom(room)}
			/>

			{selectedRoom &&
				<Room
					room={selectedRoom}
					messages={roomsMessages.get(selectedRoom.id) ?? null}
					onSendMessage={onSendMessage}
				/>
			}
		</div>
	)
}

export async function getServerSideProps(ctx: NextPageContext) {
	return ProtectSSRPage(ctx)
}