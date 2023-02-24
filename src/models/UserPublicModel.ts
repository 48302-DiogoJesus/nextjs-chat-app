import { User } from "@prisma/client";

export type UserPublicModel = Pick<User, "name" | "email" | "image">;
