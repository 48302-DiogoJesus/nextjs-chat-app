import { Room } from "@prisma/client";
import { toZod } from "tozod";
import { z } from "zod";
import { UUID } from "./commonSchemas";
import { UserPublicModel, UserPublicSchema } from "./UserPublicModel";

export type RoomModel = Pick<Room, "id" | "name" | "createdAt"> & {
  admin: UserPublicModel;
  users: UserPublicModel[];
};

export const roomNameSchema = z.string()
  .min(4, "Room name must be at least 5 characters long")
  .max(20, "Room name must be at most 20 characters long");

export const RoomSchema: toZod<RoomModel> = z.object({
  id: UUID,
  // Controlled by user
  name: roomNameSchema,
  createdAt: z.date(),
  admin: UserPublicSchema,
  users: z.array(UserPublicSchema),
});
