import Room from "@/components/chat/Room/Room"
import RoomsTab from "@/components/chat/RoomsTab/RoomsTab"
import { launchModal } from "@/components/modals/Modal"
import { useNotifications } from "@/components/notifications/NotificationCtx"
import { useStateWithRef } from "@/hooks/useStateWithRef"
import { MessageModel } from "@/models/MessageModel"
import { RoomModel } from "@/models/RoomModel"
import ProtectSSRPage from "@/utils/protectPage"
import { NextPageContext } from "next/dist/shared/lib/utils"
import { useState } from "react";
import { io, Socket } from "socket.io-client";

// Page props are calculated in the server using getServerSideProps but the server won't pre-render the page
// export default dynamic(() => Promise.resolve(ChatPage), { ssr: false })

let socket: Socket | undefined;

export default function ChatPage() {
	const { publishNotification } = useNotifications()

	type RoomId = string
	const [roomsMessages, setRoomsMessages] = useState<Map<RoomId, MessageModel[]>>(new Map())

	// Useful for functions where we need the CURRENT value but we also want to re-render when it changes
	const { get: selectedRoom, getHot: getSelectedRoom, set: setSelectedRoom } = useStateWithRef<RoomModel | null>(null)

	console.log("RENDER", selectedRoom)

	const reSubToRooms = async (rooms: RoomModel[]) => {
		// ! FULL Reconnect ! (Optimize later)
		socket?.close()
		await fetch('/api/ws/chat')
		socket = io()

		socket.on('connect', () => {
			for (const room of rooms) {
				socket?.emit('join-room', { roomId: room.id })
			}
		})

		socket.on('chat-error', ({ message }) => {
			launchModal({ title: "Chat Error", message, closeAutomaticAfterSeconds: 10 })
		})

		socket.on('message', ({ message, roomId, roomName }: { message: MessageModel, roomId: string, roomName: string }) => {
			message.createdAt = new Date(message.createdAt)

			setRoomsMessages(prev => {
				const messages = prev.get(roomId)
				if (messages) {
					messages.push(message)
				} else {
					prev.set(roomId, [message])
				}
				// To force re-render :(
				return new Map(prev)
			})

			const currentSelectedRoom = getSelectedRoom()

			if (!currentSelectedRoom || currentSelectedRoom.id !== roomId) {
				publishNotification({
					title: roomName,
					content: `(${message.author.name}): ${message.content}`,
				})
			}
		})
	}

	return (
		<div
			id="chat-page"
			className="
			flex flex-col lg:flex-row items-center lg:items-start justify-center
		"
		>
			<RoomsTab
				onRoomSelected={(room) => setSelectedRoom(room)}
				onRoomsChanged={(rooms) => reSubToRooms(rooms)}
			/>

			{selectedRoom &&
				<Room
					room={selectedRoom}
					messages={roomsMessages.get(selectedRoom.id) ?? null}
					onSendMessage={(message: string, roomId: string) => {
						socket?.emit('client-message', { message, roomId })
					}}
				/>
			}
		</div>
	)
}

export async function getServerSideProps(ctx: NextPageContext) {
	return ProtectSSRPage(ctx)
}