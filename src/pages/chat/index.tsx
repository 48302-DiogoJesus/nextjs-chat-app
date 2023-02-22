import Room from "@/components/chat/Room/Room"
import RoomsTab from "@/components/chat/RoomsTab"
import { RoomModel } from "@/model/RoomModel"
import { trpc } from "@/utils/trpc"
import { GetServerSidePropsResult } from "next"
import { getServerSession, type Session } from "next-auth"
import { getSession } from "next-auth/react"
import { AppContext } from "next/app"
import { AppContextType, NextPageContext } from "next/dist/shared/lib/utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import authOptions from "../api/auth/[...nextauth]"

type ChatPageProps = {
	session: Session
}

// CSR only
export default dynamic(() => Promise.resolve(ChatPage), { ssr: false })

function ChatPage(
	{ session }: ChatPageProps
) {
	const [selectedRoom, setSelectedRoom] = useState<RoomModel | null>(null)

	return (
		<div
			id="chat-page"
			className="
				flex flex-col lg:flex-row items-center lg:items-start justify-center
				"
		>
			<RoomsTab onRoomSelected={setSelectedRoom} />
			{selectedRoom && <Room room={selectedRoom} />}
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