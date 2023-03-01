import roomsRouter from "./routers/rooms";
import { wsRouter } from "./routers/roomsws";
import { router } from "./trpc";

export const appRouter = router({
  rooms: roomsRouter,
  ws: wsRouter,
});

export type AppRouter = typeof appRouter;
