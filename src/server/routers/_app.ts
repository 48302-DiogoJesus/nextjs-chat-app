import { MessageModel } from "@/model/MessageModel";
import { UserPublicModel } from "@/model/UserPublicModel";
import { PrismaClient, Room, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { z } from "zod";
import prismaClient from "../prismaclient";
import { procedure, router } from "../trpc";

/**
 * - [x] Get user rooms
 * - [x] Get room metadata
 * - [x] Create a room using name
 * - [x] Join a room by id
 * - [x] Post message to room
 * - [x] Subscribe to room messages
 */

type RoomName = string;
const roomEmitters: Map<RoomName, EventEmitter> = new Map();

export const appRouter = router({
  getMyRooms: procedure
    .query(async ({ ctx: { session } }) => {
      if (!session || !session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const myRooms = await prismaClient.room.findMany({
        include: {
          users: {
            where: {
              email: session.user.email!,
            },
          },
        },
      });

      return myRooms;
    }),

  getRoomByName: procedure
    .input(z.string())
    .query(async ({ ctx: { session }, input: roomName }) => {
      if (!session || !session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const room: Room | null = await prismaClient.room.findUnique({
        where: {
          name: roomName,
        },
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return { room };
    }),

  createRoom: procedure
    .input(z.object({
      name: z.string(),
    }))
    .mutation(async ({ ctx: { session }, input: { name: newRoomName } }) => {
      if (!session || !session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      await prismaClient.room.create({
        data: {
          name: newRoomName,
          users: {
            connect: {
              email: session.user.email!,
            },
          },
        },
      });

      // * No return
    }),

  joinRoom: procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx: { session }, input: { name: roomName } }) => {
      if (!session || !session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const room = await prismaClient.room.findUnique({
        where: {
          name: roomName,
        },
        include: { users: true },
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room does not exist",
        });
      }

      if (room.users.find((user) => user.email === session.user!.email)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already in that room!",
        });
      }

      await prismaClient.room.update({
        where: { name: roomName },
        data: {
          users: {
            connect: { email: session.user!.email! },
          },
        },
      });
    }),

  // ! REMOVE LATER (to be replaced by Socket.io endpoint)
  sendMessage: procedure
    .input(z.object({
      roomName: z.string(),
      message: z.string(),
    }))
    .mutation(
      async (
        { ctx: { session }, input: { roomName, message: messageContent } },
      ) => {
        if (!session || !session.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
          });
        }

        const room = await prismaClient.room.findUnique({
          where: {
            name: roomName,
          },
          include: { users: true },
        });

        let dbUser: User | undefined;

        if (
          !room ||
          !(dbUser = room.users.find((user) =>
            user.email === session.user!.email
          ))
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Cannot join room. It either does not exist or you do not have access to it.",
          });
        }

        const user: UserPublicModel = {
          email: dbUser.email,
          name: dbUser.name,
          image: dbUser.image,
        };

        const message: MessageModel = {
          content: messageContent,
          author: user,
          createdAt: new Date(),
        };

        console.log("Emitting message", message);

        // * Emit to WS of that room
        const messagesEmitter = roomEmitters.get(roomName);
        if (!messagesEmitter) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "There is no one active in the room",
          });
        }

        messagesEmitter.emit("sendMessage", message);
      },
    ),
});

export type AppRouter = typeof appRouter;
