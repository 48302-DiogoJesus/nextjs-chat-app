import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion"
import { GetServerSideProps } from 'next'
import { Session } from "next-auth";
import SignInDisplay from "@/components/SignInDisplay";
import { useLoader } from "@/components/ShowLoader";

type HomePageProps = {
  session: Session | null
}

// SSR
export default function HomePage({ session }: HomePageProps) {
  const router = useRouter()

  const { setIsLoading } = useLoader()

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  return {
    props: {
      session
    }
  }
}
