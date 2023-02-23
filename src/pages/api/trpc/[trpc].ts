import * as trpcNext from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import ws from "ws";
import { appRouter } from "../../../server/routers/_app";
import trpc from "@trpc/server";

export async function createContext(
  opts:
    | trpcNext.CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>,
) {
  const session = await getSession(opts);

  return {
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
