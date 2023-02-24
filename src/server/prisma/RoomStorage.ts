import { RoomModel } from "@/models/RoomModel";
import prismaClient from "./prismaclient";
import { userPublicModelSelection } from "./selections/UserPublicModelSelection";

/**
 * * To avoid leaking "private" objects properties only the public fields included in the
 * * DB selection using selections inside ./selections
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
    })
      .then((rooms) =>
        rooms.map((r): RoomModel => ({
          id: r.id,
          admin: r.admin,
          name: r.name,
          users: r.users,
          createdAt: r.createdAt,
        }))
      ),

  getRoomById: (roomId: string): Promise<RoomModel | null> =>
    prismaClient.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        users: userPublicModelSelection,
        admin: userPublicModelSelection,
      },
    }),

  createRoomAndSetAdmin: (roomName: string, adminEmail: string) =>
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
    }),

  addUserToRoom: (roomId: string, userEmail: string) =>
    prismaClient.room.update({
      where: { id: roomId },
      data: {
        users: {
          connect: { email: userEmail },
        },
      },
    }),
};
