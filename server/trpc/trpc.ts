import { initTRPC, TRPCError } from "@trpc/server";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import ws from "ws";
import * as trpcNext from "@trpc/server/adapters/next";
import trpc from "@trpc/server";
import { Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";

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
  errorFormatter: ({ shape, error }) => {
    const isZodError = error.code === "BAD_REQUEST" &&
      error.cause instanceof ZodError;

    const firstZodErrorMessage: string | null = isZodError
      ? Object.entries(error.cause.flatten().fieldErrors)[0][1]?.[0] ?? null
      : null;

    return {
      ...shape,
      message: firstZodErrorMessage ? firstZodErrorMessage : error.message,
    };
  },
});

const requireAuthMW = t.middleware(async ({ ctx, next }) => {
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
