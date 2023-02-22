import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "../../../lib/routers/_app";

export type TRPCContext = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export function createContext(
  { req, res }: { req: NextApiRequest; res: NextApiResponse },
): TRPCContext {
  return {
    req,
    res,
  };
}

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
