import { establishInitialWSConnection } from "@/components/chat/establishInitialWSConnection"
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
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

// Page props are calculated in the server using getServerSideProps but the server won't pre-render the page
// export default dynamic(() => Promise.resolve(ChatPage), { ssr: false })

/**
 * This component relies heavily on trpc query invalidations to cause data changes and re-renders
 */
export default function ChatPage() {
	const { publishNotification } = useNotifications()

	// One socket that holds the connection with the server for all notifications 
	const [socket, getHotSocket, setSocket] = useRefHotValue<Socket | null>(null)

	const [roomsMessages, setRoomsMessages] = useState<Map<UUID, MessageModel[]>>(new Map())
	const [selectedRoom, getHotSelectedRoom, setSelectedRoom]
		= useStateHotValue<RoomModel | null>(null)
	const { data } = trpc.rooms.getMyRooms.useQuery(undefined, {
		onSuccess: (rooms) => {
			if (rooms.length != 0 && !selectedRoom) {
				setSelectedRoom(rooms[0])
			}
		},
		onError: ({ message }) => launchModal({ title: "Error getting your list of rooms", content: message })
		,
		refetchInterval: 15 * 1000
	})
	const myRooms: RoomModel[] | null = data ?? null

	useEffect(() => {
		// First render
		if (!myRooms)
			return

		/** 
		 * * Already fetched rooms from query:
		 * - connect to WS server
		 * - onConnect subscribe/join all rooms fetched
		 * - setup single message handler for all messages from all rooms
		 * */
		if (!socket) {
			establishInitialWSConnection(myRooms, setRoomsMessages, getHotSelectedRoom, publishNotification, setSocket)
			return
		}

		/***
		 * * Keep room subscriptions up to date
		 *  - user might have deleted room
		 *  - rooms where user participated might have been deleted
		 *  - user might have created/joined a room  
		 * All these actions invalidate myRooms query forcing it to refetch immediately
		 */
		const prevRooms = Array.from(roomsMessages.keys())
		const allRooms = myRooms.map(r => r.id)
		const lostRoomIds: string[] = prevRooms.filter(r => !allRooms.includes(r))
		const newRoomIds: string[] = allRooms.filter(r => !prevRooms.includes(r))
		setRoomsMessages(prev => {
			// Leave lost rooms (relative to previous render)
			for (let lostRoomId of lostRoomIds) {
				socket.emit("leave-room", { roomId: lostRoomId })
				prev.delete(lostRoomId)
			}
			// Join new rooms (relative to previous render)
			for (let newRoomId of newRoomIds) {
				socket.emit('join-room', { roomId: newRoomId })
				prev.set(newRoomId, []);
			}

			return new Map(prev)
		})

		// * If the previously selected room no longer exists replace it if possible
		if (!myRooms.find(r => r.id === selectedRoom?.id)) {
			if (myRooms.length !== 0) {
				setSelectedRoom(myRooms[0])
			} else {
				setSelectedRoom(null)
			}
		}
	}, [myRooms, socket])

	const onSendMessage = (message: string, roomId: string) => {
		getHotSocket()?.emit('client-message', { message, roomId })
	}

	const variants = {
		hidden: { opacity: 0, x: 0, y: -100, scale: 0 },
		enter: { opacity: 1, x: 0, y: 0, scale: 1 },
	}

	return (
		<motion.div
			id="chat-page"
			className="
				flex flex-col lg:flex-row items-center lg:items-start justify-center
			"

			variants={variants}
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
					onSendMessage={onSendMessage}
				/>
			}
		</motion.div>
	)
}

export async function getServerSideProps(ctx: NextPageContext) {
	return ProtectSSRPage(ctx)
}