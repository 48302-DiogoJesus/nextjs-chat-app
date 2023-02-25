import { appRouter } from "@/server/trpc/appRouter";
import { createContext } from "@/server/trpc/trpc";
import * as trpcNext from "@trpc/server/adapters/next";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
