import roomsRouter from "./routers/rooms";
import { router } from "./trpc";

export const appRouter = router({
  rooms: roomsRouter,
});

export type AppRouter = typeof appRouter;
