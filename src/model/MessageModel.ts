import { UserPublicModel } from "./UserPublicModel";

export type MessageModel = {
  author: UserPublicModel;
  content: string;
  createdAt: Date;
};
