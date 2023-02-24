import { UserPublicModel } from "./UserPublicModel";

export type MessageModel = {
  id: string;
  author: UserPublicModel;
  content: string;
  createdAt: Date;
};
