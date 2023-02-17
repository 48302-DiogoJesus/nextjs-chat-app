import { Button, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function HomePage() {
  const session = useSession()
  const router = useRouter()

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
            <CircularProgress />
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
                    {session.data?.user?.name}!
                  </>
              }
            </>
        }
      </h1>
      {
        session.status === "authenticated"
          ?
          <Button
            color="primary"
            onClick={() => router.push("/chat")}
            variant="outlined"
          >
            Join Chat
          </Button>
          : null
      }
    </div>
  );
}
