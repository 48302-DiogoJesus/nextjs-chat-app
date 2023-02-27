import Room from "@/components/chat/Room/Room"
import RoomsTab from "@/components/chat/RoomsTab/RoomsTab";
import { launchModal } from "@/components/modals/Modal"
import { useNotifications } from "@/components/notifications/NotificationCtx";
import { useRefHotValue, useStateHotValue } from "@/hooks/useStateWithRef"
import { type UUID } from "@/models/commonSchemas"
import { MessageModel } from "@/models/MessageModel"
import { RoomModel } from "@/models/RoomModel"
import ProtectSSRPage from "@/utils/protectPage"
import { trpc } from "@/utils/trpc"
import { motion } from "framer-motion";
import { NextPageContext } from "next/dist/shared/lib/utils"
import { useState } from "react";

// Page props are calculated in the server using getServerSideProps but the server won't pre-render the page
// export default dynamic(() => Promise.resolve(ChatPage), { ssr: false })

/**
 * This component relies heavily on trpc query invalidations to cause data changes and re-renders
 */
export default function ChatPage() {
	const { publishNotification } = useNotifications()

	const [selectedRoom, setSelectedRoom] = useState<RoomModel | null>(null)

	const [roomsMessages, setRoomsMessages] = useState<Map<UUID, MessageModel[]>>(new Map())
	const { data } = trpc.rooms.getMyRooms.useQuery(undefined, {
		onSuccess: (rooms) => {
			if (rooms.length === 0) {
				setSelectedRoom(null)
			} else {
				// Previously selected room no longer exists
				if (!selectedRoom || !rooms.find(room => room.id === selectedRoom?.id)) {
					setSelectedRoom(rooms[0])
				}
			}
		},
		onError: ({ message }) => launchModal({ title: "Error getting your list of rooms", content: message }),
		refetchInterval: 15 * 1000
	})
	const myRooms: RoomModel[] | null = data ?? null

	const { mutate: sendMessage } = trpc.ws.sendMessage.useMutation()
	trpc.ws.subscribeMessages.useSubscription(undefined, {
		onData: (emission) => {
			console.log("Got message", emission)
			setRoomsMessages(prev => {
				const roomMessages = prev.get(emission.roomId)
				if (roomMessages) {
					roomMessages.push(emission.message)
				} else {
					prev.set(emission.roomId, [emission.message])
				}

				// To force re-render :(
				return new Map(prev)
			})

			if (selectedRoom && selectedRoom.id !== emission.roomId) {
				publishNotification({
					title: `${emission.roomName}`,
					content: `(${emission.message.author}): ${emission.message.content}`
				})
			}
		}
	})

	const onSendMessage = (message: string, roomId: string) => {
		console.log("Sending message", { message, roomId })
		sendMessage({ roomId, message })
	}

	return (
		<motion.div
			id="chat-page"
			className="
				flex flex-col lg:flex-row items-center lg:items-start justify-center
			"

			variants={{
				hidden: { opacity: 0, x: 0, y: -100, scale: 0 },
				enter: { opacity: 1, x: 0, y: 0, scale: 1 },
			}}
			initial="hidden"
			animate="enter"
			transition={{ type: 'linear' }}
		>
			<RoomsTab
				rooms={myRooms}
				selectedRoom={selectedRoom}

				onRoomAdded={(room) => setSelectedRoom(room)}
				onRoomSelected={(room) => setSelectedRoom(room)}
			/>

			{selectedRoom &&
				<Room
					room={selectedRoom}
					messages={roomsMessages.get(selectedRoom.id) ?? null}

					onSendMessage={(message, roomId) => onSendMessage(message, roomId)}
				/>
			}
		</motion.div>
	)
}

export async function getServerSideProps(ctx: NextPageContext) {
	return ProtectSSRPage(ctx)
}