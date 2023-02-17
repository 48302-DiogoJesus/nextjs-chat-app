import { UserPublicModel } from "./UserPublicModel";

export type RoomModel = {
  id: string;
  name: string;
  users: Array<UserPublicModel>;
};
