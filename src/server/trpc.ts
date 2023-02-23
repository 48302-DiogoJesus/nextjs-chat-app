import { createContext } from "@/pages/api/trpc/[trpc]";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const procedure = t.procedure;
