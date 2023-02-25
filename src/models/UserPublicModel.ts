import { User } from "@prisma/client";
import { z } from "zod";
import { toZod } from "tozod";

export type UserPublicModel = Pick<User, "name" | "email" | "image">;

export const UserPublicSchema: toZod<UserPublicModel> = z.object({
  // Currently Provided by OAuth2 so we are trusting their name validations to avoid incompatibilities
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
});
