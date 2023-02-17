import Room from "@/components/chat/Room/Room"
import RoomsTab from "@/components/chat/RoomsTab"
import { RoomModel } from "@/model/RoomModel"
import { GetServerSidePropsResult } from "next"
import { getServerSession, type Session } from "next-auth"
import { getSession } from "next-auth/react"
import { AppContext } from "next/app"
import { AppContextType, NextPageContext } from "next/dist/shared/lib/utils"
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import authOptions from "../api/auth/[...nextauth]"

type ChatPageProps = {
	session: Session
}

export default function ChatPage(
	{ session }: ChatPageProps
) {
	const [rooms, setRooms] = useState<Array<RoomModel> | null>([
		{
			id: "1",
			name: "Room 1",
			users: [
				{
					name: "John Doe",
					email: "john.doe@example.com"
				},
				{
					name: "Maria Alf",
					email: "maria.alf.203@example.com"
				},
				{
					name: "Jane Doe",
					email: "jane@example.com"
				}
			]
		},
		{
			id: "2",
			name: "Room 2",
			users: [
				{
					name: "Samantha",
					email: "samantha@example.com"
				},
				{
					name: "George",
					email: "george.alf.203@example.com"
				},
				{
					name: "Martha James",
					email: "martha-james@example.com"
				}
			]
		}
	])

	return (
		<div
			id="chat-page"
			className="
				flex flex-col lg:flex-row items-center lg:items-start justify-center
				"
		>
			<RoomsTab rooms={rooms} />
			<Room room={rooms?.[0] ?? null} />
		</div>
	)
}

export async function getServerSideProps(context: NextPageContext) {
	const session = await getSession(context)

	// Is not authenticated
	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}
	// Is authenticated
	else {
		return {
			props: {
				session
			}
		}
	}
}