import { MessageModel } from "@/models/MessageModel";
import { UserPublicModel } from "@/models/UserPublicModel";
import { Room, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { Server, Socket } from "socket.io";
import uuid from "react-uuid";
import prismaClient from "@/server/prisma/prismaclient";

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
      clientSocket.on("join-room", ({ roomId }) => {
        if (!userHasAccessToRoom(session.user!.email!, roomId)) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Cannot join room. It either does not exist or you do not have access to it.",
          });
        }

        clientSocket.join(roomId);
      });

      clientSocket.on("leave-room", ({ roomId }) => {
        clientSocket.leave(roomId);
      });

      clientSocket.on(
        "client-message",
        ({ message, roomId }) => {
          if (!userHasAccessToRoom(session.user!.email!, roomId)) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message:
                "Cannot send message. It either does not exist or you do not have access to it.",
            });
          }

          const formattedMessage: MessageModel = {
            id: uuid(),
            content: message,
            author: {
              email: session.user!.email!,
              name: session.user!.name!,
              image: session.user!.image ?? null,
            },
            createdAt: new Date(),
          };

          serverSocket.to(roomId).emit("message", {
            message: formattedMessage,
            roomId: roomId,
          });
        },
      );
    });
  }
  res.end();
};

async function userHasAccessToRoom(
  userEmail: string,
  roomId: string,
): Promise<boolean> {
  const room = await prismaClient.room.findUnique({
    where: { id: roomId },
    include: { users: true },
  });

  return (
    !room ||
    !room.users.find((user) => user.email === userEmail)
  );
}

export default SocketHandler;
