import { AppRouter } from "@/server/trpc/appRouter";
import { createWSClient, httpBatchLink, wsLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type NextPageContext } from "next";
import superjson from "superjson";

function getEndingLink(ctx: NextPageContext | undefined) {
  if (typeof window === "undefined") {
    // Runs on the server
    return httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    });
  } else {
    // Runs on the browser
    return wsLink<AppRouter>({
      client: createWSClient({
        url: getWSBaseLink(),
      }),
    });
  }
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [getEndingLink(ctx)],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
});

// Runs on server
function getBaseUrl() {
  const SERVER_PORT = process.env.PORT!;

  if (process.env.VERCEL_URL) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${SERVER_PORT}`;
}

function getWSBaseLink() {
  const WS_PORT = parseInt(process.env.NEXT_PUBLIC_WS_PORT!);

  if (process.env.VERCEL_URL) {
    // reference for vercel.com
    return `ws://${process.env.VERCEL_URL}:${WS_PORT}`;
  }

  // assume localhost
  return `ws://localhost:${WS_PORT}`;
}
