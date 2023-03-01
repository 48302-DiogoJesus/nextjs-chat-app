"use client"

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import { githubIcon } from "_resources/icons";

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
				id="left-side logo"
				className="
					opacity-60
					text-4xl text-gray-400 font-semibold
					hover:cursor-pointer hover:opacity-50
				"
				onClick={() => router.push("/")}
			>
				Chat App
			</span>

			<div
				id="left-side"
				className="flex gap-4"
			>
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

				{session.data?.user.image &&
					<Image
						src={session.data?.user.image}
						width={50}
						height={50}
						className="rounded-[50%]"

						alt="user-avatar"
					/>
				}
			</div>
		</nav>
	)
}