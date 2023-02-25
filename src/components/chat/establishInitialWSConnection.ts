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
) {
  await fetch("/api/ws/chat");
  const socket = io();
  setSocket(socket);

  socket.on("connect", () => {
    for (const room of rooms) {
      socket.emit("join-room", { roomId: room.id });
    }
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
        const messages = prev.get(roomId);
        if (messages) {
          messages.push(message);
        } else {
          prev.set(roomId, [message]);
        }
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
}
