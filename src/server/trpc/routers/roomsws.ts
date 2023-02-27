import { UUID } from "@/models/commonSchemas";
import { MessageModel } from "@/models/MessageModel";
import { RoomsStorage } from "@/server/prisma/RoomStorage";
import { TRPCError } from "@trpc/server";
import { observable, Observer } from "@trpc/server/observable";
import uuid from "react-uuid";
import { z } from "zod";
import { requireAuthProcedure, router } from "../trpc";

type Emission = {
  roomId: UUID;
  roomName: string;
  message: MessageModel;
};

const observers = new Map<
  String, // User Email
  Observer<
    Emission,
    null /*Error type (explore later)*/
  >
>();

export const wsRouter = router({
  subscribeMessages: requireAuthProcedure
    .subscription(
      async ({ ctx: { session } }) => {
        console.log("Sub allowed");

        return observable<Emission, null>((clientEmitter) => {
          observers.set(session.user.email, clientEmitter);
          return () => observers.delete(session.user.email);
        });
      },
    ),
  sendMessage: requireAuthProcedure
    .input(z.object({ message: z.string(), roomId: UUID }))
    .mutation(async ({ ctx: { session }, input: { message, roomId } }) => {
      const room = await RoomsStorage.getRoomById(roomId);
      const userEmail = session.user.email;

      // Check if room exists + if user can send message to it
      if (!room || !room.users.find((user) => user.email === userEmail)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "Cannot send message. It either does not exist or you do not have access to it.",
        });
      }

      const formattedMessage: MessageModel = {
        id: uuid(),
        content: message,
        author: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
        createdAt: new Date(),
      };

      const roomObservers = room.users
        .map((user) => observers.get(user.email))
        .filter((it) => it !== null && it !== undefined) as Observer<
          Emission,
          null
        >[];

      // Send message to all observers
      for (const observer of roomObservers) {
        console.log("Emitting another message", message, "| Room id", roomId);

        observer.next({
          roomId: roomId,
          roomName: room.name,
          message: formattedMessage,
        });
      }
    }),
});
/*
function emitError(clientSocket: Socket, errorMessage: string) {
  clientSocket.emit("chat-error", {
    message: errorMessage,
  });
} */
