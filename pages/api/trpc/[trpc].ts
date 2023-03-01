import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "server/trpc/appRouter";
import { createContext } from "server/trpc/trpc";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
