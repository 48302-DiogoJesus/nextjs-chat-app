import { initTRPC, TRPCError } from "@trpc/server";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import ws from "ws";
import * as trpcNext from "@trpc/server/adapters/next";
import trpc from "@trpc/server";
import { Session } from "next-auth";
import superjson from "superjson";

export async function createContext(
  opts:
    | trpcNext.CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>,
) {
  return {
    req: opts.req,
    res: opts.res,
  };
}

type Context = trpc.inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const requireAuthMW = t.middleware(async ({ ctx, next }) => {
  const session: Session | null = await getSession({ ctx });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You need to authenticate",
    });
  }

  return next({
    ctx: { session },
  });
});

export const requireAuthProcedure = t.procedure.use(requireAuthMW);
export const publicProcedure = t.procedure;

export const router = t.router;
