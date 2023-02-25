import { z } from "zod";
import { UUID } from "./commonSchemas";
import { UserPublicSchema } from "./UserPublicModel";

export const messageContentSchema = z.string()
  .min(1, "Message is too short")
  .max(4000, "Message is too long");

/***
 * Messages are not stored in DB so we dont need to create a subtype from an existing type
 * (as we did in the RoomModel and UserPublicModel) to hide sensitive fields
 */
export const MessageSchema = z.object({
  id: UUID,
  author: UserPublicSchema,
  // Controlled by user
  content: messageContentSchema,
  createdAt: z.date(),
});

export type MessageModel = z.TypeOf<typeof MessageSchema>;
