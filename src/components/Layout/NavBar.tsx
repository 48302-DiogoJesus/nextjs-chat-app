import { githubIcon } from "@/_resources/icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "../Loader";

export default function NavBar() {
	const session = useSession()
	const router = useRouter()

	return (
		<nav
			id="navbar"
			className="
					w-screen p-4
					flex items-center justify-between
					bg-gray-800
					shadow-xl
			"
		>
			<span
				className="
					opacity-60
					text-4xl text-gray-400 font-semibold
					hover:cursor-pointer hover:opacity-50
				"
				onClick={() => router.push("/")}
			>
				Chat App
			</span>

			{
				session.status === "loading"
					?
					<Loader />
					: null
			}
			{
				session.status === "authenticated"
					?
					<button
						className="btn"
						onClick={() => signOut()}
					>
						{githubIcon}
						<span>Sign Out</span>
					</button>
					: null
			}
		</nav>
	)
}