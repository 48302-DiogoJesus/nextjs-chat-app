import { trpc } from "@/utils/trpc";
import { githubIcon } from "@/_resources/icons";
import { CircularProgress } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function HomePage() {
  const session = useSession()
  const router = useRouter()

  const { data } = trpc.rooms.getRoomById.useQuery('fdee361c-78ee-4f5b-adb9-45e1c70f9b7d')

  return (
    <div
      id="home-page"
      className="
        w-full
        flex flex-col items-center justify-center gap-8
      "
    >
      <h1 className="
        mt-24
        text-5xl font-extrabold text-gray-300 w-[400px] text-center
      ">
        {
          session.status === "loading"
            ?
            <CircularProgress isIndeterminate color='green.300' />
            :
            <>
              {
                session.status === "unauthenticated"
                  ?
                  'SIGN IN TO START CHATTING!'
                  :
                  <>
                    Welcome
                    <br />
                    {session.data?.user.name}!
                  </>
              }
            </>
        }
      </h1>
      {
        session.status === "authenticated"
          ?
          <button
            className="btn"
            onClick={() => router.push("/chat")}
          >
            Join Chat
          </button>
          : <button
            className="btn"

            onClick={() => signIn('github')}
          >
            <span className="mr-2">{githubIcon}</span>
            <span>{session.status === "unauthenticated" ? 'Sign In' : 'Sign Out'}</span>
          </button>
      }
    </div>
  );
}
