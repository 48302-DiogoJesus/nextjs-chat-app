import {
  messageContentSchema,
  MessageModel,
  MessageSchema,
} from "@/models/MessageModel";
import { TRPCError } from "@trpc/server";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import { Server, Socket } from "socket.io";
import uuid from "react-uuid";
import { RoomsStorage } from "@/server/prisma/RoomStorage";
import {
  SafeParseError,
  SafeParseReturnType,
  SafeParseSuccess,
  ZodError,
  ZodType,
} from "zod";
import { mySafeParse } from "@/utils/mySafeParse";

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
          emitError(
            clientSocket,
            "Cannot join room. It either does not exist or you do not have access to it.",
          );
          return;
        }

        clientSocket.join(roomId);
      });

      clientSocket.on("leave-room", ({ roomId }) => {
        clientSocket.leave(roomId);
      });

      clientSocket.on(
        "client-message",
        ({ message, roomId }) => {
          const parseRes = mySafeParse(messageContentSchema, message);
          if (!parseRes.success) {
            emitError(clientSocket, parseRes.errorMessage);
            return;
          }

          if (!userHasAccessToRoom(session.user!.email!, roomId)) {
            emitError(
              clientSocket,
              "Cannot send message. It either does not exist or you do not have access to it.",
            );
            return;
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

function emitError(clientSocket: Socket, errorMessage: string) {
  clientSocket.emit("chat-error", {
    message: errorMessage,
  });
}

async function userHasAccessToRoom(
  userEmail: string,
  roomId: string,
): Promise<boolean> {
  const room = await RoomsStorage.getRoomById(roomId);

  return (
    !room ||
    !room.users.find((user) => user.email === userEmail)
  );
}

export default SocketHandler;
