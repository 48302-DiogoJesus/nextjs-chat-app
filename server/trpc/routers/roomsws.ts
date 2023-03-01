import { TRPCError } from "@trpc/server";
import { observable, Observer } from "@trpc/server/observable";
import { UUID } from "models/commonSchemas";
import { MessageModel } from "models/MessageModel";
import { UserPublicModel } from "models/UserPublicModel";
import uuid from "react-uuid";
import { RoomsStorage } from "server/prisma/RoomStorage";
import { z } from "zod";
import { requireAuthProcedure, router } from "../trpc";

type Emission = {
  roomId: UUID;
  roomName: string;
  message: MessageModel;
};

type UserObserver = {
  id: UUID;
  observer: Observer<Emission, null /*Error type (explore later)*/>;
};

const observers = new Map<
  String, // User Email
  UserObserver[]
>();

export const wsRouter = router({
  getActiveUsers: requireAuthProcedure
    .input(
      z.object({
        roomId: UUID,
      }),
    )
    .query(
      async ({ ctx: { session }, input: { roomId } }) => {
        const room = await RoomsStorage.getRoomById(roomId);

        // Check if room exists + if user can send message to it
        if (
          !room || !room.users.find((user) => user.email === session.user.email)
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "Cannot send message. It either does not exist or you do not have access to it.",
          });
        }

        const activeUsers: UserPublicModel[] = room.users.filter((user) =>
          observers.get(user.email) !== undefined
        );

        return activeUsers;
      },
    ),
  subscribeMessages: requireAuthProcedure
    .subscription(
      async ({ ctx: { session } }) => {
        return observable<Emission, null>((clientObserver) => {
          const userObservers = observers.get(session.user.email);

          const newUserObserver = {
            id: uuid(),
            observer: clientObserver,
          };

          if (!userObservers) {
            observers.set(session.user.email, [newUserObserver]);
          } else {
            // * Later push to it to avoid creating a new array
            observers.set(session.user.email, [
              ...userObservers,
              newUserObserver,
            ]);
          }
          return () => {
            const userObservers = observers.get(session.user.email);
            if (!userObservers) {
              return;
            }

            const afterRemovingThisObserver = userObservers.filter((obs) =>
              obs.id !== newUserObserver.id
            );
            if (afterRemovingThisObserver.length === 0) {
              observers.delete(session.user.email);
            } else {
              // Remove observer from user
              observers.set(
                session.user.email,
                afterRemovingThisObserver,
              );
            }
          };
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

      const roomUsersObservers = room.users
        .map((user) => observers.get(user.email))
        .filter((it) => it !== null && it !== undefined) as UserObserver[][];

      // Send message to all observers
      for (const userObservers of roomUsersObservers) {
        userObservers.forEach((userObserver) => {
          userObserver.observer.next({
            roomId: roomId,
            roomName: room.name,
            message: formattedMessage,
          });
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
