import { githubIcon } from "@/_resources/icons";
import { CircularProgress } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function NavBar() {
	const session = useSession()
	const router = useRouter()

	return (
		<nav
			id="navbar"
			className="
					w-screen
					flex items-center justify-between
					p-4
					bg-gray-800
					shadow-xl
			"
		>
			<span
				className="
					opacity-60
					text-4xl text-gray-400 font-extrabold
					hover:cursor-pointer hover:opacity-50
				"
				onClick={() => router.push("/")}
			>
				Chat App
			</span>

			{
				session.status === "loading"
					?
					<CircularProgress isIndeterminate color='green.300' />
					: null
			}
			{
				session.status === "authenticated"
					?
					<button
						className="btn"
						onClick={() => signOut()}
					>
						<span className="mr-2">{githubIcon}</span>
						<span>Sign Out</span>
					</button>
					: null
			}
		</nav>
	)
}