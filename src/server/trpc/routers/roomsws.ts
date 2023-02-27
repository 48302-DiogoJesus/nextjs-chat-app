import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();

export const wsRouter = router({
  onAdd: publicProcedure.subscription(() => {
    return observable<string>((emit) => {
      const onAdd = (message: string) => {
        emit.next(message);
      };

      ee.on("add", onAdd);

      return () => {
        ee.off("add", onAdd);
      };
    });
  }),
  add: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      ee.emit("add", input);
      return input;
    }),
});
