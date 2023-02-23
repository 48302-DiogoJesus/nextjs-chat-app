import { MessageModel } from "@/model/MessageModel";
import { UserPublicModel } from "@/model/UserPublicModel";
import prismaClient from "@/server/prismaclient";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { Server, Socket } from "socket.io";

type RoomName = string;
const rooms: Map<RoomName, Socket[]> = new Map();

const SocketHandler = async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const session = await getSession({ req });
    if (!session) {
      res.writeHead(401);
      res.end();
      return;
    }

    const serverSocket = new Server(res.socket.server);
    res.socket.server.io = serverSocket;

    serverSocket.on("connection", (clientSocket: Socket) => {
      console.log("Server connected to client");

      clientSocket.on("join-room", ({ roomName }) => {
        if (!userHasAccessToRoom(session.user!.email!, roomName)) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Cannot join room. It either does not exist or you do not have access to it.",
          });
        }

        clientSocket.join(roomName);
        console.log("Joined room:", roomName);
      });

      // ! Concurrency problems potentially
      // Removes client socket from room sockets list
      clientSocket.on("leave-room", ({ roomName }) => {
        clientSocket.leave(roomName);
        console.log("Left room:", roomName);
      });

      clientSocket.on(
        "client-message",
        (
          { message, roomName },
        ) => {
          if (!userHasAccessToRoom(session.user!.email!, roomName)) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message:
                "Cannot send message. It either does not exist or you do not have access to it.",
            });
          }
          console.log(
            "Got message from client",
            message,
            "| ROOM:",
            roomName,
            "| CLient rooms",
            clientSocket.rooms,
          );

          const formattedMessage: MessageModel = {
            content: message,
            author: {
              email: session.user!.email!,
              name: session.user!.name!,
              image: session.user!.image ?? null,
            },
            createdAt: new Date(),
          };

          serverSocket.to(roomName).emit("server-message", formattedMessage);
        },
      );
    });
  }
  res.end();
};

async function userHasAccessToRoom(
  userEmail: string,
  roomName: string,
): Promise<boolean> {
  const room = await prismaClient.room.findUnique({
    where: {
      name: roomName,
    },
    include: { users: true },
  });

  return (
    !room ||
    !room.users.find((user) => user.email === userEmail)
  );
}

export default SocketHandler;
