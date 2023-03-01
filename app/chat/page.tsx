"use client"

import { useStateHotValue } from "@/(hooks)/useStateWithRef";
import { launchModal } from "@/(modals)/Modal";
import { useNotifications } from "@/(notifications)/NotificationCtx";
import { motion } from "framer-motion";
import { UUID } from "models/commonSchemas";
import { MessageModel } from "models/MessageModel";
import { RoomModel } from "models/RoomModel";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "utils/trpc";

import Room from "@/chat/(room)/Room";
import RoomsTab from "@/chat/(room)/(roomsTab)/RoomsTab";
import { redirect } from "next/navigation";
import Loader from "@/(global-components)/Loader";

/**
 * This component relies heavily on trpc query invalidations to cause data changes and re-renders
 */
export default function ChatPage() {
	const { status: sessionStatus, data: sessionData } = useSession()

	// ! Hooks below this are conditional (can i do that i app/ dir nextjs 13 version?)
	if (sessionStatus !== "loading" && !sessionData) {
		redirect('/')
	}

	if (sessionStatus === "loading") {
		return <Loader message={"Loading..."} />
	}

	const { publishNotification } = useNotifications()
	const [selectedRoom, getHotSelectedRoom, setSelectedRoom] = useStateHotValue<RoomModel | null>(null)

	// Store messages for all user rooms (selected + others)
	const [roomsMessages, setRoomsMessages] = useState<Map<UUID, MessageModel[]>>(new Map())
	const { data } = trpc.rooms.getMyRooms.useQuery(undefined, {
		onSuccess: (rooms) => {
			// Select a new room if needed
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

			const hotSelectedRoom = getHotSelectedRoom()
			if (hotSelectedRoom && hotSelectedRoom.id !== emission.roomId) {
				publishNotification({
					title: `${emission.roomName}`,
					content: `(${emission.message.author.name}): ${emission.message.content}`
				})
			}
		}
	})

	const onSendMessage = (message: string, roomId: string) => {
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