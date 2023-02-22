import { TRPCContext } from "@/pages/api/trpc/[trpc]";
import { PrismaClient, Room } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { z } from "zod";
import prismaClient from "../prismaclient";
import { procedure, router } from "../trpc";

/**
 * - [x] Get user rooms
 * - [x] Get room metadata
 * - [x] Create a room using name
 * - [ ] Join a room by id
 * - [ ] Post message to room
 * - [ ] Subscribe to room messages
 */

export const appRouter = router({
  getMyRooms: procedure
    .query(async ({ ctx }) => {
      const session: Session | null = await getSession(ctx);

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
    .query(async ({ ctx, input: roomName }) => {
      const session: Session | null = await getSession(ctx);

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
    .mutation(async ({ ctx, input: { name: newRoomName } }) => {
      const session: Session | null = await getSession(ctx);

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
    .mutation(async ({ ctx, input: { name: roomName } }) => {
      const session: Session | null = await getSession(ctx);
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
});

export type AppRouter = typeof appRouter;
