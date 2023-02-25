import { UUID } from "@/models/commonSchemas";
import { roomNameSchema } from "@/models/RoomModel";
import { RoomsStorage } from "@/server/prisma/RoomStorage";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { requireAuthProcedure, router } from "../trpc";

/**
 * - Get user rooms
 * - Get room metadata
 * - Create a room using name
 * - Join a room by id
 */

const roomsRouter = router({
  getMyRooms: requireAuthProcedure
    .query(({ ctx: { session } }) =>
      RoomsStorage.getMyRooms(session.user.email)
    ),

  getRoom: requireAuthProcedure
    .input(
      z.object({
        roomId: UUID,
      }),
    )
    .query(async ({ ctx: { session }, input: { roomId } }) => {
      const room = await RoomsStorage.getRoomById(roomId);

      if (
        !room || !room.users.find((user) => user.email === session.user.email)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Cannot get room information. It either does not exist or you do not have access to it.",
        });
      }

      return { room };
    }),

  createRoom: requireAuthProcedure
    .input(
      z.object({
        roomName: roomNameSchema,
      }),
    )
    .mutation(({ ctx: { session }, input: { roomName } }) => {
      return RoomsStorage.createRoomAndSetAdmin(
        roomName,
        session.user.email,
      );
    }),

  joinRoom: requireAuthProcedure
    .input(
      z.object({
        roomId: UUID,
      }),
    )
    .mutation(async ({ ctx: { session }, input: { roomId } }) => {
      const room = await RoomsStorage.getRoomById(roomId);
      const userEmail = session.user.email;

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room does not exist",
        });
      }

      if (room.users.find((user) => user.email === userEmail)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already in that room!",
        });
      }

      await RoomsStorage.addUserToRoom(roomId, userEmail);
    }),
});

export default roomsRouter;
