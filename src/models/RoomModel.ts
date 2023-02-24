import { Room } from "@prisma/client";
import { UserPublicModel } from "./UserPublicModel";

export type RoomModel = Pick<Room, "id" | "name" | "createdAt"> & {
  admin: UserPublicModel;
  users: UserPublicModel[];
};
