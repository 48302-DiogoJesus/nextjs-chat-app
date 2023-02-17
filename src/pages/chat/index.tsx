import { GetServerSidePropsResult } from "next"
import { getServerSession, type Session } from "next-auth"
import { getSession } from "next-auth/react"
import { AppContext } from "next/app"
import { AppContextType, NextPageContext } from "next/dist/shared/lib/utils"
import { useRouter } from "next/router"
import { useEffect } from "react";
import authOptions from "../api/auth/[...nextauth]"

type ChatPageProps = {
	session: Session
}

export default function ChatPage(
	{ session }: ChatPageProps
) {
	return (
		<div id="chat-page">
			CHAT PAGE
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