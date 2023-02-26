import { UUID } from "@/models/commonSchemas";
import { MessageModel } from "@/models/MessageModel";
import { RoomModel } from "@/models/RoomModel";
import { io, Socket } from "socket.io-client";
import { launchModal } from "../modals/Modal";
import { Notification } from "../notifications/NotificationCtx";

export async function establishInitialWSConnection(
  rooms: RoomModel[],
  setRoomsMessages: (
    setter: (prev: Map<UUID, MessageModel[]>) => Map<UUID, MessageModel[]>,
  ) => void,
  getSelectedRoom: () => RoomModel | null,
  publishNotification: (notification: Notification) => void,
  setSocket: (s: Socket) => void,
): Promise<Socket> {
  await fetch("/api/ws/chat");
  const socket = io();
  setSocket(socket);

  socket.on("connect", () => {
    setRoomsMessages((prev) => {
      for (const room of rooms) {
        socket.emit("join-room", { roomId: room.id });
        // Set in-memory room messages to []
        prev.set(room.id, []);
      }
      // To force re-render :(
      return new Map(prev);
    });
  });

  socket.on("chat-error", ({ message }) => {
    launchModal({
      title: "Chat Error",
      message,
      closeAutomaticAfterSeconds: 10,
    });
  });

  // Event listener for all server messages (from all rooms we are in)
  socket.on(
    "message",
    (
      { message, roomId, roomName }: {
        message: MessageModel;
        roomId: string;
        roomName: string;
      },
    ) => {
      message.createdAt = new Date(message.createdAt);

      setRoomsMessages((prev) => {
        const roomMeta = prev.get(roomId);
        if (!roomMeta) {
          return prev;
        }

        roomMeta.push(message);
        // To force re-render :(
        return new Map(prev);
      });

      const currentSelectedRoom = getSelectedRoom();

      if (!currentSelectedRoom || currentSelectedRoom.id !== roomId) {
        publishNotification({
          title: roomName,
          content: `(${message.author.name}): ${message.content}`,
        });
      }
    },
  );

  return socket;
}
