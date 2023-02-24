import { type NextPageContext } from "next";
import { getSession } from "next-auth/react";

export default async function ProtectSSRPage(context: NextPageContext) {
  const session = await getSession(context);

  // Is not authenticated
  if (!session) {
    const { req } = context;
    if (!req) {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination:
          `/api/auth/signin?callbackUrl=${process.env.NEXT_PUBLIC_APP_URL}${req.url}`,
        permanent: false,
      },
    };
  }

  // Is authenticated
  return {
    props: {
      // Later the page might need it
      session,
    },
  };
}
