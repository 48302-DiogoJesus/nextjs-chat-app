"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion"
import SignInDisplay from "@/SignInDisplay";
import { useLoader } from "@/(global-components)/ShowLoader";
import Loader from "@/(global-components)/Loader";

export default function HomePage() {
    const router = useRouter()
    const { setIsLoading } = useLoader()

    const { status: sessionStatus, data: session } = useSession()

    console.log("RERENDER", sessionStatus, session)

    // ! Hooks below this are conditional (can i do that i app/ dir nextjs 13 version?)
    if (sessionStatus === "loading")
        return <Loader />


    const pageAnimationVariants = {
        hidden: { opacity: 0, x: 0, y: -100 },
        enter: { opacity: 1, x: 0, y: 0 },
    }

    return (
        <motion.div
            id="home-page"
            className="
        w-full
        flex flex-col items-center justify-center gap-8
      "
            variants={pageAnimationVariants}
            initial="hidden"
            animate="enter"
            transition={{ type: 'spring', duration: 0.5 }}
        >
            <h1
                className="
          mt-24
          text-5xl font-extrabold text-gray-300 w-[400px] text-center
          my-8
        "
            >
                {
                    !session
                        ?
                        'SIGN IN TO START CHATTING!'
                        :
                        <>
                            Welcome
                            <br />
                            {session.user.name}!
                        </>
                }
            </h1>
            {
                session
                    ?
                    <motion.button
                        className="btn text-white bg-green-600 hover:bg-green-700"
                        onClick={() => { router.push("/chat"); setIsLoading(true, "Signing you in...") }}
                    >
                        Join Chat
                    </motion.button>
                    :
                    <SignInDisplay onSignInActivated={() => setIsLoading(true, "Signing you in...")} />
            }
        </motion.div>
    );
}
