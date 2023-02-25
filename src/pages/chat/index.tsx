import Room from "@/components/chat/Room/Room"
import RoomsTab from "@/components/chat/RoomsTab/RoomsTab"
import { launchModal } from "@/components/modals/Modal"
import { MessageModel } from "@/models/MessageModel"
import { RoomModel } from "@/models/RoomModel"
import ProtectSSRPage from "@/utils/protectPage"
import { NextPageContext } from "next/dist/shared/lib/utils"
import { useState } from "react";
import { io, Socket } from "socket.io-client";

// Page props are calculated in the server using getServerSideProps but the server won't pre-render the page
// export default dynamic(() => Promise.resolve(ChatPage), { ssr: false })

let socket: Socket;

export default function ChatPage() {
	type RoomId = string
	const [roomsMessages, setRoomsMessages] = useState<Map<RoomId, MessageModel[]>>(new Map())

	const [selectedRoom, setSelectedRoom] = useState<RoomModel | null>(null)

	const reSubToRooms = async (rooms: RoomModel[]) => {
		// ! FULL reconnect (Optimize later)
		socket?.close()
		await fetch('/api/ws/chat')
		socket = io()

		socket.on('connect', () => {
			for (const room of rooms) {
				socket.emit('join-room', { roomId: room.id })
			}
		})

		socket.on('message', ({ message, roomId }: { message: MessageModel, roomId: string }) => {
			message.createdAt = new Date(message.createdAt)
			const messages = roomsMessages.get(roomId)
			if (messages) {
				messages.push(message)
			} else {
				roomsMessages.set(roomId, [message])
			}
			// To force re-render :(
			setRoomsMessages(new Map(roomsMessages))
		})

		socket.on('chat-error', ({ message }) => {
			launchModal({ title: "Chat Error", message, closeAutomaticAfterSeconds: 10 })
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
				onRoomSelected={setSelectedRoom}
				onRoomsChanged={(rooms) => reSubToRooms(rooms)}
			/>

			{selectedRoom &&
				<Room
					room={selectedRoom}
					messages={roomsMessages.get(selectedRoom.id) ?? null}
					onSendMessage={(message: string, roomId: string) => {
						socket.emit('client-message', { message, roomId })
					}}
				/>
			}
		</div>
	)
}

export async function getServerSideProps(ctx: NextPageContext) {
	return ProtectSSRPage(ctx)
}