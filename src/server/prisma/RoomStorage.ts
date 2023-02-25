import { RoomModel, roomNameSchema, RoomSchema } from "@/models/RoomModel";
import { myParse } from "@/utils/mySafeParse";
import prismaClient from "./prismaclient";
import { userPublicModelSelection } from "./selections/UserPublicModelSelection";

/**
 * !! IMPORTANT !!
 * On queries, for security and optimization reasons we should
 *  explicitly specify return type (Ex: Promise<RoomModel[]>)
 *  this still does not prevent db from giving more fields than RoomModel has.
 *  That is solved using ZOD schemas to parse the objects
 *  ZOD only grabs the properties specified in the schema but it also performs more
 *  detailed field validation (not very important for Output Models, but for InputModels).
 */

export const RoomsStorage = {
  getMyRooms: (email: string): Promise<RoomModel[]> =>
    prismaClient.room.findMany({
      where: {
        users: {
          some: {
            email: email,
          },
        },
      },
      include: {
        admin: userPublicModelSelection,
        users: userPublicModelSelection,
      },
    }).then((rooms) => rooms.map((room) => myParse(RoomSchema, room))),

  getRoomById: (roomId: string): Promise<RoomModel | null> =>
    prismaClient.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        users: userPublicModelSelection,
        admin: userPublicModelSelection,
      },
    }).then((room) => myParse(RoomSchema, room)),

  createRoomAndSetAdmin: (
    roomName: string,
    adminEmail: string,
  ): Promise<RoomModel> =>
    prismaClient.room.create({
      data: {
        name: roomName,
        admin: {
          connect: {
            email: adminEmail,
          },
        },
        users: {
          connect: {
            email: adminEmail,
          },
        },
      },
      include: {
        admin: userPublicModelSelection,
        users: userPublicModelSelection,
      },
    }).then((room) => myParse(RoomSchema, room)),

  addUserToRoom: (roomId: string, userEmail: string) =>
    prismaClient.room.update({
      where: { id: roomId },
      data: {
        users: {
          connect: { email: userEmail },
        },
      },
      include: {
        admin: userPublicModelSelection,
        users: userPublicModelSelection,
      },
    }).then((room) => myParse(RoomSchema, room)),
};
