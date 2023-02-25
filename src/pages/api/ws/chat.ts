import { messageContentSchema, MessageModel } from "@/models/MessageModel";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import { Server, Socket } from "socket.io";
import uuid from "react-uuid";
import { RoomsStorage } from "@/server/prisma/RoomStorage";
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
      clientSocket.on("join-room", async ({ roomId }) => {
        const room = await RoomsStorage.getRoomById(roomId);
        const userEmail = session.user.email;

        if (!room || !room.users.find((user) => user.email === userEmail)) {
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
        async ({ message, roomId }) => {
          const parseRes = mySafeParse(messageContentSchema, message);
          if (!parseRes.success) {
            emitError(clientSocket, parseRes.errorMessage);
            return;
          }
          const room = await RoomsStorage.getRoomById(roomId);
          const userEmail = session.user.email;

          if (!room || !room.users.find((user) => user.email === userEmail)) {
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
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
            },
            createdAt: new Date(),
          };

          serverSocket.to(roomId).emit("message", {
            message: formattedMessage,
            roomId: roomId,
            roomName: room.name,
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

export default SocketHandler;
